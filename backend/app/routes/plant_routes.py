from typing import cast
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies.auth_dependency import get_current_user
from app.models.user import User
from app.schemas.plant_schema import PlantProgressResponse, PlantUpdateRequest, PlantUpdateResponse
from app.services.plant_service import get_or_create_plant_progress, update_plant_progress, calculate_stage_level_next_xp

router = APIRouter(
    prefix="/plant",
    tags=["Plant Progress"]
)

@router.get("/progress", response_model=PlantProgressResponse)
def get_progress(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve the current user's plant progress record. Creates a default one if it doesn't exist.
    """
    user_id = cast(int, current_user.id)
    progress = get_or_create_plant_progress(db, user_id)
    plant_xp = int(getattr(progress, "xp", 0) or 0)
    _, _, next_stage_xp, xp_needed = calculate_stage_level_next_xp(plant_xp)

    return {
        "id": progress.id,
        "user_id": progress.user_id,
        "xp": progress.xp,
        "level": progress.level,
        "stage": progress.stage,
        "study_streak": progress.streak_days,
        "last_activity_at": progress.last_activity_at,
        "created_at": progress.created_at,
        "next_stage_xp": next_stage_xp,
        "xp_needed": xp_needed
    }

@router.patch("/update", response_model=PlantUpdateResponse)
def update_progress(
    request: PlantUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Manually award XP to the user's plant progress for an action (e.g. revise_weak_topic).
    """
    user_id = cast(int, current_user.id)
    progress, xp_gained = update_plant_progress(db, user_id, request.action)
    plant_xp = int(getattr(progress, "xp", 0) or 0)
    _, _, next_stage_xp, xp_needed = calculate_stage_level_next_xp(plant_xp)

    progress_dict = {
        "id": progress.id,
        "user_id": progress.user_id,
        "xp": progress.xp,
        "level": progress.level,
        "stage": progress.stage,
        "study_streak": progress.streak_days,
        "last_activity_at": progress.last_activity_at,
        "created_at": progress.created_at,
        "next_stage_xp": next_stage_xp,
        "xp_needed": xp_needed
    }

    return {
        "message": "Plant progress updated successfully.",
        "action": request.action,
        "xp_gained": xp_gained,
        "plant_progress": progress_dict
    }
