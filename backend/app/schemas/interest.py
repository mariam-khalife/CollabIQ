from uuid import UUID

from pydantic import BaseModel


class UserInterestCreate(BaseModel):
    interest_id: UUID


class UserInterestResponse(BaseModel):
    id: UUID
    user_id: UUID
    interest_id: UUID

    model_config = {
        "from_attributes": True
    }