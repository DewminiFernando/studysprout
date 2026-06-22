from fastapi import APIRouter, Depends, HTTPException, Query, status, File, UploadFile
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import Optional, List
from app.database import get_db
from app.dependencies.auth_dependency import get_current_user
from app.models.user import User
from app.models.material_model import Material
from app.models.study_guideline import StudyGuideline
from app.models.question import Question
from app.services.pdf_service import extract_text_from_pdf
from app.services.llm_service import generate_study_guideline, generate_question_bank
from app.services.question_service import replace_questions_for_material
from app.schemas.material_schema import (
    MaterialListResponse,
    MaterialDetailResponse,
    MaterialUploadResponse,
)
from app.schemas.study_guideline_schema import StudyGuidelineResponse
from app.schemas.question_schema import QuestionResponse

router = APIRouter(
    prefix="/materials",
    tags=["Materials"]
)

@router.post("/upload", response_model=MaterialUploadResponse, status_code=status.HTTP_201_CREATED)
def upload_material(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Validate content type is application/pdf
    if file.content_type != "application/pdf" and not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are allowed."
        )

    # Extract text using pdf_service
    extracted_text = extract_text_from_pdf(file)

    # Create title from filename
    filename = file.filename or "uploaded_file.pdf"
    title = filename
    if filename.lower().endswith(".pdf"):
        title = filename[:-4]
    title = title.replace("_", " ").replace("-", " ").strip().title()
    if not title:
        title = "Untitled Material"

    # Save to database
    new_material = Material(
        title=title,
        original_filename=filename,
        extracted_text=extracted_text,
        owner_id=current_user.id
    )
    db.add(new_material)
    db.commit()
    db.refresh(new_material)

    return {
        "message": "Material uploaded and text extracted successfully.",
        "material": new_material
    }

@router.get("", response_model=list[MaterialListResponse])
def get_materials(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Return all materials uploaded by the logged-in user, ordered newest first
    materials = (
        db.query(Material)
        .filter(Material.owner_id == current_user.id)
        .order_by(desc(Material.created_at))
        .all()
    )
    return materials

@router.get("/{material_id}", response_model=MaterialDetailResponse)
def get_material_by_id(
    material_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Return one material by ID, ensuring it belongs to the logged-in user
    material = (
        db.query(Material)
        .filter(Material.id == material_id, Material.owner_id == current_user.id)
        .first()
    )
    if not material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material not found or you do not have permission to view it."
        )
    return material

@router.delete("/{material_id}")
def delete_material(
    material_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Delete one material by ID, ensuring it belongs to the logged-in user
    material = (
        db.query(Material)
        .filter(Material.id == material_id, Material.owner_id == current_user.id)
        .first()
    )
    if not material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material not found or you do not have permission to delete it."
        )
    db.delete(material)
    db.commit()
    return {"message": "Material deleted successfully."}


# ─── AI Study Guideline Endpoints ───────────────────────────────────────────────

@router.post("/{material_id}/generate-guideline", response_model=StudyGuidelineResponse)
def generate_guideline_endpoint(
    material_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generate an AI study guideline from the material's extracted PDF text."""
    # Verify material exists and belongs to the current user
    material = (
        db.query(Material)
        .filter(Material.id == material_id, Material.owner_id == current_user.id)
        .first()
    )
    if not material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material not found or you do not have permission to access it."
        )

    # Check that extracted text exists
    if not material.extracted_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This material has no extracted text. Please re-upload the PDF."
        )

    # Call the LLM service to generate the guideline
    try:
        guideline_data = generate_study_guideline(material.extracted_text)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI generation failed: {str(e)}"
        )

    # Check if a guideline already exists for this material
    existing_guideline = (
        db.query(StudyGuideline)
        .filter(StudyGuideline.material_id == material_id)
        .first()
    )

    if existing_guideline:
        # Update the existing guideline
        existing_guideline.overview = guideline_data.get("overview", "")
        existing_guideline.key_topics = guideline_data.get("key_topics", [])
        existing_guideline.study_order = guideline_data.get("study_order", [])
        existing_guideline.important_definitions = guideline_data.get("important_definitions", [])
        existing_guideline.exam_focused_areas = guideline_data.get("exam_focused_areas", [])
        existing_guideline.revision_tips = guideline_data.get("revision_tips", [])
        db.commit()
        db.refresh(existing_guideline)
        return existing_guideline
    else:
        # Create a new guideline
        new_guideline = StudyGuideline(
            material_id=material_id,
            overview=guideline_data.get("overview", ""),
            key_topics=guideline_data.get("key_topics", []),
            study_order=guideline_data.get("study_order", []),
            important_definitions=guideline_data.get("important_definitions", []),
            exam_focused_areas=guideline_data.get("exam_focused_areas", []),
            revision_tips=guideline_data.get("revision_tips", []),
        )
        db.add(new_guideline)
        db.commit()
        db.refresh(new_guideline)
        return new_guideline


@router.get("/{material_id}/guideline", response_model=StudyGuidelineResponse)
def get_guideline_endpoint(
    material_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve the saved study guideline for a material."""
    # Verify material ownership
    material = (
        db.query(Material)
        .filter(Material.id == material_id, Material.owner_id == current_user.id)
        .first()
    )
    if not material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material not found or you do not have permission to access it."
        )

    guideline = (
        db.query(StudyGuideline)
        .filter(StudyGuideline.material_id == material_id)
        .first()
    )
    if not guideline:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Study guideline has not been generated yet. Please generate one first."
        )

    return guideline


# ─── AI Question Bank Endpoints ─────────────────────────────────────────────────

@router.post("/{material_id}/generate-questions", response_model=List[QuestionResponse])
def generate_questions_endpoint(
    material_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generate AI exam-style questions from the material's extracted PDF text."""
    # Verify material exists and belongs to the current user
    material = (
        db.query(Material)
        .filter(Material.id == material_id, Material.owner_id == current_user.id)
        .first()
    )
    if not material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material not found or you do not have permission to access it."
        )

    # Check that extracted text exists
    if not material.extracted_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This material has no extracted text. Please re-upload the PDF."
        )

    # Call the LLM service to generate questions
    try:
        questions_data = generate_question_bank(material.extracted_text, question_count=10)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI question generation failed: {str(e)}"
        )

    # Save questions using the question service (replaces old ones)
    try:
        saved_questions = replace_questions_for_material(db, material_id, questions_data)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save generated questions: {str(e)}"
        )

    return saved_questions


@router.get("/{material_id}/questions", response_model=List[QuestionResponse])
def get_questions_endpoint(
    material_id: int,
    topic: Optional[str] = Query(None, description="Filter by topic name"),
    question_type: Optional[str] = Query(None, alias="type", description="Filter by question type (e.g. mcq, short-answer)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve saved questions for a material, with optional topic and type filters."""
    # Verify material ownership
    material = (
        db.query(Material)
        .filter(Material.id == material_id, Material.owner_id == current_user.id)
        .first()
    )
    if not material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material not found or you do not have permission to access it."
        )

    # Build the query
    query = db.query(Question).filter(Question.material_id == material_id)

    # Apply optional filters
    if topic:
        query = query.filter(Question.topic.ilike(f"%{topic}%"))
    if question_type:
        query = query.filter(Question.question_type.ilike(f"%{question_type}%"))

    questions = query.all()
    return questions
