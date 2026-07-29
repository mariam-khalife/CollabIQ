from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr


class UserResponse(BaseModel):
    id: UUID
    full_name: str
    email: EmailStr
    university: str | None = None
    bio: str | None = None
    availability: str | None = None
    experience_level: str | None = None
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


class UserUpdate(BaseModel):
    full_name: str | None = None
    university: str | None = None
    bio: str | None = None
    availability: str | None = None
    experience_level: str | None = None


class PublicUserResponse(BaseModel):
    id: UUID
    full_name: str
    university: str | None = None
    bio: str | None = None
    availability: str | None = None
    experience_level: str | None = None

    model_config = {
        "from_attributes": True
    }


class UserSearchResponse(BaseModel):
    id: UUID
    full_name: str
    email: EmailStr
    university: str | None = None
    experience_level: str | None = None

    model_config = {
        "from_attributes": True
    }