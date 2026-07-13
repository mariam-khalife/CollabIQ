from typing import Literal

from pydantic import BaseModel, Field


class ProjectIdea(BaseModel):
    title: str
    description: str
    difficulty_level: Literal["beginner", "intermediate", "advanced"]
    required_technologies: list[str] = Field(min_length=1)
    confidence_score: float = Field(ge=0.0, le=1.0)
