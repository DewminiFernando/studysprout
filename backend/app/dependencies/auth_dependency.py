from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.utils.token_utils import verify_access_token

# OAuth2PasswordBearer extracts the Bearer token from the Authorization header.
# We point tokenUrl to our swagger login route '/auth/token' which requires form-data.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    Retrieves the current authenticated user from the database by verifying the JWT token.
    Raises 401 Unauthorized if the token is invalid or the user does not exist.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = verify_access_token(token)
    if payload is None:
        raise credentials_exception
        
    user_id = payload.get("sub")
    if not isinstance(user_id, str):
        raise credentials_exception
        
    try:
        user_id_int = int(user_id)
    except ValueError:
        raise credentials_exception
        
    user = db.query(User).filter(User.id == user_id_int).first()
    if user is None:
        raise credentials_exception
        
    return user
