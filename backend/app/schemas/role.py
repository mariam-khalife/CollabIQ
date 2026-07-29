from uuid import UUID

from pydantic import BaseModel


class RoleResponse(BaseModel):
    id: UUID
    role_name: str
    description: str | None = None

    model_config = {
        "from_attributes": True
    }