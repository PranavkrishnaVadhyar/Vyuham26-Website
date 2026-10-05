from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ResourceNotFoundError
from app.modules.auth.models import Profile
from app.modules.events.models import Event
from app.modules.hackathon.models import HackathonSubmission, Mentor
from app.modules.hackathon.schemas import SubmissionCreate
from app.modules.registrations.models import Registration
from app.modules.teams.models import Team, TeamMember


def _submission_out(submission: HackathonSubmission, team_name: str) -> dict:
    return {"id": submission.id, "event_id": submission.event_id, "team_id": submission.team_id,
            "team_name": team_name, "repo_url": submission.repo_url, "demo_url": submission.demo_url,
            "description": submission.description, "score": submission.score,
            "submitted_at": submission.submitted_at, "updated_at": submission.updated_at}


async def upsert_submission(db: AsyncSession, event_id: UUID, team_id: UUID, current_user: Profile, data: SubmissionCreate) -> dict:
    if await db.get(Event, event_id) is None:
        raise ResourceNotFoundError("Event")
    team = await db.get(Team, team_id)
    if team is None:
        raise ResourceNotFoundError("Team")
    is_member = await db.scalar(select(TeamMember.id).where(TeamMember.team_id == team_id, TeamMember.user_id == current_user.id))
    if is_member is None:
        raise PermissionError("You must be a member of this team to submit")
    registered = await db.scalar(select(Registration.id).where(Registration.event_id == event_id, Registration.team_id == team_id))
    if registered is None:
        raise ValueError("team must be registered for this event before submitting")
    submission = await db.scalar(select(HackathonSubmission).where(HackathonSubmission.event_id == event_id, HackathonSubmission.team_id == team_id))
    if submission is None:
        values = data.model_dump(exclude={"team_id"})
        submission = HackathonSubmission(event_id=event_id, team_id=team_id, **values)
        db.add(submission)
    else:
        for key, value in data.model_dump(exclude={"team_id"}).items():
            setattr(submission, key, value)
        submission.updated_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(submission)
    return _submission_out(submission, team.name)


async def get_my_submission(db: AsyncSession, event_id: UUID, user_id: UUID) -> dict | None:
    result = await db.execute(select(HackathonSubmission, Team.name).join(Team, Team.id == HackathonSubmission.team_id)
                              .join(TeamMember, TeamMember.team_id == Team.id)
                              .where(HackathonSubmission.event_id == event_id, TeamMember.user_id == user_id)
                              .order_by(HackathonSubmission.submitted_at))
    first = result.first()
    if first is None:
        return None
    return _submission_out(first[0], first[1])


async def list_submissions(db: AsyncSession, event_id: UUID) -> list[dict]:
    result = await db.execute(select(HackathonSubmission, Team.name).join(Team, Team.id == HackathonSubmission.team_id)
                              .where(HackathonSubmission.event_id == event_id).order_by(HackathonSubmission.submitted_at))
    return [_submission_out(submission, name) for submission, name in result.all()]


async def set_score(db: AsyncSession, event_id: UUID, submission_id: UUID, score, current_user: Profile) -> HackathonSubmission:
    if current_user.role.value not in {"admin", "event_head"}:
        raise PermissionError("Only admins or event heads can score submissions")
    submission = await db.get(HackathonSubmission, submission_id)
    if submission is None or submission.event_id != event_id:
        raise ResourceNotFoundError("Hackathon submission")
    submission.score = score
    await db.commit()
    await db.refresh(submission)
    return submission


async def get_leaderboard(db: AsyncSession, event_id: UUID) -> list[dict]:
    result = await db.execute(select(Team.name, HackathonSubmission.score)
        .join(Team, Team.id == HackathonSubmission.team_id)
        .where(HackathonSubmission.event_id == event_id, HackathonSubmission.score.is_not(None))
        .order_by(HackathonSubmission.score.desc(), Team.name))
    return [{"team_name": name, "score": score} for name, score in result.all()]


async def list_mentors(db: AsyncSession, event_id: UUID) -> list[Mentor]:
    return list(await db.scalars(select(Mentor).where(Mentor.event_id == event_id).order_by(Mentor.slot_time, Mentor.name)))


async def create_mentor(db: AsyncSession, event_id: UUID, data) -> Mentor:
    if await db.get(Event, event_id) is None:
        raise ResourceNotFoundError("Event")
    mentor = Mentor(event_id=event_id, **data.model_dump())
    db.add(mentor)
    await db.commit()
    await db.refresh(mentor)
    return mentor
