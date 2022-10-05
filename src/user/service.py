import uuid
from fastapi import HTTPException, UploadFile
from starlette import status
from .utils import file_dest
from .schemas import UserOut


class UserService:
    @staticmethod
    async def create_user(user):
        pass

    @staticmethod
    async def authenticate(email, password):
        pass

    @staticmethod
    async def get_user_by_email(email: str):
        pass

    @staticmethod
    async def export_user_list(email: str):
        pass

    @staticmethod
    async def get_current_user():
        pass

    @staticmethod
    async def get_download_list_user(user_collections):
        result = []
        users = user_collections.find({}, {"password": 0, "_id": 1})
        async for user in users:
            result.append(UserOut(**user))
        return result

    # @staticmethod
    # async def upload_image(file: UploadFile):
    #     file_name = file.filename
    #     extension = file_name.split()[-1]
    #     if extension not in ["png", "jpg"]:
    #         return {"status": "error", "detail": "File extension is not allowed"}
    #     generated_name = file_dest(file_name)
    #     file_content = await file.read()
    #     with open(generated_name, "wb") as file:
    #         file.write(file_content)
    #     file.close()
    #     return {"file_name": file_name}
