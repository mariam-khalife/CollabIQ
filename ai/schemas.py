from pydantic import BaseModel, Field, field_validator

from models.constants import DIFFICULTY_LEVELS


class ProjectIdea(BaseModel):
    # max lengths mirror the project_recommendations columns so validation
    # fails here, with a clear error, instead of at db.commit()
    title: str = Field(max_length=255)
    description: str
    difficulty_level: str
    required_technologies: list[str] = Field(min_length=1)
    confidence_score: float = Field(ge=0.0, le=1.0)

    @field_validator("difficulty_level")
    @classmethod
    def _difficulty_must_be_canonical(cls, value: str) -> str:
        if value not in DIFFICULTY_LEVELS:
            raise ValueError(f"difficulty_level must be one of {DIFFICULTY_LEVELS}, got {value!r}")
        return value

    @field_validator("required_technologies")
    @classmethod
    def _technologies_fit_column(cls, values: list[str]) -> list[str]:
        for tech in values:
            if len(tech) > 100:
                raise ValueError(f"technology name too long ({len(tech)} > 100 chars): {tech!r}")
        return values


class ProjectIdeaList(BaseModel):
    """The exact envelope the LLM is instructed to return."""

    projects: list[ProjectIdea]
