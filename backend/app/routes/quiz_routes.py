from fastapi import APIRouter

router = APIRouter(
    prefix="/quiz",
    tags=["Quiz"]
)

@router.get("/test")
def test_quiz():
    return {"message": "Quiz route is working"}
