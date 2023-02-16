import base64
from datetime import datetime
from uuid import uuid4
from fastapi import HTTPException
from passlib.context import CryptContext
from schema import RegisterSchema
from model import Person, Users, UsersRole, Role
from repository.role import RoleRepository
from repository.users import UsersRepository
from repository.person import PersonRepository
from repository.user_role import UsersRoleRepository
from schema import LoginSchema, ForgotPasswordSchema, ResetPasswordSchema
from repository.auth_repo import JWTRepo
from datetime import timedelta
from pathlib import Path
from fastapi import BackgroundTasks

LOGIN_EXPIRES = timedelta(days=7)

# Encrypt password
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AuthService:

    @staticmethod
    async def register_service(register: RegisterSchema):

        the_file_path = Path(__file__).cwd()
        raw_path = the_file_path.joinpath("./media/profile.png")
        MEDIA_PATH = str(raw_path).lower()

        # Create uuid
        _person_id = str(uuid4())
        _users_id = str(uuid4())

        # convert birth date type from frontend str to date
        try:
            birth_date = datetime.strptime(register.birth, '%d-%m-%Y')
        except ValueError:
            raise HTTPException(status_code=404, detail="Invalid date!")

        # open image profile default to bas64 string
        with open(f"{MEDIA_PATH}", "rb") as f:
            image_str = base64.b64encode(f.read())
        image_str = "data:image/png;base64," + image_str.decode('utf-8')
        
        # mapping request data to class entity table
        _person = Person(id=_person_id, name=register.password, birth=birth_date, gender=register.gender,
                         profile=image_str, phone_number=register.phone_number)

        _users = Users(id=_users_id, username=register.username, email=register.email,
                       password=pwd_context.hash(register.password),
                       person_id=_person_id)

        # Everyone who registers through our registration page makes the default as a user
        _role = await RoleRepository.find_by_role_name("user")
        _users_role = UsersRole(users_id=_users_id, role_id=_role.id)

        # Cheking the same username
        _username = await UsersRepository.find_by_username(register.username)
        if _username:
            raise HTTPException(
                status_code=400, detail="Username already exists!")

        # Cheking the same email
        _email = await UsersRepository.find_by_email(register.email)
        if _email:
            raise HTTPException(
                status_code=400, detail="Email already exists!")

        else:
            #  insert to tables
            await PersonRepository.create(**_person.dict())
            await UsersRepository.create(**_users.dict())
            await UsersRoleRepository.create(**_users_role.dict())

    @staticmethod
    async def logins_service(login: LoginSchema):
        _username = await UsersRepository.find_by_username(login.username)

        if _username is not None:
            if not pwd_context.verify(login.password, _username.password):
                raise HTTPException(
                    status_code=400, detail="Invalid Password !")
            return JWTRepo(data={"username": _username.username,"id":_username.id}).generate_token(expires_delta=timedelta(minutes=45))
        raise HTTPException(status_code=404, detail="Username not found !")

    @staticmethod
    async def forgot_password_service(forgot_password: ForgotPasswordSchema, url:str,background_tasks:BackgroundTasks):
        _email = await UsersRepository.find_by_email(forgot_password.email)
        if _email is None:
            raise HTTPException(status_code=404, detail="Email not found !")
        await UsersRepository.update_password(forgot_password.email,url=url,background_tasks=background_tasks)

    @staticmethod
    async def reset_password_service(reset_password: ResetPasswordSchema, email:str):
        _email = await UsersRepository.find_by_email(email)
        if _email is None:
            raise HTTPException(status_code=404, detail="Email not found !")
        await UsersRepository.reset_password(pwd_context.hash(reset_password.password),email)

# Generate roles manually
async def generate_role():
    _role = await RoleRepository.find_by_list_role_name(["admin", "user"])
    if not _role:
        await RoleRepository.create_list(
            [Role(id=str(uuid4()), role_name="admin"), Role(id=str(uuid4()), role_name="user")])
