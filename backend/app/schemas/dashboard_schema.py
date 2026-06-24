from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

class RecentMaterialSchema(BaseModel):
    id: int
    name: str # maps to title
    questions: int
    week: str # maps to formatted time or string e.g. "Uploaded Jun 24"
    progress: int # percent of questions completed or arbitrary progress based on quizzes
    lastScore: Optional[str] = None # e.g. "82%" or "N/A"
    status: str # e.g. "Needs revision", "Quiz done", "Not started"
    statusType: str # "revision" or "done"

    model_config = ConfigDict(from_attributes=True)

class DashboardWeakTopicSchema(BaseModel):
    id: int
    name: str
    type: str # "weak" or "ok"

    model_config = ConfigDict(from_attributes=True)

class DashboardQuizHistorySchema(BaseModel):
    attempt_id: int
    material_name: str
    score: float
    total_questions: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class DashboardPlantWidgetSchema(BaseModel):
    level: int
    stage: str
    xp: int
    next_stage_xp: int
    xp_needed: int
    study_streak: int

    model_config = ConfigDict(from_attributes=True)

class DashboardSummaryResponse(BaseModel):
    total_pdfs: int
    total_questions: int
    average_quiz_score: float
    study_streak: int
    recent_materials: List[RecentMaterialSchema]
    weak_topics: List[DashboardWeakTopicSchema]
    quiz_history: List[DashboardQuizHistorySchema]
    plant_progress: DashboardPlantWidgetSchema

    model_config = ConfigDict(from_attributes=True)
