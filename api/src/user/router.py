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
)
from auth.service import get_current_active_user
from pagination import paginate_response
from .utils import AfterCreateUser


user_collections = database.get_collection("users")

user_router = APIRouter(prefix="/api/v1/user")


@user_router.get("/")
async def get_list_user(
    page_num: int = 1,
    page_size: int = 10,
    search: str = "",
    current_user: UserOut = Depends(get_current_active_user),
) -> list:
    result = []
    # print("is_admin", is_admin)
    # if search:
    #     users = user_collections.find({ $username: { $search: search } }, {"password": 0, "_id": 1})
    # else:
    users = user_collections.find({}, {"password": 0})
    users.sort("_id", -1)
    async for user in users:
        result.append(UserOut(**user))
    return paginate_response(result, len(result), page_num, page_size)


@user_router.get("/{id}", response_model=UserOut)
async def retrieve_user_by_id(
    id: str, current_user: UserOut = Depends(get_current_active_user)
) -> User:
    user = await user_collections.find_one({"_id": id})
    return user


@user_router.post("/", status_code=status.HTTP_201_CREATED, response_model=UserOut)
async def create_user(
    payload: UserIn, current_user: UserOut = Depends(get_current_active_user)
):
    user = await user_collections.find_one(
        {
            "$or": [
                {"username": payload.username.lower()},
                {"email": payload.email.lower()},
            ]
        },
    )
    if user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Account already exist"
        )
    not_hash_password = payload.password
    payload.password = get_password_hash(payload.password)
    payload.email = EmailStr(payload.email.lower())
    payload.is_active = True
    print("payload", payload)

    new_user = User(**payload.dict())
    print("new_user", new_user)

    new_user_dict = jsonable_encoder(new_user)
    print("new_user_dict", new_user_dict)
    user_collections.insert_one(new_user_dict)
    await AfterCreateUser.send_email_noti(new_user, not_hash_password)
    return new_user


@user_router.put("/{id}", response_model=UserOut)
async def update_user(
    id: str, data: dict, current_user: UserOut = Depends(get_current_active_user)
) -> User:
    update_item_encoded = jsonable_encoder(data)
    await user_collections.update_one({"_id": id}, {"$set": update_item_encoded})
    updated_user = await user_collections.find_one({"_id": id})
    return updated_user


@user_router.delete("/{id}", status_code=204)
async def remove_user(
    id: str, current_user: UserOut = Depends(get_current_active_user)
) -> None:
    user = await user_collections.find_one({"_id": id})
    if user:
        user_collections.delete_one({"_id": id})
    else:
        raise HTTPException(status_code=404, detail=f"No user with id={id}.")


@user_router.delete("/delete/{ids}", status_code=204)
async def remove_list_user(
    ids: str = "", current_user: UserOut = Depends(get_current_active_user)
) -> None:
    users_id = [user_id.strip() for user_id in ids.split(",")]
    for user_id in users_id:
        user = await user_collections.find_one({"_id": user_id})
        if user:
            user_collections.delete_one({"_id": user_id})
        else:
            raise HTTPException(status_code=404, detail=f"No user with id={user_id}.")


@user_router.get("/download-all/")
async def export_users(current_user: UserOut = Depends(get_current_active_user)):
    # current_user = UserService.get_current_user()
    result = []
    users = user_collections.find({}, {"password": 0, "_id": 1})
    async for user in users:
        result.append(UserOut(**user))
    return download_excel(result)


@user_router.post("/upload-image")
async def upload_image(
    file: UploadFile, current_user: UserOut = Depends(get_current_active_user)
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
async def import_users(file: UploadFile):
    filename = file.filename
    extension = filename.split(".")[-1]
    content = await file.read()
    book = pyexcel.get_book(file_type=extension, file_content=content)
    sheet = book.sheet_by_index(0)

    col_map = get_column_map()
    result = []
    start_row = 1
    for index, row in enumerate(sheet):
        if index < start_row:
            continue
        c = get_cell_data(row)
        to_str_inner = to_str(c, col_map)
        data = {
            "username": to_str_inner("username") or None,
            "full_name": to_str_inner("full_name"),
            "email": to_str_inner("email"),
            "password": to_str_inner("password"),
        }
        user = await create(UserIn(**data), user_collections)
        result.append(user)
    return result
