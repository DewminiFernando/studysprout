from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    material_id = Column(Integer, ForeignKey("study_materials.id"), nullable=False)
    total_questions = Column(Integer, nullable=False, default=0)
    correct_count = Column(Integer, nullable=False, default=0)
    partial_count = Column(Integer, nullable=False, default=0)
    revision_count = Column(Integer, nullable=False, default=0)
    score = Column(Float, nullable=False, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    # Many quiz attempts belong to one User
    user = relationship("User", back_populates="quiz_attempts")
    
    # Many quiz attempts belong to one Material
    material = relationship("Material", back_populates="quiz_attempts")
    
    # One quiz attempt can have many answers (cascade deletes answers if the attempt is deleted)
    answers = relationship("QuizAnswer", back_populates="quiz_attempt", cascade="all, delete-orphan")
