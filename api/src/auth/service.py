from base64 import b64decode
import jwt
from fastapi import Depends, HTTPException, status, Request
from user.models import User
from user.schemas import UserOut
from database import database
from user.utils import verify_password
from .utils import get_token_from_header, get_token_signature, is_revoked


user_collections = database.get_collection("users")

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


async def get_user(user_collections, username: str):
    user = await user_collections.find_one({"username": username})
    return User(**user)


async def get_user_by_token(user_collections, token_signature: str):
    user = await user_collections.find_one({"token_signature": token_signature})
    return User(**user)


async def get_current_user(request: Request):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "JWT"},
    )
    token = get_token_from_header(request)
    token_signature = get_token_signature(token)
    user = await user_collections.find_one({"token_signature": token_signature})
    if not user:
        raise credentials_exception
    try:
        jwt.decode(
            token,
            SECRET_KEY,
            algorithms=["HS256"],
            options={"verify_signature": False, "verify_exp": True},
        )
    except jwt.ExpiredSignatureError:
        raise credentials_exception
    return User(**user)


def get_current_active_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


def get_current_active_admin_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=400, detail="Permission denied")
    return current_user


async def authenticate_user(user_collections, username: str, password: str):
    user = await user_collections.find_one({"username": username})
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user
