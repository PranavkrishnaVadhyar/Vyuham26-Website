from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.modules.auth.models import UserRole


class ProfileOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    email: EmailStr
    name: str | None
    phone: str | None
    college: str | None
    role: UserRole


class ProfileUpdate(BaseModel):
    name: str | None = Field(default=None, max_length=120)
    phone: str | None = Field(default=None, max_length=40)
    college: str | None = Field(default=None, max_length=200)


class RoleAssignRequest(BaseModel):
    user_id: UUID
    role: UserRole
