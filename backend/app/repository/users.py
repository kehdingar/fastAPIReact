
import email
from multiprocessing import synchronize
from sqlalchemy import update as sql_update
from sqlalchemy.future import select
from service.send_email import password_reset
from fastapi import BackgroundTasks


from config import db, commit_rollback
from model.users import Users
from repository.base_repo import BaseRepo
from .auth_repo import JWTRepo
from service.users import UserService
from dotenv import load_dotenv
import os
from pathlib import Path



env_path = Path(__file__).cwd()
env_file_path = env_path.joinpath("app/.env")

load_dotenv(env_file_path)

class UsersRepository(BaseRepo):
    model = Users

    @staticmethod
    async def find_by_username(username: str):
        query = select(Users).where(Users.username == username)
        return (await db.execute(query)).scalar_one_or_none()

    @staticmethod
    async def find_by_email(email: str):
        query = select(Users).where(Users.email == email)
        return (await db.execute(query)).scalar_one_or_none()

    @staticmethod
    async def  update_password(email: str, url: str,background_tasks:BackgroundTasks):
        token = JWTRepo(data={"email": email}).generate_token()
        reset_link = f"{url}/reset/?token={token}"

        user = await UsersRepository.find_by_email(email)
        return (await password_reset("Password Reset",user.email,{
            "title": "Password Reset",
            "name": user.username,
            "reset_link": reset_link,
            "home":url,
            
        },background_tasks=background_tasks))
    
    @staticmethod
    async def reset_password(new_password: str, email:str):
        query = sql_update(Users).where(Users.email == email).values(
            password=new_password).execution_options(synchronize_session="fetch")
        await db.execute(query)
        await commit_rollback()
