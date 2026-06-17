from typing import cast
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.plant_progress import PlantProgress
from app.schemas.auth_schema import UserRegister, UserLogin, UserResponse, TokenResponse
from app.utils.password_utils import hash_password, verify_password
from app.utils.token_utils import create_access_token
from app.dependencies.auth_dependency import get_current_user

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    """
    Registers a new student, hashes their password, sets up their plant progress record,
    and returns their user details.
    """
    # 1. Check if the email already exists
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # 2. Hash the password
    hashed_pw = hash_password(user_in.password)
    
    # 3. Create and save the new User
    new_user = User(
        name=user_in.name,
        email=user_in.email,
        hashed_password=hashed_pw
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # 4. Create default PlantProgress (since model is ready!)
    try:
        default_plant = PlantProgress(
            user_id=new_user.id,
            xp=0,
            level=1,
            stage="Seed",
            streak_days=0
        )
        db.add(default_plant)
        db.commit()
    except Exception as e:
        db.rollback()
        # Keep going even if plant creation fails, but it shouldn't
        pass
        
    return new_user

@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Verifies user credentials and generates a JWT access token.
    """
    # 1. Look up user by email
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
        
    # 2. Verify password
    password_is_valid = verify_password(
        credentials.password,
        cast(str, user.hashed_password),
    )
    if not password_is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
        
    # 3. Create the access token using user ID as the subject
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/token", response_model=TokenResponse)
def swagger_login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """
    Swagger-compatible login endpoint.

    Swagger Authorize sends username/password as form data.
    In this app, username means the user's email.
    """
    user = db.query(User).filter(User.email == form_data.username).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    password_is_valid = verify_password(
        form_data.password,
        cast(str, user.hashed_password),
    )

    if not password_is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    access_token = create_access_token(data={"sub": str(user.id)})

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """
    Returns the profile of the current logged-in user.
    """
    return current_user
