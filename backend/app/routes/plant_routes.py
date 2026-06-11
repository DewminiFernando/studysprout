from fastapi import APIRouter

router = APIRouter(
    prefix="/plant",
    tags=["Plant Progress"]
)

@router.get("/test")
def test_plant():
    return {"message": "Plant route is working"}
