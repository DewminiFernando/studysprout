from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class StudyMaterial(Base):
    __tablename__ = "study_materials"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=True)
    extracted_text = Column(Text, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    # Many study materials belong to one User owner
    owner = relationship("User", back_populates="materials")
    
    # One study material has one study guideline (uselist=False, cascade deletes guideline if material is deleted)
    study_guideline = relationship("StudyGuideline", back_populates="material", uselist=False, cascade="all, delete-orphan")
    
    # One study material can have many questions (cascade deletes questions if material is deleted)
    questions = relationship("Question", back_populates="material", cascade="all, delete-orphan")
    
    # One study material can have many quiz attempts (cascade deletes attempts if material is deleted)
    quiz_attempts = relationship("QuizAttempt", back_populates="material", cascade="all, delete-orphan")
