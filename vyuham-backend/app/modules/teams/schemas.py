from datetime import datetime
from typing import Optional
from uuid import UUID


from pydantic import BaseModel, ConfigDict, Field


class TeamCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)


class TeamJoinRequest(BaseModel):
    invite_code: str = Field(min_length=6, max_length=8)


class TeamOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    invite_code: str
    created_by: UUID
    created_at: datetime
    member_count: int


class TeamMemberOut(BaseModel):
    user_id: UUID
    email: str
    name: Optional[str] = None
    joined_at: datetime



class TeamDetailOut(TeamOut):
    members: list[TeamMemberOut]
