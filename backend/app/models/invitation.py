import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class TeamInvitation(Base):
    __tablename__ = "team_invitations"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    team_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("teams.id"), nullable=False)
    invited_user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    invited_by: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    proposed_role_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("roles.id"), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="pending")
    sent_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    responded_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)