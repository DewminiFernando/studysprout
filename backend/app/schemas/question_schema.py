from pydantic import BaseModel, ConfigDict
from typing import Optional


class QuestionResponse(BaseModel):
    id: int
    material_id: int
    topic: Optional[str] = None
    question_type: str
    difficulty: Optional[str] = None
    question_text: str
    correct_answer: str
    explanation: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
