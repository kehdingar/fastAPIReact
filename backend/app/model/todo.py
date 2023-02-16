from typing import Optional
from sqlalchemy import Column, String, Boolean
from sqlmodel import SQLModel, Field, Relationship
from .mixins import TimeMixin

class Todo(SQLModel,TimeMixin,table=True):
    __tablename__ = "todos"
    id: Optional[str] = Field(default=None, primary_key=True, nullable=False)
    title: str = Field(sa_column=Column("title", String, unique=True))
    completed: bool = Field(sa_column=Column("completed", Boolean, default=False,unique=False))
    important: bool = Field(sa_column=Column("important",Boolean, default=False,unique=False))
    users_id: Optional[str] = Field(default=None, foreign_key="users.id")
    users: Optional["Users"] = Relationship(back_populates="todos")
