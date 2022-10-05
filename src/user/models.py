from pydantic import Field
from .schemas import UserOut


class User(UserOut):
    password: str = Field(...)

