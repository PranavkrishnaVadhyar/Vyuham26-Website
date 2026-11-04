from pydantic import BaseModel, EmailStr, Field


class ContactCreateRequest(BaseModel):
    name: str = Field(min_length=1, max_length=160)
    organization: str | None = Field(default=None, max_length=200)
    email: EmailStr
    phone: str | None = Field(default=None, max_length=40)
    tier: str | None = Field(default=None, max_length=60)
    message: str = Field(min_length=1, max_length=3000)


class FeedbackCreateRequest(BaseModel):
    rating: int = Field(ge=1, le=5)
    comments: str = Field(min_length=1, max_length=3000)
    # Kept for older clients but ignored by the API; identity comes only
    # from a verified bearer token.
    user_id: str | None = Field(default=None, max_length=64)
