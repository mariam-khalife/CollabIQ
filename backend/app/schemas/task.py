from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel


class TaskCreate(BaseModel):
    phase_id: UUID
    assigned_to: UUID | None = None
    title: str
    description: str | None = None
    deadline: date | None = None
    priority: str = "medium"


class TaskUpdate(BaseModel):
    assigned_to: UUID | None = None
    title: str | None = None
    description: str | None = None
    deadline: date | None = None
    priority: str | None = None
    status: str | None = None


class TaskStatusUpdate(BaseModel):
    status: str


class TaskResponse(BaseModel):
    id: UUID
    phase_id: UUID
    assigned_to: UUID | None
    title: str
    description: str | None
    deadline: date | None
    priority: str
    status: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }