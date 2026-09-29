from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_db
from app.core.deps import get_current_user, require_role
from app.modules.auth.models import Profile
from app.modules.registrations.schemas import RegistrationCreate, RegistrationOut, RegistrationStatusUpdate
from app.modules.registrations.service import (
    can_view_registration,
    cancel_registration,
    get_registration,
    list_user_registrations,
    register_for_event,
    update_status,
)

router = APIRouter(prefix="/registrations", tags=["registrations"])


@router.post("", response_model=RegistrationOut, status_code=status.HTTP_201_CREATED)
async def post_registration(
    data: RegistrationCreate,
    current_user: Annotated[Profile, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> object:
    try:
        return await register_for_event(db, data.event_id, current_user, data.team_id)
    except PermissionError as exc:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.get("/me", response_model=list[RegistrationOut])
async def read_my_registrations(
    current_user: Annotated[Profile, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> list:
    return await list_user_registrations(db, current_user.id)


@router.get("/{registration_id}", response_model=RegistrationOut)
async def read_registration(
    registration_id: UUID,
    current_user: Annotated[Profile, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> object:
    registration = await get_registration(db, registration_id)
    privileged = current_user.role.value in {"admin", "event_head"}
    if not privileged and not await can_view_registration(db, registration, current_user.id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You cannot view this registration")
    return registration


@router.patch("/{registration_id}/status", response_model=RegistrationOut)
async def patch_registration_status(
    registration_id: UUID,
    data: RegistrationStatusUpdate,
    _: Annotated[Profile, Depends(require_role("admin", "event_head"))],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> object:
    return await update_status(db, registration_id, data.status)


@router.delete("/{registration_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_registration(
    registration_id: UUID,
    current_user: Annotated[Profile, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> Response:
    try:
        await cancel_registration(db, registration_id, current_user)
    except PermissionError as exc:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    return Response(status_code=status.HTTP_204_NO_CONTENT)
