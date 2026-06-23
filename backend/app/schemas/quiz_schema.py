from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime

class QuizStartRequest(BaseModel):
    material_id: int
    limit: int = Field(10, ge=1, le=50)

class QuizQuestionResponse(BaseModel):
    id: int
    question_text: str
    question_type: Optional[str] = None
    topic: Optional[str] = None
    difficulty: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class QuizStartResponse(BaseModel):
    material_id: int
    total_questions: int
    questions: List[QuizQuestionResponse]

    model_config = ConfigDict(from_attributes=True)

class StudentAnswerInput(BaseModel):
    question_id: int
    student_answer: str

class QuizSubmitRequest(BaseModel):
    material_id: int
    answers: List[StudentAnswerInput]

class QuizAnswerResult(BaseModel):
    question_id: int
    question_text: str
    topic: Optional[str] = None
    difficulty: Optional[str] = None
    student_answer: Optional[str] = None
    correct_answer: str
    explanation: Optional[str] = None
    similarity_score: float
    result: str
    points: float

    model_config = ConfigDict(from_attributes=True)

class WeakTopicResponse(BaseModel):
    topic: str
    weak_answers: int
    total_questions: int
    average_similarity: float
    weakness_rate: float

    model_config = ConfigDict(from_attributes=True)

class QuizSubmitResponse(BaseModel):
    attempt_id: int
    material_id: int
    score: float
    total_questions: int
    earned_points: float
    correct_count: int
    partial_count: int
    needs_revision_count: int
    results: List[QuizAnswerResult]
    weak_topics: List[WeakTopicResponse]

    model_config = ConfigDict(from_attributes=True)

class QuizHistoryItem(BaseModel):
    attempt_id: int
    material_id: int
    score: float
    total_questions: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
