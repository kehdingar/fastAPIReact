from fastapi import HTTPException
import logging
import re
from typing import TypeVar, Optional, List
from pydantic import BaseModel, validator, Field
from model.person import Gender

T = TypeVar('T')

# get root logger
logger = logging.getLogger(__name__)


class RegisterSchema(BaseModel):

    username: str
    email: str
    name: str
    password: str
    phone_number: str
    birth: str
    gender: Gender
    profile: str = "base64"

    # phone number validation
    @validator("phone_number")
    def phone_validation(cls, v):
        logger.debug(f"phone in 2 validatior: {v}")

        # regex phone number
        PHONE_NUMBER_REGEX = r"(?:\+\d{2})?\d{3,4}\D?\d{3}\D?\d{3}"

        if v and not re.search(PHONE_NUMBER_REGEX, v, re.I):
            raise HTTPException(status_code=400, detail="Invalid input phone number!")
        return v

    # Gender validation
    @validator("gender")
    def gender_validation(cls, v):
        if hasattr(Gender, v) is False:
            raise HTTPException(status_code=400, detail="Invalid input Gender")
        return v

class LoginSchema(BaseModel):
    username: str
    password: str


class ForgotPasswordSchema(BaseModel):
    email: str
    # new_password: str

class ResetPasswordSchema(BaseModel):
    password: str

class DetailSchema(BaseModel):
    status: str
    message: str
    result: Optional[T] = None

class ResponseSchema(BaseModel):
    detail: str
    result: Optional[T] = None

class TodoSchema(BaseModel):
    id: str
    title: str
    completed: bool = Field(default=False)
    important: bool = Field(default=False)
    detail: Optional[T] = None

class TodoListSchema(BaseModel):
    result: List[TodoSchema] = []
    detail: Optional[T] = None

class AddTodoSchema(BaseModel):
    todo_id: str
    title: str
    detail: Optional[T] = None

class DeleteTodoSchema(BaseModel):
    id: str
    detail: Optional[T] = None

class UpdateCompletedSchema(BaseModel):
    id: str
    detail: Optional[T] = None

class UpdateImportantSchema(BaseModel):
    id: str
    detail: Optional[T] = None

class ToggleData(BaseModel):
    completed : bool = Field(default=False)

class ToggleTodoSchema(BaseModel):
    data:ToggleData

class ToggleImportantData(BaseModel):
    important : bool = Field(default=False)

class ToggleImportantSchema(BaseModel):
    data:ToggleImportantData

class UpdateTodoTitleSchema(BaseModel):
    id:str
    title: str
    detail: Optional[T] = None

class UpdateTodo(BaseModel):
    title : str

class UpdateTodoSchema(BaseModel):
    data:UpdateTodo





