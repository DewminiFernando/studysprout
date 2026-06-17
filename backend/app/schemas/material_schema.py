from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class MaterialListResponse(BaseModel):
    id: int
    title: str
    original_filename: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class MaterialDetailResponse(BaseModel):
    id: int
    title: str
    original_filename: str
    extracted_text: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class MaterialUploadResponse(BaseModel):
    message: str
    material: MaterialDetailResponse

    model_config = ConfigDict(from_attributes=True)
