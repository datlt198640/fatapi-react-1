from datetime import datetime
from pydantic import Field
from .schemas import UserOut


class User(UserOut):
    password: str = Field(...)
    token_signature : str | None = None    
    token_refresh_limit : datetime | None = None,