from uuid import UUID

from pydantic import BaseModel


class ProjectCreate(BaseModel):
    team_id: UUID
    recommendation_id: UUID | None = None
    title: str
    description: str | None = None


class ProjectUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    status: str | None = None


class ProjectResponse(BaseModel):
    id: UUID
    team_id: UUID
    recommendation_id: UUID | None = None
    title: str
    description: str | None = None
    status: str

    model_config = {
        "from_attributes": True
    }