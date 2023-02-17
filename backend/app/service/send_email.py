from pathlib import Path
from dotenv import load_dotenv
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from typing import Dict
from fastapi import BackgroundTasks
from pathlib import Path
import os
from pathlib import Path


env_path = Path(__file__).cwd()
env_file_path = env_path.joinpath("app/.env")

load_dotenv(env_file_path)


class Envs:
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')
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

async def send_registration_mail(subject: str, email_to: str, body: dict,background_tasks:BackgroundTasks):
    message = MessageSchema(
        subject=subject,
        recipients=[email_to],
        template_body=body,
        subtype="html"
    )

    fm = FastMail(conf)
    background_tasks.add_task(fm.send_message,message, template_name='email.html')    


async def password_reset(subject: str, email_to: str, body: Dict,background_tasks:BackgroundTasks):
    message = MessageSchema(
        subject=subject,
        recipients=[email_to],
        template_body=body,
        subtype="html"
    )

    fm = FastMail(conf)
    background_tasks.add_task(fm.send_message,message, template_name='password-reset.html')    

