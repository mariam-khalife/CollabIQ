from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr


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

class TeamInvitationDetailsResponse(BaseModel):
    id: UUID
    invited_user_id: UUID
    invited_user_name: str
    invited_user_email: EmailStr
    proposed_role_id: UUID
    proposed_role_name: str
    status: str
    sent_at: datetime
    responded_at: datetime | None = None

class MyInvitationResponse(BaseModel):
    id: UUID
    team_id: UUID
    team_name: str
    invited_by: UUID
    inviter_name: str
    proposed_role_id: UUID
    proposed_role_name: str
    status: str
    sent_at: datetime
    responded_at: datetime | None = None