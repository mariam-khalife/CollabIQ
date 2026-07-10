from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class InvitationCreate(BaseModel):
    invited_user_id: UUID
    proposed_role_id: UUID


class InvitationResponse(BaseModel):
    id: UUID
    team_id: UUID
    invited_user_id: UUID
    invited_by: UUID
    proposed_role_id: UUID
    status: str
    sent_at: datetime
    responded_at: datetime | None = None

    model_config = {
        "from_attributes": True
    }