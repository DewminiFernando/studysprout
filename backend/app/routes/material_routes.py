from fastapi import APIRouter

router = APIRouter(
    prefix="/materials",
    tags=["Materials"]
)

@router.get("/test")
def test_materials():
    return {"message": "Materials route is working"}
