from datetime import datetime
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from typing import List
from schema import EmailSchema
from starlette.responses import JSONResponse
from user.models import User
from jinja2 import Environment, select_autoescape, PackageLoader


conf = ConnectionConfig(
    MAIL_USERNAME="datlt198640",
    MAIL_PASSWORD="qwthjtbwbfupcuas",
    MAIL_FROM="dat.lt198640@gmail.com",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_TLS=True,
    MAIL_SSL=False,
)


class Utils:
    @staticmethod
    async def send_email(user: User, not_hash_password: str):

        full_name = user.full_name
        username = user.username
        password = not_hash_password
        email = user.email

        context = {
            "fullname": full_name,
            "username": username,
            "password": password,
        }
        subject = "[RAY] Response from RAY"
        target = ["ltdat1001@gmail.com"]
        content = f"Hello {full_name}\nWelcome you to RAY, Your account has just been created to access the system. To start use, please access 'http://localhost:3000/#/login?next=/' to login your account:\nUsername: {username}\nPassowrd: {password}\n Best regards,"
        message = MessageSchema(subject=subject, recipients=target, body=content)

        fm = FastMail(conf)
        await fm.send_message(message)

    @staticmethod
    def now() -> datetime:
        return datetime.now()
