from pydantic import BaseModel, ConfigDict
from typing import List, Optional


class StudyGuidelineResponse(BaseModel):
    id: int
    material_id: int
    overview: Optional[str] = None
    key_topics: Optional[List[str]] = None
    study_order: Optional[List[str]] = None
    important_definitions: Optional[List[str]] = None
    exam_focused_areas: Optional[List[str]] = None
    revision_tips: Optional[List[str]] = None

    model_config = ConfigDict(from_attributes=True)
