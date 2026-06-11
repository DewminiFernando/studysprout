from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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
    