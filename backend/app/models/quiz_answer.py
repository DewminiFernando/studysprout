from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class QuizAnswer(Base):
    __tablename__ = "quiz_answers"

    id = Column(Integer, primary_key=True, index=True)
    quiz_attempt_id = Column(Integer, ForeignKey("quiz_attempts.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    student_answer = Column(Text, nullable=True)
    expected_answer = Column(Text, nullable=False)
    similarity_score = Column(Float, nullable=True)
    result = Column(String(50), nullable=False)
    feedback = Column(Text, nullable=True)
    points = Column(Float, nullable=True)

    # Relationships
    # Many quiz answers belong to one QuizAttempt
    quiz_attempt = relationship("QuizAttempt", back_populates="answers")
    
    # Many quiz answers refer to one Question
    question = relationship("Question", back_populates="quiz_answers")
