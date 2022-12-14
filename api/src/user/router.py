import time
import binascii
import base64
import pyexcel
from fastapi import Depends, HTTPException, APIRouter, UploadFile, Response
from fastapi.encoders import jsonable_encoder

from starlette import status

from database import database

from .schemas import UserIn, UserOut
from .models import User
from .utils import (
    remove_file,
    download_excel,
    image_dest,
    create,
    import_user,
)
from auth.service import get_current_active_admin_user, get_current_active_user
from pagination import paginate_response
from celery.result import AsyncResult
from openpyxl import load_workbook
from openpyxl.writer.excel import save_virtual_workbook
from starlette.background import BackgroundTasks
from pydantic import EmailStr


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
    new_user = await create(payload)
    return new_user


@user_router.put("/{id}", response_model=UserOut)
async def update_user(
    id: str,
    data: dict,
    current_user: UserOut = Depends(get_current_active_user),
    current_admin_user: UserOut = Depends(get_current_active_admin_user),
) -> User:
    username = data.get("username", "")
    email = data.get("email", "").lower()
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
            status_code=status.HTTP_409_CONFLICT, detail="Invalid username/email"
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
async def export_users(background_tasks: BackgroundTasks):
    result = []
    users = user_collections.find({}, {"password": 0, "_id": 1})
    async for user in users:
        result.append(jsonable_encoder(UserOut(**user)))
    task = download_excel.delay(result)
    result = AsyncResult(task.id)
    while not result.ready():
        time.sleep(0.1)
    file_path = result.get()
    wb = load_workbook(file_path)
    background_tasks.add_task(remove_file, file_path)
    return Response(
        save_virtual_workbook(wb),
        headers={
            "Content-Disposition": f"attachment; filename=list-user.xlsx",
            "Content-Type": "application/ms-excel",
        },
    )


@user_router.post("/upload-image")
async def upload_image(
    file: UploadFile, current_user: UserOut = Depends(get_current_active_admin_user)
):
    filename = file.filename
    extension = filename.split(".")[-1]
    if extension not in ["png", "jpg"]:
        return {"status": "error", "detail": "File extension is not allowed"}
    generated_name = image_dest(filename)
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
    excel_base64 = base64.b64encode(content).decode()
    task = import_user.delay(excel_base64, extension)
    result = AsyncResult(task.id)
    while not result.ready():
        time.sleep(0.1)
    if result.get():
        for user in result.get():
            await create(UserIn(**user))
    return result.get()
