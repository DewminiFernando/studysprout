from sqlalchemy import Column, Integer, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class StudyGuideline(Base):
    __tablename__ = "study_guidelines"

    id = Column(Integer, primary_key=True, index=True)
    overview = Column(Text, nullable=True)
    key_topics = Column(Text, nullable=True)
    study_order = Column(Text, nullable=True)
    important_definitions = Column(Text, nullable=True)
    exam_focus = Column(Text, nullable=True)
    revision_tips = Column(Text, nullable=True)
    material_id = Column(Integer, ForeignKey("study_materials.id"), nullable=False, unique=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    # One study guideline links to exactly one study material
    material = relationship("StudyMaterial", back_populates="study_guideline")
