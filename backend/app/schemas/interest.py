from uuid import UUID

from pydantic import BaseModel


class UserInterestCreate(BaseModel):
    interest_id: UUID


class InterestResponse(BaseModel):
    """An interest from the shared catalogue."""

    id: UUID
    name: str

    model_config = {
        "from_attributes": True
    }


class UserInterestResponse(BaseModel):
    id: UUID
    user_id: UUID
    interest_id: UUID
    # Resolved from the catalogue so clients can render an interest without
    # fetching it separately. Absent on create, present when listing.
    interest_name: str | None = None

    model_config = {
        "from_attributes": True
    }