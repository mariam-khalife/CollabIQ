from datetime import date, datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field


PhaseStatus = Literal[
    "not_started",
    "in_progress",
    "completed",
]


class RoadmapPhaseCreate(BaseModel):
    phase_name: str
    phase_order: int
    target_date: date | None = None


class RoadmapCreate(BaseModel):
    project_id: UUID
    generated_by: str = "manual"
    phases: list[RoadmapPhaseCreate]


class RoadmapPhaseStatusUpdate(BaseModel):
    status: PhaseStatus


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
    phases: list[RoadmapPhaseResponse] = Field(default_factory=list)


class RoadmapProgressResponse(BaseModel):
    roadmap_id: UUID
    project_id: UUID
    progress_percentage: float

    total_phases: int
    completed_phases: int

    total_tasks: int
    completed_tasks: int