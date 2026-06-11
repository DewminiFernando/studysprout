from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import routers
from app.routes.auth_routes import router as auth_router
from app.routes.material_routes import router as material_router
from app.routes.quiz_routes import router as quiz_router
from app.routes.plant_routes import router as plant_router

app = FastAPI(
    title="StudySprout AI API",
    description="Backend API for StudySprout AI",
    version="1.0.0"
)

# Allows frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(material_router)
app.include_router(quiz_router)
app.include_router(plant_router)


@app.get("/")
def home():
    return {
        "message": "StudySprout AI backend is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "backend": "FastAPI"
    }

    