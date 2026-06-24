from typing import cast
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies.auth_dependency import get_current_user
from app.models.user import User
from app.schemas.dashboard_schema import DashboardSummaryResponse
from app.services.dashboard_service import get_dashboard_summary

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/summary", response_model=DashboardSummaryResponse)
def get_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieves user-specific summary statistics and widget data for the main dashboard dashboard page.
    """
    user_id = cast(int, current_user.id)
    return get_dashboard_summary(db, user_id)
