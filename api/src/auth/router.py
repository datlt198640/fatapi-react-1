from datetime import timedelta
from fastapi import Depends, APIRouter, HTTPException, status, Request

from starlette import status

from database import database

from user.models import User
from user.schemas import UserOut
from user.utils import get_password_hash

from .schemas import Token, Login, ChangePasswordSchema
from .service import verify_password, get_current_active_user
from .utils import create_token, get_token_signature, get_token_from_header, refresh


user_collections = database.get_collection("users")

auth_router = APIRouter(prefix="/api/v1/auth")

TOKEN_EXPIRE_MINUTES = 30


@auth_router.post("/login", response_model=Token)
async def login(payload: Login):
    user = await user_collections.find_one({"username": payload.username})
    user = User(**user)
    is_authenticated_user = True
    if not user:
        is_authenticated_user = False
    if not verify_password(payload.password, user.password):
        is_authenticated_user = False
    if not is_authenticated_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token_expires = timedelta(minutes=TOKEN_EXPIRE_MINUTES)
    token = create_token(data={"sub": user.username}, expires_delta=token_expires)

    await user_collections.update_one(
        {"username": user.username},
        {"$set": {"token_signature": get_token_signature(token)}},
    )
    return {"token": token, "token_type": "bearer"}


@auth_router.post("/logout")
async def logout(current_user: UserOut = Depends(get_current_active_user)):
    await user_collections.update_one(
        {"username": current_user.username}, {"$set": {"token_signature": ""}}
    )
    return {}


@auth_router.post("/refresh-token")
async def refresh_token(request: Request):
    token = get_token_from_header(request)
    token_signature = get_token_signature(token)
    success, result = refresh(token_signature)
    return {"token": result} if success else {}


@auth_router.post("/change-pwd")
async def change_password(
    payload: ChangePasswordSchema,
    current_user: User = Depends(get_current_active_user),
):
    old_password = payload.old_password
    new_password = payload.new_password

    if (
        not old_password
        or verify_password(old_password, current_user.password) is False
    ):
        return {"old_password": "Incorrect current password"}

    hashed_password = get_password_hash(new_password)

    await user_collections.update_one(
        {"username": current_user.username}, {"$set": {"password": hashed_password}}
    )

    return {}


@auth_router.get("/users/me/", response_model=UserOut)
def read_users_me(current_user: UserOut = Depends(get_current_active_user)):
    return current_user
