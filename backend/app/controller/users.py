from fastapi import APIRouter,Depends,Security

from schema import ResponseSchema, RegisterSchema, LoginSchema, ForgotPasswordSchema
from repository.auth_repo import JWTBearer, JWTRepo
from fastapi.security import HTTPAuthorizationCredentials
from service.users import UserService

router = APIRouter(
    prefix="/users",
    tags=['Users'],
    dependencies=[Depends(JWTBearer())]
)

@router.get("/", response_model=ResponseSchema, response_model_exclude_none=True)
async def get_user_profile(credentials: HTTPAuthorizationCredentials = Security(JWTBearer())):
    token = JWTRepo.extract_token(credentials)
    result = await UserService.get_user_profile(token['username'])
    return ResponseSchema(detail="Successfully fetched data!", result=result)