from uuid import UUID

from sqlalchemy import func, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ResourceNotFoundError
from app.modules.auth.models import Profile
from app.modules.events.models import Event, RegistrationType
from app.modules.registrations.models import Registration, RegistrationStatus
from app.modules.teams.models import Team, TeamMember


async def register_for_event(
    db: AsyncSession,
    event_id: UUID,
    current_user: Profile,
    team_id: UUID | None = None,
) -> Registration:
    """Validate event kind, membership, size, and duplicates before inserting."""
    event = await db.get(Event, event_id)
    if event is None:
        raise ResourceNotFoundError("Event")

    if event.registration_type == RegistrationType.solo:
        if team_id is not None:
            raise ValueError("This is a solo event; do not provide a team_id")
        duplicate = await db.scalar(
            select(Registration.id).where(
                Registration.event_id == event_id,
                Registration.user_id == current_user.id,
                Registration.team_id.is_(None),
            )
        )
        if duplicate is not None:
            raise ValueError("You have already registered for this event")
        registration = Registration(
            event_id=event_id,
            user_id=current_user.id,
            team_id=None,
            status=RegistrationStatus.pending,
        )
    elif event.registration_type == RegistrationType.team:
        if team_id is None:
            raise ValueError("This is a team event; provide a team_id")
        if await db.get(Team, team_id) is None:
            raise ResourceNotFoundError("Team")
        is_member = await db.scalar(
            select(TeamMember.id).where(
                TeamMember.team_id == team_id,
                TeamMember.user_id == current_user.id,
            )
        )
        if is_member is None:
            raise PermissionError("You must be a member of this team to register it")
        member_count = await db.scalar(
            select(func.count(TeamMember.id)).where(TeamMember.team_id == team_id)
        )
        minimum, maximum = event.team_size_min, event.team_size_max
        # The event schema requires both bounds for team events, but fail safely if old data is malformed.
        if minimum is None or maximum is None or not minimum <= member_count <= maximum:
            if minimum is None or maximum is None:
                raise ValueError("This event has invalid team size settings; contact an administrator")
            raise ValueError(f"Team must have between {minimum} and {maximum} members; it currently has {member_count}")
        duplicate = await db.scalar(
            select(Registration.id).where(
                Registration.event_id == event_id,
                Registration.team_id == team_id,
            )
        )
        if duplicate is not None:
            raise ValueError("This team has already registered for this event")
        registration = Registration(
            event_id=event_id,
            user_id=current_user.id,
            team_id=team_id,
            status=RegistrationStatus.pending,
        )
    else:
        raise ValueError("Unsupported event registration type")

    db.add(registration)
    try:
        await db.commit()
    except IntegrityError:
        # The unique partial indexes also prevent duplicates under concurrent requests.
        await db.rollback()
        raise ValueError("This user or team is already registered for this event") from None
    await db.refresh(registration)
    return registration


async def cancel_registration(
    db: AsyncSession,
    registration_id: UUID,
    current_user: Profile,
) -> None:
    registration = await get_registration(db, registration_id)
    if current_user.role.value != "admin" and registration.user_id != current_user.id:
        raise PermissionError("Only the registration submitter or an admin can cancel it")
    if registration.status != RegistrationStatus.pending:
        raise ValueError("Only pending registrations can be cancelled")
    registration.status = RegistrationStatus.cancelled
    await db.commit()


async def update_status(
    db: AsyncSession,
    registration_id: UUID,
    new_status: RegistrationStatus,
) -> Registration:
    registration = await get_registration(db, registration_id)
    registration.status = new_status
    await db.commit()
    await db.refresh(registration)
    return registration


async def get_registration(db: AsyncSession, registration_id: UUID) -> Registration:
    registration = await db.get(Registration, registration_id)
    if registration is None:
        raise ResourceNotFoundError("Registration")
    return registration


async def list_user_registrations(db: AsyncSession, user_id: UUID) -> list[Registration]:
    result = await db.scalars(
        select(Registration)
        .outerjoin(TeamMember, TeamMember.team_id == Registration.team_id)
        .where(or_(Registration.user_id == user_id, TeamMember.user_id == user_id))
        .distinct()
        .order_by(Registration.created_at.desc())
    )
    return list(result)


async def can_view_registration(db: AsyncSession, registration: Registration, user_id: UUID) -> bool:
    if registration.user_id == user_id:
        return True
    if registration.team_id is None:
        return False
    return await db.scalar(
        select(TeamMember.id).where(
            TeamMember.team_id == registration.team_id,
            TeamMember.user_id == user_id,
        )
    ) is not None
