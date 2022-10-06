import motor.motor_asyncio
from config import settings


DATABASE_URL = settings.DATABASE_URL
client = motor.motor_asyncio.AsyncIOMotorClient(DATABASE_URL)
database = client.users_db
