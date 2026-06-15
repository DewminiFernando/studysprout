from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    # One user can have many study materials (cascade deletes materials if user is deleted)
    materials = relationship("StudyMaterial", back_populates="owner", cascade="all, delete-orphan")
    
    # One user can have many quiz attempts (cascade deletes attempts if user is deleted)
    quiz_attempts = relationship("QuizAttempt", back_populates="user", cascade="all, delete-orphan")
    
    # One user has one plant progress record (uselist=False, cascade deletes progress if user is deleted)
    plant_progress = relationship("PlantProgress", back_populates="user", uselist=False, cascade="all, delete-orphan")
