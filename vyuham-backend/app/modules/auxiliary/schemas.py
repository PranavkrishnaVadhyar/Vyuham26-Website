from pydantic import BaseModel, EmailStr, Field


class ContactCreateRequest(BaseModel):
    name: str = Field(min_length=1, max_length=160)
    organization: str | None = Field(default=None, max_length=200)
    email: EmailStr
    phone: str | None = Field(default=None, max_length=40)
    tier: str | None = Field(default=None, max_length=60)
    message: str = Field(min_length=1)


class FeedbackCreateRequest(BaseModel):
    rating: int = Field(ge=1, le=5)
    comments: str = Field(min_length=1)
    user_id: str | None = None
