import uuid
from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, Float, ForeignKey, Index, String, UniqueConstraint, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base
from .constants import INVITATION_STATUSES, TEAM_STATUSES


class Team(Base):
    __tablename__ = "teams"
    __table_args__ = (CheckConstraint(f"status IN {TEAM_STATUSES}", name="ck_teams_status"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    team_name: Mapped[str] = mapped_column(String(255), nullable=False)
    leader_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    readiness_score: Mapped[float] = mapped_column(Float, default=0.0, server_default=text("0"))
    status: Mapped[str] = mapped_column(String(20), default="forming", server_default="forming")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

    invitations: Mapped[list["TeamInvitation"]] = relationship(back_populates="team", cascade="all, delete-orphan")
    members: Mapped[list["TeamMember"]] = relationship(back_populates="team", cascade="all, delete-orphan")
    match_suggestions: Mapped[list["MatchSuggestion"]] = relationship(
        back_populates="team", cascade="all, delete-orphan"
    )
    recommendations: Mapped[list["ProjectRecommendation"]] = relationship(
        back_populates="team", cascade="all, delete-orphan"
    )
    project: Mapped["Project | None"] = relationship(back_populates="team", uselist=False)


class TeamInvitation(Base):
    __tablename__ = "team_invitations"
    __table_args__ = (
        CheckConstraint(f"status IN {INVITATION_STATUSES}", name="ck_team_invitations_status"),
        # Only one pending invitation per (team, invited user) at a time - a user can be
        # re-invited after declining, but not double-invited while a decision is outstanding.
        Index(
            "uq_team_invitations_pending_per_user",
            "team_id",
            "invited_user_id",
            unique=True,
            postgresql_where=text("status = 'pending'"),
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    team_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("teams.id"), nullable=False)
    invited_user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    invited_by: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    proposed_role_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("roles.id"), nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="pending", server_default="pending")
    sent_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    responded_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    team: Mapped["Team"] = relationship(back_populates="invitations")
    member: Mapped["TeamMember | None"] = relationship(back_populates="invitation", uselist=False)


class TeamMember(Base):
    __tablename__ = "team_members"
    __table_args__ = (UniqueConstraint("team_id", "user_id", name="uq_team_members_team_user"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    team_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("teams.id"), nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    role_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("roles.id"), nullable=False)
    invitation_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("team_invitations.id"), unique=True, nullable=False
    )
    has_committed: Mapped[bool] = mapped_column(default=False, server_default=text("false"))
    joined_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

    team: Mapped["Team"] = relationship(back_populates="members")
    invitation: Mapped["TeamInvitation"] = relationship(back_populates="member")
    tasks: Mapped[list["Task"]] = relationship(back_populates="assignee")


class MatchSuggestion(Base):
    __tablename__ = "match_suggestions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    team_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("teams.id"), nullable=False)
    suggested_user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    suggested_role_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("roles.id"), nullable=False)
    match_score: Mapped[float] = mapped_column(Float, nullable=False)
    generated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

    team: Mapped["Team"] = relationship(back_populates="match_suggestions")
