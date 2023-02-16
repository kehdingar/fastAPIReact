from datetime import date
from typing import Optional
from sqlalchemy import Enum
from sqlmodel import SQLModel, Field, Relationship
from .mixins import TimeMixin


class Gender(str, Enum):
    MALE = "MALE"
    FEMALE = "FEMALE"

class Person(SQLModel, TimeMixin, table=True):
    __tablename__ = "person"

    id: Optional[str] = Field(default=None, primary_key=True, nullable=False)
    name: str
    birth: date
    gender: Gender
    profile: str
    phone_number: str
    users: Optional["Users"] = Relationship(sa_relationship_kwargs={
        'uselist': False
    }, back_populates="person")
