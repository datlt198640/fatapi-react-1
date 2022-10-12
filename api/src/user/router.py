from json import JSONDecodeError
import time
import pyexcel
from fastapi import Depends, HTTPException, APIRouter, UploadFile, File
from fastapi.encoders import jsonable_encoder

from starlette import status
from pydantic import EmailStr

from database import database

from .schemas import UserIn, UserOut
from .models import User
from .utils import (
    get_password_hash,
    download_excel,
    file_dest,
    get_column_map,
    get_cell_data,
    to_str,
    create,
    import_user,
)
from auth.service import get_current_active_admin_user, get_current_active_user
from pagination import paginate_response
from .utils import AfterCreateUser
from celery.result import AsyncResult
from worker import celery

user_collections = database.get_collection("users")

user_router = APIRouter(prefix="/api/v1/user")
remove_user_router = APIRouter(prefix="/api/v1/user-delete")


@user_router.get("/")
async def get_list_user(
    page_num: int = 1,
    page_size: int = 10,
    current_user: UserOut = Depends(get_current_active_admin_user),
) -> list:
    result = []
    users = user_collections.find({}, {"password": 0})
    users.sort("_id", -1)
    print("users", users)
    async for user in users:
        result.append(UserOut(**user))
    return paginate_response(result, len(result), page_num, page_size)


@user_router.get("/{id}", response_model=UserOut)
async def retrieve_user_by_id(
    id: str, current_user: UserOut = Depends(get_current_active_admin_user)
) -> User:
    user = await user_collections.find_one({"_id": id})
    return user


@user_router.post("/", status_code=status.HTTP_201_CREATED, response_model=UserOut)
async def create_user(
    payload: UserIn,
    current_admin_user: UserOut = Depends(get_current_active_admin_user),
):
    new_user = await create(payload, user_collections)
    return new_user


@user_router.put("/{id}", response_model=UserOut)
async def update_user(
    id: str,
    data: dict,
    current_user: UserOut = Depends(get_current_active_user),
    current_admin_user: UserOut = Depends(get_current_active_admin_user),
) -> User:
    username = data.get("username", "")
    email = data.get("email", "")

    user = await user_collections.find_one(
        {
            "$or": [
                {"username": username.lower()},
                {"email": email.lower()},
            ],
            "_id": id,
        },
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Username/email already exist"
        )
    update_item_encoded = jsonable_encoder(data)
    await user_collections.update_one({"_id": id}, {"$set": update_item_encoded})
    updated_user = await user_collections.find_one({"_id": id})
    return updated_user


@user_router.delete("/{id}", status_code=204)
async def remove_user(
    id: str, current_user: UserOut = Depends(get_current_active_admin_user)
) -> None:
    user = await user_collections.find_one({"_id": id})
    if user:
        user_collections.delete_one({"_id": id})
    else:
        raise HTTPException(status_code=404, detail=f"No user with id={id}.")


@remove_user_router.delete("/{ids}", status_code=204)
async def remove_list_user(ids: str = "") -> None:
    users_id = [user_id.strip() for user_id in ids.split(",")]
    for user_id in users_id:
        user = await user_collections.find_one({"_id": user_id})
        if user:
            user_collections.delete_one({"_id": user_id})
        else:
            raise HTTPException(status_code=404, detail=f"No usesr with id={user_id}.")


@user_router.get("/download-all/")
async def export_users():
    result = []
    users = user_collections.find({}, {"password": 0, "_id": 1})
    async for user in users:
        result.append(jsonable_encoder(UserOut(**user)))
    return download_excel(result)


@user_router.post("/upload-image")
async def upload_image(
    file: UploadFile, current_user: UserOut = Depends(get_current_active_admin_user)
):
    filename = file.filename
    extension = filename.split(".")[-1]
    if extension not in ["png", "jpg"]:
        return {"status": "error", "detail": "File extension is not allowed"}
    generated_name = file_dest(filename)
    file_content = await file.read()
    with open(generated_name, "wb") as file:
        file.write(file_content)
    file.close()
    return {"filename": filename}


@user_router.post("/import-user")
async def import_users(
    file: UploadFile, current_user: UserOut = Depends(get_current_active_admin_user)
):
    filename = file.filename
    extension = filename.split(".")[-1]
    content = await file.read()
    book = pyexcel.get_book(file_type=extension, file_content=content)
    sheet = book.sheet_by_index(0)
    result = []
    await import_user(sheet, user_collections, result)
    return result
