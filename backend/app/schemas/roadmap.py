from datetime import date, datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field, field_validator


PhaseStatus = Literal[
    "todo",
    "in_progress",
    "done",
]


class RoadmapPhaseCreate(BaseModel):
    phase_name: str = Field(min_length=1, max_length=255)
    phase_order: int = Field(ge=1)
    target_date: date | None = None

    @field_validator("phase_name")
    @classmethod
    def validate_phase_name(cls, value: str) -> str:
        cleaned_value = value.strip()

        if not cleaned_value:
            raise ValueError("Phase name cannot be empty")

        return cleaned_value


class RoadmapPhaseUpdate(BaseModel):
    phase_name: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
    )
    phase_order: int | None = Field(
        default=None,
        ge=1,
    )
    target_date: date | None = None

    @field_validator("phase_name")
    @classmethod
    def validate_phase_name(cls, value: str | None):
        if value is None:
            return value

        cleaned_value = value.strip()

        if not cleaned_value:
            raise ValueError("Phase name cannot be empty")

        return cleaned_value


class RoadmapCreate(BaseModel):
    project_id: UUID
    generated_by: str = "manual"
    phases: list[RoadmapPhaseCreate] = Field(
        min_length=1,
    )


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
    phases: list[RoadmapPhaseResponse] = Field(
        default_factory=list
    )


class RoadmapProgressResponse(BaseModel):
    roadmap_id: UUID
    project_id: UUID
    progress_percentage: float

    total_phases: int
    completed_phases: int

    total_tasks: int
    completed_tasks: int