from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy import case, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ResourceNotFoundError
from app.modules.auth.models import Profile
from app.modules.events.models import Event
from app.modules.hackathon.models import HackathonMentorRequest, HackathonSubmission, Mentor
from app.modules.hackathon.schemas import MentorRequestCreate, SubmissionCreate
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


async def list_milestones(db: AsyncSession, event_id: UUID) -> list[dict]:
    hackathon = await db.get(Event, event_id)
    if hackathon is None or hackathon.slug != "hackathon":
        raise ResourceNotFoundError("Event")

    milestone_order = ["hackathon", "hackathon-continues", "hackathon-demos", "hackathon-winners"]
    order_expression = case(
        {slug: index for index, slug in enumerate(milestone_order)},
        value=Event.slug,
        else_=len(milestone_order),
    )
    events = list(
        await db.scalars(
            select(Event)
            .where(Event.slug.in_(milestone_order))
            .order_by(order_expression)
        )
    )
    milestones = []
    for event in events:
        event_state = (event.status or "").strip().lower()
        status = (
            "COMPLETE" if event_state in {"complete", "completed", "finished", "ended"}
            else "ACTIVE" if event_state in {"active", "live", "ongoing", "in_progress"}
            else "PENDING"
        )
        if event.start_time is not None:
            event_time = event.start_time.strftime("%d %b • %I:%M %p")
        elif event.day is not None:
            event_time = f"OCT {29 + event.day} • {event.time or 'TIME TBD'}"
        else:
            event_time = event.time or "SCHEDULE TBD"
        milestones.append(
            {
                "id": event.id,
                "title": event.name,
                "time": event_time,
                "status": status,
                "description": event.description or event.blurb,
                "venue": event.venue,
            }
        )
    return milestones


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


async def create_mentor_request(
    db: AsyncSession, event_id: UUID, current_user: Profile, data: MentorRequestCreate
) -> HackathonMentorRequest:
    if await db.get(Event, event_id) is None:
        raise ResourceNotFoundError("Event")

    pending_request = await db.scalar(
        select(HackathonMentorRequest.id).where(
            HackathonMentorRequest.event_id == event_id,
            HackathonMentorRequest.requester_id == current_user.id,
            HackathonMentorRequest.status.in_(["pending", "accepted"]),
        )
    )
    if pending_request is not None:
        raise ValueError("You already have an active mentor request for this hackathon")

    if data.team_id is not None:
        team = await db.get(Team, data.team_id)
        if team is None:
            raise ResourceNotFoundError("Team")
        membership = await db.scalar(
            select(TeamMember.id).where(
                TeamMember.team_id == data.team_id,
                TeamMember.user_id == current_user.id,
            )
        )
        if membership is None:
            raise PermissionError("You must be a member of this team to request its mentor support")

    if data.mentor_id is not None:
        mentor = await db.get(Mentor, data.mentor_id)
        if mentor is None or mentor.event_id != event_id:
            raise ResourceNotFoundError("Mentor")

    request = HackathonMentorRequest(
        event_id=event_id,
        requester_id=current_user.id,
        **data.model_dump(),
    )
    db.add(request)
    await db.commit()
    await db.refresh(request)
    return request


async def list_my_mentor_requests(
    db: AsyncSession, event_id: UUID, user_id: UUID
) -> list[HackathonMentorRequest]:
    result = await db.scalars(
        select(HackathonMentorRequest)
        .where(
            HackathonMentorRequest.event_id == event_id,
            HackathonMentorRequest.requester_id == user_id,
        )
        .order_by(HackathonMentorRequest.created_at.desc())
    )
    return list(result)


async def list_mentor_requests(
    db: AsyncSession, event_id: UUID
) -> list[dict]:
    result = await db.execute(
        select(
            HackathonMentorRequest,
            Profile.name,
            Profile.email,
            Team.name,
        )
        .join(Profile, Profile.id == HackathonMentorRequest.requester_id)
        .outerjoin(Team, Team.id == HackathonMentorRequest.team_id)
        .where(HackathonMentorRequest.event_id == event_id)
        .order_by(HackathonMentorRequest.created_at.desc())
    )
    rows = []
    for request, requester_name, requester_email, team_name in result.all():
        rows.append(
            {
                "id": request.id,
                "event_id": request.event_id,
                "requester_id": request.requester_id,
                "team_id": request.team_id,
                "mentor_id": request.mentor_id,
                "message": request.message,
                "status": request.status,
                "created_at": request.created_at,
                "updated_at": request.updated_at,
                "requester_name": requester_name,
                "requester_email": requester_email,
                "team_name": team_name,
            }
        )
    return rows


async def update_mentor_request_status(
    db: AsyncSession, event_id: UUID, request_id: UUID, status: str
) -> HackathonMentorRequest:
    request = await db.get(HackathonMentorRequest, request_id)
    if request is None or request.event_id != event_id:
        raise ResourceNotFoundError("Hackathon mentor request")
    request.status = status
    request.updated_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(request)
    return request
