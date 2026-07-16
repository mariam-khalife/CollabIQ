import uuid

from sqlalchemy import CheckConstraint, ForeignKey, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Skill(Base):
    __tablename__ = "skills"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False
    )
    category: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True
    )


class UserSkill(Base):
    __tablename__ = "user_skills"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "skill_id",
            name="uq_user_skill"
        ),
        CheckConstraint(
            "proficiency_level IN ('beginner', 'intermediate', 'advanced')",
            name="ck_user_skills_proficiency_level"
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False
    )
    skill_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("skills.id"),
        nullable=False
    )
    proficiency_level: Mapped[str] = mapped_column(
        String(20),
        nullable=False
    )