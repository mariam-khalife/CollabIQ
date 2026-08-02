from uuid import UUID

from pydantic import BaseModel, field_validator


class UserSkillCreate(BaseModel):
    skill_id: UUID
    proficiency_level: str

    @field_validator("proficiency_level")
    @classmethod
    def validate_level(cls, value: str):
        allowed = {"beginner", "intermediate", "advanced"}

        normalized = value.lower()

        if normalized not in allowed:
            raise ValueError(
                "proficiency_level must be beginner, intermediate, or advanced"
            )

        return normalized


class SkillResponse(BaseModel):
    """A skill from the shared catalogue."""

    id: UUID
    name: str
    category: str | None = None

    model_config = {
        "from_attributes": True
    }


class UserSkillResponse(BaseModel):
    id: UUID
    user_id: UUID
    skill_id: UUID
    proficiency_level: str
    # Resolved from the catalogue so clients can render a skill without
    # fetching it separately. Absent on create, present when listing.
    skill_name: str | None = None
    category: str | None = None

    model_config = {
        "from_attributes": True
    }