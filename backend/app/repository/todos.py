from sqlalchemy import update as sql_update
from sqlalchemy.future import select
from config import db
from model.todo import Todo
from repository.base_repo import BaseRepo
from sqlalchemy import desc

class TodosRepository(BaseRepo):
    model = Todo

    @staticmethod
    async def find_all_by_id(id: str):
        query = select(Todo.id,
                        Todo.title,
                        Todo.completed,
                        Todo.important,
        ).where(Todo.users_id == id).order_by(desc(Todo.modified_at))
        return (await db.execute(query)).mappings().all()

    @staticmethod
    async def find_by_id(id: str):
        query = select(Todo.id,
                        Todo.title,
                        Todo.completed,
                        Todo.important,
        ).where(Todo.id == id)
        return (await db.execute(query)).mappings().one()

