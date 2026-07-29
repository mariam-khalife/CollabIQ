from uuid import UUID

from pydantic import BaseModel, Field


class TeammateRecommendationResponse(BaseModel):
    user_id: UUID
    name: str
    role: str
    email: str
    compatibility_score: float = Field(ge=0, le=1)
    reason: str

    university: str | None = None
    bio: str | None = None
    availability: str | None = None
    experience_level: str | None = None
    skills: list[str] = []
    interests: list[str] = []