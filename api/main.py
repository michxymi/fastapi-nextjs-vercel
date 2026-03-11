from fastapi import APIRouter, FastAPI

from api.routes import users

app = FastAPI()
api_router = APIRouter(prefix="/api/v1")

api_router.include_router(users.router)
app.include_router(api_router)
