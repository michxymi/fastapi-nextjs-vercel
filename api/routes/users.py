from fastapi import APIRouter

from api.dependencies import CurrentUser

router = APIRouter()


@router.get("/users/me", tags=["users"])
async def get_current_user(current_user: CurrentUser):
    return current_user
