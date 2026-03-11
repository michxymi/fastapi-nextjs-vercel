from typing import Annotated

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer

from api.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

TokenDep = Annotated[str, Depends(oauth2_scheme)]


def fake_decode_token(token):
    return User(username=token + "fakedecoded", email="john@example.com", full_name="John Doe")


async def get_current_user(token: TokenDep):
    user = fake_decode_token(token)
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]
