from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class PlantProgressResponse(BaseModel):
    id: int
    user_id: int
    xp: int
    level: int
    stage: str
    study_streak: int
    last_activity_at: Optional[datetime] = None
    created_at: datetime
    next_stage_xp: int
    xp_needed: int

    model_config = ConfigDict(from_attributes=True)

class PlantUpdateResponse(BaseModel):
    message: str
    action: str
    xp_gained: int
    plant_progress: PlantProgressResponse

    model_config = ConfigDict(from_attributes=True)

class PlantUpdateRequest(BaseModel):
    action: str
