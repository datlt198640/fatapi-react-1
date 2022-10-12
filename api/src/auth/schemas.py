from pydantic import BaseModel


class Token(BaseModel):
    token: str
    token_type: str
    is_admin: bool


class TokenData(BaseModel):
    username: str | None = None


class Login(BaseModel):
    username: str
    password: str


class ChangePasswordSchema(BaseModel):
    old_password: str
    password: str
    password_confirm: str
