import jwt
import pytz
from datetime import datetime, timedelta, timezone
from user.models import User
from database import database

user_collections = database.get_collection("users")


SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"


def create_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(tz=timezone.utc) + expires_delta
    else:
        expire = datetime.now(tz=timezone.utc) + timedelta(seconds=60 * 2400)
    to_encode["exp"] = expire
    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )


def get_token_from_header(request) -> str:
    if token_header := request.headers.get("Authorization"):
        prefix = "JWT"
        return token_header.split(prefix)[-1] if token_header.startswith(prefix) else ""
    return ""


def get_token_signature(token: str) -> str:
    if token:
        return token.split(".")[-1]
    return ""


async def is_revoked(token_signature: str) -> bool:
    if not token_signature:
        return True

    user = await user_collections.find_one({"token_signature": token_signature})
    return not bool(user)


async def refresh(token_signature: str) -> str:
    try:
        user = await user_collections.find_one({"token_signature": token_signature})
        user = User(**user)
        now = datetime.now(tz=timezone.utc)
        if not user:
            message = "User does not exist"
            return (False, message)
        if not user.is_active:
            message = "This user is inactive"
            return (False, message)

        token_refresh_limit = user.token_refresh_limit
        if not token_refresh_limit:
            token_refresh_limit = now + timedelta(minutes=2)

        local_tz = pytz.timezone("UTC")
        token_refresh_limit_date_time = token_refresh_limit.replace(
            tzinfo=pytz.utc
        ).astimezone(local_tz)
        date_time_now = now.replace(tzinfo=pytz.utc).astimezone(local_tz)

        if token_refresh_limit_date_time < date_time_now:
            message = "Invalid refresh limit"
            return (False, message)

        token = create_token(data={"sub": user.username})
        token_signature = get_token_signature(token)
        await user_collections.update_one(
            {"username": user.username},
            {
                "$set": {
                    "token_signature": token_signature,
                    "token_refresh_limit": datetime.now(tz=timezone.utc)
                    + timedelta(seconds=60),
                }
            },
        )
        print("update successfully=")
        return (True, token)
    except Exception as e:
        message = repr(e)
        return (False, message)