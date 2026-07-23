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


class UserSkillResponse(BaseModel):
    id: UUID
    user_id: UUID
    skill_id: UUID
    proficiency_level: str

    model_config = {
        "from_attributes": True
    }