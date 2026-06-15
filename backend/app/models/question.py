from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String(255), nullable=True)
    question_type = Column(String(50), nullable=False)
    difficulty = Column(String(50), nullable=True)
    question_text = Column(Text, nullable=False)
    correct_answer = Column(Text, nullable=False)
    explanation = Column(Text, nullable=True)
    material_id = Column(Integer, ForeignKey("study_materials.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    # Many questions belong to one study material
    material = relationship("StudyMaterial", back_populates="questions")
    
    # One question can appear in many quiz answers
    quiz_answers = relationship("QuizAnswer", back_populates="question")
