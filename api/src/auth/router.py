from datetime import datetime, timedelta, timezone
from fastapi import Depends, APIRouter, HTTPException, status, Request
from fastapi.encoders import jsonable_encoder

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

TOKEN_EXPIRE_SECONDS = 60 * 15
REFRESH_EXPIRE_SECONDS = 60 * 2400


@auth_router.post("/login", response_model=Token)
async def login(payload: Login):
    user = await user_collections.find_one({"username": payload.username})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account does not exist",
        )
    user = User(**user)
    if not verify_password(payload.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "JWT"},
        )
    token_expires = timedelta(seconds=TOKEN_EXPIRE_SECONDS)
    token = create_token(data={"sub": user.username}, expires_delta=token_expires)
    refresh_token_expires = datetime.now(tz=timezone.utc) + timedelta(
        seconds=REFRESH_EXPIRE_SECONDS
    )
    await user_collections.update_one(
        {"username": user.username},
        {
            "$set": {
                "token_signature": get_token_signature(token),
                "token_refresh_limit": refresh_token_expires,
            }
        },
    )
    return {"token": token, "token_type": "JWT", "is_admin": user.is_admin}


@auth_router.post("/logout")
async def logout(current_user: UserOut = Depends(get_current_active_user)):
    await user_collections.update_one(
        {"username": current_user.username}, {"$set": {"token_signature": ""}}
    )
    return {}


@auth_router.post("/refresh")
async def refresh_token(request: Request):
    token = get_token_from_header(request)
    token_signature = get_token_signature(token)
    success, result = await refresh(token_signature)
    return {"token": result, "token_type": "JWT"} if success else {}


@auth_router.post("/change-pwd")
async def change_password(
    payload: ChangePasswordSchema,
    current_user: User = Depends(get_current_active_user),
):
    old_password = payload.old_password
    password = payload.password
    password_confirm = payload.password_confirm
    if password != password_confirm:
        raise HTTPException(status_code=400, detail="Password does not match")

    if (
        not old_password
        or verify_password(old_password, current_user.password) is False
    ):
        raise HTTPException(status_code=400, detail="Incorrect current password")

    hashed_password = get_password_hash(password_confirm)

    await user_collections.update_one(
        {"username": current_user.username}, {"$set": {"password": hashed_password}}
    )

    return {}


@auth_router.get("/users/me/", response_model=UserOut)
def read_users_me(current_user: UserOut = Depends(get_current_active_user)):
    return current_user


@auth_router.put("/users/me/{id}", response_model=UserOut)
async def update_profile(
    id: str,
    data: dict,
    current_user: UserOut = Depends(get_current_active_user),
) -> User:
    username = data.get("username", "")
    email = data.get("email", "")

    user = await user_collections.find_one(
        {
            "$or": [
                {"username": username.lower()},
                {"email": email.lower()},
            ]
        },
    )
    if user and email != current_user.email:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Username/email already exist"
        )
    update_item_encoded = jsonable_encoder(data)
    await user_collections.update_one({"_id": id}, {"$set": update_item_encoded})
    updated_user = await user_collections.find_one({"_id": id})
    return updated_user
