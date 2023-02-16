from fastapi import APIRouter,Security

from schema import TodoSchema, UpdateTodoSchema, UpdateTodoTitleSchema, ToggleImportantSchema, UpdateCompletedSchema, UpdateImportantSchema,ToggleTodoSchema, AddTodoSchema, TodoListSchema, DeleteTodoSchema
from repository.auth_repo import JWTBearer, JWTRepo
from fastapi.security import HTTPAuthorizationCredentials
from service.todos import TodoService
from typing import List

router = APIRouter(
    prefix="/todos",
    tags=['Todos'],
    # dependencies=[Depends(JWTBearer())]
)


@router.get("/", response_model=TodoListSchema)
async def get_user_todos(credentials: HTTPAuthorizationCredentials = Security(JWTBearer())):
    token = JWTRepo.extract_token(credentials)
    id = token['id']
    results = await TodoService.get_user_todos(id)
    detail = results.detail
    result = results.result
    return TodoListSchema(result=result, detail=detail)

@router.post("/add", response_model=AddTodoSchema)
async def add_todo(data:dict,credentials: HTTPAuthorizationCredentials = Security(JWTBearer())):
    print(credentials)
    token = JWTRepo.extract_token(credentials)
    id = token['id']
    title = data['title']
    token = JWTRepo.extract_token(credentials)
    result = await TodoService.add_user_todo(id=id,title=title)
    return AddTodoSchema(todo_id=result.id,detail="Successfully Added Todo",title=title)

@router.get("/{id}", response_model=TodoSchema)
async def get_todo(id:str,credentials: HTTPAuthorizationCredentials = Security(JWTBearer())):
    token = JWTRepo.extract_token(credentials)
    # token = JWTRepo.extract_token(credentials)
    result = await TodoService.get_user_todo(id=id)
    return TodoSchema(**result.dict())

@router.delete("/delete/{id}", response_model=DeleteTodoSchema)
async def delete_todo(id:str,credentials: HTTPAuthorizationCredentials = Security(JWTBearer())):
    token = JWTRepo.extract_token(credentials)
    print("TODOD SUCCESSFULLY DELETED")
    result = await TodoService.delete_todo(id=id)
    return DeleteTodoSchema(id=result.id, detail=result.detail)

@router.put("/toggleCompleted/{id}", response_model=UpdateCompletedSchema)
async def toogle_completed(requset_body:ToggleTodoSchema, id: str,credentials: HTTPAuthorizationCredentials = Security(JWTBearer())):
    token = JWTRepo.extract_token(credentials)
    completed = requset_body.data.completed
    print(completed)
    result = await TodoService.toogle_completed(id=id,completed=completed)
    return UpdateCompletedSchema(id=result.id, detail=result.detail)

@router.put("/toggleImportant/{id}", response_model=UpdateImportantSchema)
async def toogle_important(requset_body:ToggleImportantSchema, id: str,credentials: HTTPAuthorizationCredentials = Security(JWTBearer())):
    token = JWTRepo.extract_token(credentials)
    important = requset_body.data.important
    print(str(important).upper())
    result = await TodoService.toogle_important(id=id,important=important)
    return UpdateImportantSchema(id=result.id, detail=result.detail)

@router.put("/update/{id}", response_model=UpdateTodoTitleSchema)
async def toogle_update(requset_body:UpdateTodoSchema, id: str,credentials: HTTPAuthorizationCredentials = Security(JWTBearer())):
    token = JWTRepo.extract_token(credentials)
    print("TODOD SUCCESSFULLY TOGGLED")
    title = requset_body.data.title
    result = await TodoService.toogle_update(id=id,title=title)
    return UpdateTodoTitleSchema(id=id, title=title, detail=result.detail)
