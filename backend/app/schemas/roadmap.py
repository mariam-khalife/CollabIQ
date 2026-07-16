from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel


class RoadmapPhaseCreate(BaseModel):
    phase_name: str
    phase_order: int
    target_date: date | None = None


class RoadmapCreate(BaseModel):
    project_id: UUID
    generated_by: str = "manual"
    phases: list[RoadmapPhaseCreate]


class RoadmapPhaseResponse(BaseModel):
    id: UUID
    roadmap_id: UUID
    phase_name: str
    phase_order: int
    target_date: date | None
    status: str

    model_config = {
        "from_attributes": True
    }


class RoadmapResponse(BaseModel):
    id: UUID
    project_id: UUID
    generated_by: str
    created_at: datetime
    phases: list[RoadmapPhaseResponse] = []