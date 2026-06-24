from sqlalchemy.orm import Session
from datetime import datetime
from typing import Tuple
from fastapi import HTTPException, status
from app.models.plant_progress import PlantProgress

# XP Rules mapping actions to XP values
XP_RULES = {
    "upload_pdf": 10,
    "generate_questions": 15,
    "complete_quiz": 20,
    "high_score": 25,
    "revise_weak_topic": 10
}

def calculate_stage_level_next_xp(xp: int) -> Tuple[str, int, int, int]:
    """
    Returns (stage, level, next_stage_xp, xp_needed) based on total XP.
    Stages:
      - 0–49 XP -> Seed (Level 1, next at 50)
      - 50–99 XP -> Sprout (Level 2, next at 100)
      - 100–174 XP -> Small Plant (Level 3, next at 175)
      - 175–274 XP -> Growing Plant (Level 4, next at 275)
      - 275+ XP -> Flower (Level 5, next at 275, xp_needed=0)
    """
    if xp < 50:
        return "Seed", 1, 50, max(0, 50 - xp)
    elif xp < 100:
        return "Sprout", 2, 100, max(0, 100 - xp)
    elif xp < 175:
        return "Small Plant", 3, 175, max(0, 175 - xp)
    elif xp < 275:
        return "Growing Plant", 4, 275, max(0, 275 - xp)
    else:
        return "Flower", 5, 275, 0

def get_or_create_plant_progress(db: Session, user_id: int) -> PlantProgress:
    """
    Retrieves or creates a default plant progress record for a user.
    """
    progress = db.query(PlantProgress).filter(PlantProgress.user_id == user_id).first()
    if not progress:
        stage, level, _, _ = calculate_stage_level_next_xp(0)
        progress = PlantProgress(
            user_id=user_id,
            xp=0,
            level=level,
            stage=stage,
            streak_days=0,
            last_activity_at=None
        )
        db.add(progress)
        db.commit()
        db.refresh(progress)
    return progress

def update_plant_progress(db: Session, user_id: int, action: str) -> Tuple[PlantProgress, int]:
    """
    Applies the XP rules to a user's plant progress, recalculating stages and streak.
    """
    action_key = action.lower().strip()
    if action_key not in XP_RULES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid plant action: '{action}'. Valid actions are: {list(XP_RULES.keys())}"
        )

    progress = get_or_create_plant_progress(db, user_id)
    xp_gain = XP_RULES[action_key]

    # Award XP
    current_xp = int(getattr(progress, "xp", 0) or 0)
    new_xp = current_xp + xp_gain
    setattr(progress, "xp", new_xp)

    # Recalculate stage and level
    stage, level, _, _ = calculate_stage_level_next_xp(new_xp)
    setattr(progress, "stage", stage)
    setattr(progress, "level", level)

    # Streak logic based on dates
    current_time = datetime.now()
    last_activity_at = getattr(progress, "last_activity_at", None)
    if last_activity_at:
        last_date = last_activity_at.date()
        current_date = current_time.date()
        diff = (current_date - last_date).days
        if diff == 1:
            current_streak = int(getattr(progress, "streak_days", 0) or 0)
            new_streak = current_streak + 1
            setattr(progress, "streak_days", new_streak)
        elif diff > 1:
            setattr(progress, "streak_days", 1)
        # if diff == 0, streak remains unchanged (same day activity)
    else:
        setattr(progress, "streak_days", 1)

    setattr(progress, "last_activity_at", current_time)

    db.commit()
    db.refresh(progress)

    return progress, xp_gain
