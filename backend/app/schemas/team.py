from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class TeamCreate(BaseModel):
    team_name: str


class TeamResponse(BaseModel):
    id: UUID
    team_name: str
    leader_id: UUID
    readiness_score: float
    status: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }

class TeamMemberResponse(BaseModel):
    id: UUID
    team_id: UUID
    user_id: UUID
    role_id: UUID
    invitation_id: UUID
    has_committed: bool
    joined_at: datetime

    model_config = {
        "from_attributes": True
    }