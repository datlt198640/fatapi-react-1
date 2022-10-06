import jwt
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette import status
from .utils import get_token_from_header, get_token_signature, is_revoked


SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30



class AuthMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request: Request, call_next):
        token = get_token_from_header(request)
        token_signature = get_token_signature(token)
        if is_revoked(token_signature) or jwt.decode(token, SECRET_KEY, algorithms=["HS256"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        response = await call_next(request)
        return response