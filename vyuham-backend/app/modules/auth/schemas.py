from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field, computed_field, field_serializer, field_validator

from app.modules.auth.models import UserRole


class ProfileOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    email: EmailStr
    name: str | None
    phone: str | None
    college: str | None
    degree: str | None = None
    year: str | None = None
    role: UserRole

    @field_serializer("role")
    def serialize_role(self, role: UserRole) -> str:
        if role == UserRole.participant:
            return "user"
        return role.value

    @computed_field
    @property
    def vyuham_id(self) -> str:
        clean = str(self.id).replace("-", "")
        return f"VYU26-OPER-{clean[:4].upper()}"

    @computed_field
    @property
    def vyuhamId(self) -> str:
        clean = str(self.id).replace("-", "")
        return f"VYU26-OPER-{clean[:4].upper()}"


class ProfileUpdate(BaseModel):
    name: str | None = Field(default=None, max_length=120)
    phone: str | None = Field(default=None, max_length=40)
    college: str | None = Field(default=None, max_length=200)
    degree: str | None = Field(default=None, max_length=120)
    year: str | None = Field(default=None, max_length=50)


class RoleAssignRequest(BaseModel):
    user_id: UUID
    role: UserRole

    @field_validator("role", mode="before")
    @classmethod
    def normalize_role(cls, v: Any) -> Any:
        if isinstance(v, str) and v.lower() == "user":
            return UserRole.participant
        return v
