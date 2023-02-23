import datetime as _dt
from pydantic import BaseModel
from typing import List, Dict


class UserBase(BaseModel):
    login: str
    name: str


class UserCreate(UserBase):
    hashed_password: str

    class Config:
        orm_mode = True


class User(UserBase):
    id: int

    class Config:
        orm_mode = True


class AnswerBase(BaseModel):
    title: str
    is_correct: bool


class AnswerCreate(AnswerBase):
    question_id: int


class Answer(AnswerBase):
    class Config:
        orm_mode = True


class AnswerPublic(BaseModel):
    title: str
    id: int

    class Config:
        orm_mode = True


class QuestionBase(BaseModel):
    title: str
    answers: List[Answer]


class QuestionCreate(QuestionBase):
    pass


class Question(QuestionBase):
    id: int

    class Config:
        orm_mode = True


class QuizBase(BaseModel):
    title: str
    description: str


class QuizCreate(QuizBase):
    questions: List[QuestionBase]


class Quiz(QuizBase):
    id: int
    author_id: int
    date_created: _dt.datetime

    class Config:
        orm_mode = True


class AnswersCheck(BaseModel):
    answers: Dict[int, Dict[str, bool]]
    name: str


class Leaderboard(BaseModel):
    score: int
    user_name: str
    date: _dt.datetime
    class Config:
        orm_mode = True
