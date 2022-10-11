from bson import ObjectId
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


class UserBase(BaseModel):
    username: str = Field(...)
    email: EmailStr = Field(...)
    full_name: str | None = None

    avatar: str | None = None
    is_active: bool | None = None
    is_admin: bool | None = None


class UserIn(UserBase):
    password: str = Field(...)

    class Config:
        schema_extra = {
            "example": {
                "username": "datlt198640",
                "email": "datlt198640@example.com",
                "full_name": "Le Thanh Dat",
                "avatar": "datlt198640",
                "is_active": True,
                "is_admin": True,
                "password": "datlt198640"
            }
        }


class UserOut(UserBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "email": "dat.lt198640@example.com",
                "phone_number": "0975982077",
                "password": "datdeptrai"
            }
        }
