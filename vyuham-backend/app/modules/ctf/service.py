import hashlib
import hmac
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ResourceNotFoundError
from app.modules.auth.models import Profile
from app.modules.ctf.models import CTFChallenge, CTFSubmission
from app.modules.ctf.schemas import ChallengeCreate, ChallengeUpdate
from app.modules.events.models import Event, RegistrationType
from app.modules.teams.models import Team, TeamMember


def hash_flag(plaintext: str) -> str:
    return hashlib.sha256(plaintext.encode("utf-8")).hexdigest()


async def create_challenge(db: AsyncSession, event_id: UUID, data: ChallengeCreate, _current_user: Profile) -> CTFChallenge:
    if _current_user.role.value != "admin":
        raise PermissionError("Only admins can create CTF challenges")
    if await db.get(Event, event_id) is None:
        raise ResourceNotFoundError("Event")
    challenge = CTFChallenge(event_id=event_id, title=data.title, description=data.description,
        category=data.category, track=data.track, points=data.points, flag_hash=hash_flag(data.flag))
    db.add(challenge)
    await db.commit()
    await db.refresh(challenge)
    return challenge


async def update_challenge(db: AsyncSession, event_id: UUID, challenge_id: UUID, data: ChallengeUpdate) -> CTFChallenge:
    challenge = await db.get(CTFChallenge, challenge_id)
    if challenge is None or challenge.event_id != event_id:
        raise ResourceNotFoundError("CTF challenge")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(challenge, field, value)
    await db.commit()
    await db.refresh(challenge)
    return challenge


async def list_challenges(db: AsyncSession, event_id: UUID, track=None) -> list[CTFChallenge]:
    query = select(CTFChallenge).where(CTFChallenge.event_id == event_id, CTFChallenge.is_active.is_(True))
    if track is not None:
        query = query.where(CTFChallenge.track == track)
    return list(await db.scalars(query.order_by(CTFChallenge.points, CTFChallenge.title)))


async def submit_flag(db: AsyncSession, event_id: UUID, challenge_id: UUID, submitted_flag: str,
                      current_user: Profile, team_id: UUID | None = None) -> bool:
    challenge = await db.get(CTFChallenge, challenge_id)
    if challenge is None or challenge.event_id != event_id or not challenge.is_active:
        raise ResourceNotFoundError("Active CTF challenge")
    event = await db.get(Event, event_id)
    if event is None:
        raise ResourceNotFoundError("Event")
    if event.registration_type == RegistrationType.team:
        if team_id is None:
            raise ValueError("A team_id is required for this team event")
        if await db.get(Team, team_id) is None:
            raise ResourceNotFoundError("Team")
        member = await db.scalar(select(TeamMember.id).where(TeamMember.team_id == team_id, TeamMember.user_id == current_user.id))
        if member is None:
            raise PermissionError("You must be a member of this team to submit a flag")
        scorer_filter = (CTFSubmission.team_id == team_id)
        user_id = None
        scorer_team_id = team_id
    elif event.registration_type == RegistrationType.solo:
        if team_id is not None:
            raise ValueError("This is a solo event; do not provide a team_id")
        scorer_filter = (CTFSubmission.user_id == current_user.id)
        user_id = current_user.id
        scorer_team_id = None
    else:
        raise ValueError("Unsupported event registration type")

    already_solved = await db.scalar(select(CTFSubmission.id).where(
        CTFSubmission.challenge_id == challenge_id, CTFSubmission.is_correct.is_(True), scorer_filter))
    if already_solved is not None:
        raise ValueError("This scorer has already solved this challenge")
    correct = hmac.compare_digest(hash_flag(submitted_flag), challenge.flag_hash)
    db.add(CTFSubmission(challenge_id=challenge_id, team_id=scorer_team_id, user_id=user_id, is_correct=correct))
    await db.commit()
    return correct


async def get_scoreboard(db: AsyncSession, event_id: UUID) -> list[dict]:
    event = await db.get(Event, event_id)
    if event is None:
        raise ResourceNotFoundError("Event")
    if event.registration_type == RegistrationType.team:
        stmt = (select(Team.name.label("scorer_name"), func.sum(CTFChallenge.points).label("total_points"),
                func.count(func.distinct(CTFChallenge.id)).label("solved_count"), func.max(CTFSubmission.submitted_at).label("last_solve"))
            .join(CTFSubmission, CTFSubmission.team_id == Team.id)
            .join(CTFChallenge, (CTFChallenge.id == CTFSubmission.challenge_id) & (CTFChallenge.event_id == event_id))
            .where(CTFSubmission.is_correct.is_(True)).group_by(Team.id, Team.name))
    else:
        stmt = (select(Profile.name.label("scorer_name"), func.sum(CTFChallenge.points).label("total_points"),
                func.count(func.distinct(CTFChallenge.id)).label("solved_count"), func.max(CTFSubmission.submitted_at).label("last_solve"))
            .join(CTFSubmission, CTFSubmission.user_id == Profile.id)
            .join(CTFChallenge, (CTFChallenge.id == CTFSubmission.challenge_id) & (CTFChallenge.event_id == event_id))
            .where(CTFSubmission.is_correct.is_(True)).group_by(Profile.id, Profile.name))
    stmt = stmt.order_by(func.sum(CTFChallenge.points).desc(), func.max(CTFSubmission.submitted_at), "scorer_name")
    result = await db.execute(stmt)
    return [{"scorer_name": name or "Participant", "total_points": int(points or 0), "solved_count": int(count)}
            for name, points, count, _ in result.all()]
