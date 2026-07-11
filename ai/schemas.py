from pydantic import BaseModel, Field


class ProjectIdea(BaseModel):
    title: str
    description: str
    confidence_score: float = Field(ge=0.0, le=1.0)
