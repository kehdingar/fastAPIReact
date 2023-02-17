from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel
from dotenv import load_dotenv
import os

from pathlib import Path


env_path = Path(__file__).cwd()
env_file_path = env_path.joinpath("app/.env")

load_dotenv(env_file_path)

class Envs:
    DATABASE_USERNAME = os.getenv("DATABASE_USERNAME")
    DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD")
    DATABASE_HOST = os.getenv("DATABASE_HOST")
    DATABASE_NAME = os.getenv("DATABASE_NAME")
    SECRET_KEY = os.getenv("SECRET_KEY")
    POSTGRES_PORT = os.getenv("POSTGRES_PORT")

DB_CONFIG = f"postgresql+asyncpg://{Envs.DATABASE_USERNAME}:{Envs.DATABASE_PASSWORD}@{Envs.DATABASE_HOST}:{Envs.POSTGRES_PORT}/{Envs.DATABASE_NAME}"

SECRET_KEY =f"{Envs.SECRET_KEY}"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15

class AsyncDatabaseSession:

    def __init__(self) -> None:
        self.session = None
        self.engine = None

    def __getattr__(self,name):
        return getattr(self.session,name)

    def init(self):
        self.engine = create_async_engine(DB_CONFIG,future=True, echo=True)
        self.session = sessionmaker(self.engine, expire_on_commit=False, class_=AsyncSession)()

    async def create_all(self):
        async with self.engine.begin() as conn:
            await conn.run_sync(SQLModel.metadata.create_all)

db = AsyncDatabaseSession()

async def commit_rollback():
    try:
        await db.commit()
    except Exception:
        await db.rollback()
        raise