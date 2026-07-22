from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class ReputationEventCreate(BaseModel):
    activity_type: str = Field(
        min_length=2,
        max_length=50,
    )
    points: int = Field(
        ge=-100,
        le=100,
    )


class ReputationLogResponse(BaseModel):
    id: UUID
    user_id: UUID
    activity_type: str
    points: int
    logged_at: datetime

    model_config = {
        "from_attributes": True
    }


class ReputationSummaryResponse(BaseModel):
    user_id: UUID
    score: int
    level: str
    total_events: int
    history: list[ReputationLogResponse]