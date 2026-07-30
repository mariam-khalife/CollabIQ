from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class ProjectRecommendationResponse(BaseModel):
    id: UUID
    team_id: UUID
    title: str
    description: str

    difficulty_level: str | None = None
    required_technologies: list[str] = []

    confidence_score: float = Field(
        ge=0,
        le=1,
    )

    created_at: datetime

    model_config = {
        "from_attributes": True,
    }