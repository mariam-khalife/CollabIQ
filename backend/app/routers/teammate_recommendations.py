from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
)
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.routers.users import get_current_user
from app.schemas.teammate_recommendation import (
    TeammateRecommendationResponse,
)
from app.services.teammate_recommendation_service import (
    get_teammate_recommendations,
)


router = APIRouter(
    prefix="/teams",
    tags=["Teammate Recommendations"],
)


@router.get(
    "/{team_id}/teammate-recommendations",
    response_model=list[TeammateRecommendationResponse],
)
def list_teammate_recommendations(
    team_id: UUID,
    target_role: str = Query(
        default="Backend Developer",
        min_length=2,
    ),
    required_skills: list[str] | None = Query(
        default=None,
    ),
    required_interests: list[str] | None = Query(
        default=None,
    ),
    minimum_score: float = Query(
        default=0,
        ge=0,
        le=1,
    ),
    maximum_results: int = Query(
        default=5,
        ge=1,
        le=5,
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = get_teammate_recommendations(
        db=db,
        team_id=team_id,
        current_user=current_user,
        target_role=target_role,
        required_skills=required_skills,
        required_interests=required_interests,
        minimum_score=minimum_score,
        maximum_results=maximum_results,
    )

    if result == "team_not_found":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found",
        )

    if result == "not_leader":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Only the team leader can request "
                "teammate recommendations"
            ),
        )

    return result