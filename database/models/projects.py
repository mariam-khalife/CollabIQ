import uuid
from datetime import date, datetime

from sqlalchemy import Date, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class ProjectRecommendation(Base):
    __tablename__ = "project_recommendations"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    team_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("teams.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    confidence_score: Mapped[float] = mapped_column(Float, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

    team: Mapped["Team"] = relationship(back_populates="recommendations")
    project: Mapped["Project | None"] = relationship(back_populates="recommendation", uselist=False)


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    team_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("teams.id"), unique=True, nullable=False)
    recommendation_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("project_recommendations.id"), unique=True, nullable=False
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="accepted")

    team: Mapped["Team"] = relationship(back_populates="project")
    recommendation: Mapped["ProjectRecommendation"] = relationship(back_populates="project")
    roadmap: Mapped["Roadmap | None"] = relationship(back_populates="project", uselist=False)


class Roadmap(Base):
    __tablename__ = "roadmaps"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("projects.id"), unique=True, nullable=False
    )
    generated_by: Mapped[str] = mapped_column(String(50), default="ai")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

    project: Mapped["Project"] = relationship(back_populates="roadmap")
    phases: Mapped[list["RoadmapPhase"]] = relationship(
        back_populates="roadmap", cascade="all, delete-orphan", order_by="RoadmapPhase.phase_order"
    )


class RoadmapPhase(Base):
    __tablename__ = "roadmap_phases"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    roadmap_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("roadmaps.id"), nullable=False)
    phase_name: Mapped[str] = mapped_column(String(100), nullable=False)
    phase_order: Mapped[int] = mapped_column(Integer, nullable=False)
    target_date: Mapped[date | None] = mapped_column(Date)

    roadmap: Mapped["Roadmap"] = relationship(back_populates="phases")
    tasks: Mapped[list["Task"]] = relationship(back_populates="phase", cascade="all, delete-orphan")
