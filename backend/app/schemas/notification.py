from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel

NotificationType = Literal["invitation", "task_assignment", "deadline_reminder", "team_update", "project_update"]


class NotificationResponse(BaseModel):
    id: UUID
    type: NotificationType
    title: str
    message: str
    is_read: bool
    created_at: datetime
    related_id: UUID | None = None
    action_url: str | None = None

    model_config = {"from_attributes": True}


class UnreadCountResponse(BaseModel):
    count: int