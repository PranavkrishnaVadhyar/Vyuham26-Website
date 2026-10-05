import secrets
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ResourceNotFoundError
from app.modules.auth.models import Profile
from app.modules.teams.models import Team, TeamMember

_INVITE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"


def _team_data(team: Team, member_count: int) -> dict:
    return {
        "id": team.id,
        "name": team.name,
        "invite_code": team.invite_code,
        "created_by": team.created_by,
        "created_at": team.created_at,
        "member_count": member_count,
    }


async def generate_invite_code(db: AsyncSession, length: int = 8) -> str:
    """Generate an easy-to-read code and check it before returning it."""
    while True:
        code = "".join(secrets.choice(_INVITE_ALPHABET) for _ in range(length))
        if await db.scalar(select(Team.id).where(Team.invite_code == code)) is None:
            return code


def _constraint_name(exc: IntegrityError) -> str | None:
    original = exc.orig
    return getattr(original, "constraint_name", None) or getattr(getattr(original, "__cause__", None), "constraint_name", None)


async def create_team(db: AsyncSession, name: str, creator: Profile) -> dict:
    """Create the team and creator membership in one transaction."""
    for _ in range(5):
        team = Team(name=name.strip(), invite_code=await generate_invite_code(db), created_by=creator.id)
        db.add(team)
        try:
            await db.flush()
            db.add(TeamMember(team_id=team.id, user_id=creator.id))
            await db.commit()
            await db.refresh(team)
            return _team_data(team, 1)
        except IntegrityError as exc:
            await db.rollback()
            # A concurrent request can claim the code after our availability check.
            if _constraint_name(exc) == "uq_teams_invite_code":
                continue
            raise
    raise RuntimeError("Could not generate a unique team invite code; please retry")


async def join_team(db: AsyncSession, invite_code: str, user: Profile) -> Team:
    team = await db.scalar(select(Team).where(Team.invite_code == invite_code.upper()))
    if team is None:
        raise ResourceNotFoundError("Team invite code")
    member = await db.scalar(
        select(TeamMember.id).where(TeamMember.team_id == team.id, TeamMember.user_id == user.id)
    )
    if member is not None:
        raise ValueError("You are already a member of this team")
    db.add(TeamMember(team_id=team.id, user_id=user.id))
    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise ValueError("You are already a member of this team") from None
    return team


async def list_user_teams(db: AsyncSession, user_id: UUID) -> list[dict]:
    result = await db.execute(
        select(Team, func.count(TeamMember.id).label("member_count"))
        .join(TeamMember, TeamMember.team_id == Team.id)
        .where(TeamMember.user_id == user_id)
        .group_by(Team.id)
        .order_by(Team.created_at.desc())
    )
    return [_team_data(row[0], row[1]) for row in result.all()]


async def get_team_with_members(db: AsyncSession, team_id: UUID) -> dict:
    team = await db.get(Team, team_id)
    if team is None:
        raise ResourceNotFoundError("Team")
    result = await db.execute(
        select(TeamMember.user_id, Profile.email, Profile.name, TeamMember.joined_at)
        .join(Profile, Profile.id == TeamMember.user_id)
        .where(TeamMember.team_id == team_id)
        .order_by(TeamMember.joined_at)
    )
    members = [
        {"user_id": row.user_id, "email": row.email, "name": row.name, "joined_at": row.joined_at}
        for row in result.all()
    ]
    return {**_team_data(team, len(members)), "members": members}



async def is_team_member(db: AsyncSession, team_id: UUID, user_id: UUID) -> bool:
    return await db.scalar(
        select(TeamMember.id).where(TeamMember.team_id == team_id, TeamMember.user_id == user_id)
    ) is not None
