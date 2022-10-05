from fastapi import Depends, HTTPException, APIRouter
from fastapi.encoders import jsonable_encoder

from starlette import status
from pydantic import EmailStr

from database import database

from .schemas import UserIn, UserOut
from .models import User
from .utils import get_password_hash


user_collections = database.get_collection("users")

user_router = APIRouter(prefix="/api/v1/user")


@user_router.get("/")
async def get_list_user() -> list:
    result = []
    users = user_collections.find({}, {"password": 0, "_id": 1})
    async for user in users:
        result.append(UserOut(**user))
    return result


@user_router.get("/{id}", response_model=UserOut)
async def retrieve_user_by_id(id: str) -> User:
    user = await user_collections.find_one({"_id": id})
    return user


@user_router.post("/", status_code=status.HTTP_201_CREATED, response_model=UserOut)
async def create_user(payload: UserIn):
    # Check if user already exist
    user = await user_collections.find_one({"username": payload.username.lower()})
    is_exist_any_user = user_collections.count_documents({})
    if user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail='Account already exist')
    payload.password = get_password_hash(payload.password)
    payload.email = EmailStr(payload.email.lower())
    payload.is_active = True
    if is_exist_any_user:
        payload.is_admin = False
    else:
        payload.is_admin = True
    new_user = User(**payload.dict())
    new_user_dict = jsonable_encoder(new_user)
    user_collections.insert_one(new_user_dict)
    return new_user


@user_router.put("/{id}", response_model=UserOut)
async def update_user(id: str, data: UserIn) -> User:
    update_item_encoded = jsonable_encoder(data)
    await user_collections.update_one({"_id": id}, {"$set": update_item_encoded})
    updated_user = await user_collections.find_one({"_id": id})
    return updated_user


@user_router.delete("/{id}", status_code=204)
async def remove_user(id: str) -> None:
    user = await user_collections.find_one({"_id": id})
    if user:
        user_collections.delete_one({"_id": id})
    else:
        raise HTTPException(status_code=404, detail=f"No car with id={id}.")


@user_router.delete("/delete/{ids}", status_code=204)
async def remove_list_user(ids: str = "") -> None:
    users_id = [user_id.strip() for user_id in ids.split(",")]
    for user_id in users_id:
        user = await user_collections.find_one({"_id": user_id})
        if user:
            user_collections.delete_one({"_id": user_id})
        else:
            raise HTTPException(status_code=404, detail=f"No car with id={user_id}.")
