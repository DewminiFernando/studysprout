from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import get_db
from app.dependencies.auth_dependency import get_current_user
from app.models.user import User
from app.models.material_model import Material
from app.services.pdf_service import extract_text_from_pdf
from app.schemas.material_schema import (
    MaterialListResponse,
    MaterialDetailResponse,
    MaterialUploadResponse,
)

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
