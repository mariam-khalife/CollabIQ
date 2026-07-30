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
from app.schemas.project_recommendation import (
    ProjectRecommendationResponse,
)
from app.services.project_recommendation_service import (
    generate_project_recommendations,
    get_project_recommendations,
)


router = APIRouter(
    prefix="/teams",
    tags=["Project Recommendations"],
)


@router.get(
    "/{team_id}/project-recommendations",
    response_model=list[
        ProjectRecommendationResponse
    ],
)
def list_project_recommendations(
    team_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = get_project_recommendations(
        db=db,
        team_id=team_id,
        current_user=current_user,
    )

    if result == "team_not_found":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found",
        )

    if result == "not_team_member":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Only members of this team can view "
                "its project recommendations"
            ),
        )

    return result


@router.post(
    "/{team_id}/project-recommendations/generate",
    response_model=list[
        ProjectRecommendationResponse
    ],
    status_code=status.HTTP_201_CREATED,
)
def generate_team_project_recommendations(
    team_id: UUID,
    count: int = Query(
        default=5,
        ge=1,
        le=5,
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        result = generate_project_recommendations(
            db=db,
            team_id=team_id,
            current_user=current_user,
            count=count,
        )
    except RuntimeError as error:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(error),
        ) from error
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "The AI project recommendation service "
                "is temporarily unavailable"
            ),
        ) from error

    if result == "team_not_found":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found",
        )

    if result == "not_leader":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Only the team leader can generate "
                "project recommendations"
            ),
        )

    return result