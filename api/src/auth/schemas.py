from pydantic import BaseModel


class Token(BaseModel):
    token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None

class Login(BaseModel):
    username: str
    password:str


class ChangePasswordSchema(BaseModel):
    old_password: str
    password: str
    password_confirm: str