from typing import List, Optional
from sqlmodel import SQLModel, Field, Relationship
from .user_role import UsersRole
from .mixins import TimeMixin

class Role(SQLModel, TimeMixin, table=True):
    __tablename__= "role"

    id: Optional[str] = Field(default=None, primary_key=True)
    role_name: str
    users: List["Users"] = Relationship(back_populates="roles", link_model=UsersRole)    