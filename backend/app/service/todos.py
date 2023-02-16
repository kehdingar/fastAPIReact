
from sqlalchemy.future import select
from model import Todo
from config import db
from schema import TodoSchema, ResponseSchema, DeleteTodoSchema
from repository.todos import TodosRepository
from fastapi import HTTPException
from typing import List
from model import Todo
from repository.todos import TodosRepository
from uuid import uuid4



class TodoService:
    @staticmethod
    async def get_user_todos(id: str):
        _result = await TodosRepository.find_all_by_id(id)
        if _result is None:
            raise HTTPException(status_code=404, detail="Todos not found !")
        result = _result
        return ResponseSchema(detail="Successfully got Todos!", result=result)

    @staticmethod
    async def add_user_todo(id: str,title:str):
        # Create uuid
        _id = str(uuid4())
        # mapping request data to class entity table
        _todo = Todo(id=_id,title=title,users_id=id)
        return await TodosRepository.create(**_todo.dict())
        
    @staticmethod
    async def get_user_todo(id: str):
        _result = await TodosRepository.get_by_id(id)
        print("COOL")
        result = _result.dict()
        print(_result)
        if _result is None:
            raise HTTPException(status_code=404, detail="Todo not found !")
        return TodoSchema(**result, detail="Successfully Got Todo!",)

    @staticmethod
    async def delete_todo(id: str):
        affected_rows = await TodosRepository.delete(id)
        if affected_rows < 1 :
            raise HTTPException(status_code=404, detail="Todo not found !")
        return DeleteTodoSchema(id=id, detail="Successfully Deleted Todo!",)

    @staticmethod
    async def toogle_completed(id: str, completed: bool):
        completed = not completed
        affected_rows = await TodosRepository.update(id,completed=completed)
        if affected_rows < 1 :
            raise HTTPException(status_code=404, detail="Could not change completed !")
        return DeleteTodoSchema(id=id, detail="Successfully Completed Todo!",)

    @staticmethod
    async def toogle_important(id: str, important: bool):
        important = not important
        affected_rows = await TodosRepository.update(id,important=important)
        if affected_rows < 1 :
            raise HTTPException(status_code=404, detail="Could not change priority !")
        return DeleteTodoSchema(id=id, detail="Successfully Changed Priority Todo!",)

    @staticmethod
    async def toogle_update(id: str, title: str):
        affected_rows = await TodosRepository.update(id,title=title)
        if affected_rows < 1 :
            raise HTTPException(status_code=404, detail="Could not update title !")
        return DeleteTodoSchema(id=id, detail="Successfully Updated Todo Title!",)

