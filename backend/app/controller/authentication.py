from fastapi import APIRouter, HTTPException
from fastapi_mail import ConnectionConfig
from jose import ExpiredSignatureError
from repository.auth_repo import JWTRepo

from schema import ResponseSchema, RegisterSchema, LoginSchema, ForgotPasswordSchema, ResetPasswordSchema
from service.auth import AuthService
from service.send_email import send_registration_mail
from fastapi.encoders import jsonable_encoder
from dotenv import load_dotenv
import os
from pathlib import Path
from fastapi import Request, BackgroundTasks
from fastapi_mail import ConnectionConfig
from pathlib import Path

load_dotenv()

router = APIRouter(prefix="/auth", tags=['Authentication'])

class Envs:
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_FROM = os.getenv("MAIL_FROM")
    MAIL_PORT = os.getenv("MAIL_PORT")
    MAIL_SERVER = os.getenv("MAIL_SERVER")
    MAIL_FROM_NAME = os.getenv("MAIL_FROM_NAME")


conf = ConnectionConfig(
    MAIL_USERNAME=Envs.MAIL_USERNAME,
    MAIL_PASSWORD=Envs.MAIL_PASSWORD,
    MAIL_FROM=Envs.MAIL_FROM,
    MAIL_PORT=Envs.MAIL_PORT,
    MAIL_SERVER=Envs.MAIL_SERVER,
    MAIL_FROM_NAME=Envs.MAIL_FROM_NAME,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
    TEMPLATE_FOLDER= Path(__file__).parent.parent / 'templates',
)

@router.post("/register", response_model=ResponseSchema, response_model_exclude_none=True)
async def register(request_body: RegisterSchema,request: Request,background_tasks: BackgroundTasks):
    await AuthService.register_service(request_body)
    user_info = jsonable_encoder(request_body)
    url  = request._headers['origin']

    # background_tasks.add_task(fm.send_message,message, template_name='email.html')    

    await send_registration_mail("Registration Succesful", user_info["email"],{
        "title": "Registration Succesful",
        "name": user_info["name"],
        "home": url,
    },background_tasks=background_tasks)

    return ResponseSchema(detail="Successfully Created Account!")

@router.post("/login", response_model=ResponseSchema)
async def login(requset_body: LoginSchema):
    token = await AuthService.logins_service(requset_body)
    return ResponseSchema(detail="Successfully login", result={"token_type": "Bearer", "access_token": token})


@router.post("/forgot-password", response_model=ResponseSchema, response_model_exclude_none=True)
async def forgot_password(request_body: ForgotPasswordSchema,request: Request, background_tasks:BackgroundTasks):
    url  = request._headers['origin']
    await AuthService.forgot_password_service(request_body,url=url,background_tasks=background_tasks)
    return ResponseSchema(detail="Please check your email")


@router.post("/reset-password/{token}")
async def reset_password(token: str, request_body:ResetPasswordSchema,):
    try:
        extracted_token = JWTRepo.extract_token(token)
        email = extracted_token['email']
        await AuthService.reset_password_service(request_body,email)
        return ResponseSchema(detail="Successfully Changed Password!")
    except ExpiredSignatureError:
        raise HTTPException(status_code=404, detail="The link has expiered, Please get a new link")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid link, Please verify the link")





