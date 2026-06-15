import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Load environment variables from backend/.env
load_dotenv()

database_url = os.getenv("DATABASE_URL")

if not database_url:
    raise ValueError("DATABASE_URL is missing! Please configure it in your backend/.env file.")

# Neon/PostgreSQL connection string URL compatibility conversion for SQLAlchemy
# Converts postgres:// or postgresql:// to postgresql+psycopg2://
if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql+psycopg2://", 1)
elif database_url.startswith("postgresql://"):
    database_url = database_url.replace("postgresql://", "postgresql+psycopg2://", 1)

# Create the SQLAlchemy engine
engine = create_engine(database_url)

# Create SessionLocal class for database sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class for models to inherit
Base = declarative_base()

# Dependency to get db session and close it after request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
