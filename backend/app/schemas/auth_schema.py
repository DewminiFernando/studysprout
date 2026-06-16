from pydantic import BaseModel, EmailStr
from datetime import datetime

# Schema for User Registration
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

# Schema for User Login
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Schema for User Response (simplified as requested by user)
class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True

# Schema for Token Response
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
