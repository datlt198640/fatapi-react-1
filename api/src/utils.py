from datetime import datetime
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from typing import List
from schema import EmailSchema
from starlette.responses import JSONResponse


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
    async def send_mail():

        message = MessageSchema(
            subject="Fastapi-Mail module",
            recipients=[
                "ltdat1001@gmail.com"
            ],  # List of recipients, as many as you can pass
            body="Simple background task",
        )

        fm = FastMail(conf)
        await fm.send_message(message)
        # return JSONResponse(status_code=200, content={"message": "email has been sent"})

    @staticmethod
    def now() -> datetime:
        return datetime.now()
