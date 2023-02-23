import datetime as dt
import sqlalchemy as sql
import sqlalchemy.orm as orm
from passlib.hash import bcrypt
import database


class User(database.Base):
    __tablename__ = "users"
    id = sql.Column(sql.Integer, primary_key=True, index=True)
    login = sql.Column(sql.String, unique=True, index=True)
    name = sql.Column(sql.String, index=True, default="Anonymous")
    hashed_password = sql.Column(sql.String)

    quizes = orm.relationship("Quiz", back_populates="author")

    def verify_password(self, password: str):
        return bcrypt.verify(password, self.hashed_password)


class Quiz(database.Base):
    __tablename__ = "quizes"
    id = sql.Column(sql.Integer, primary_key=True, index=True)
    author_id = sql.Column(sql.Integer, sql.ForeignKey("users.id"))
    title = sql.Column(sql.String, index=True)
    description = sql.Column(sql.String, index=True)
    date_created = sql.Column(sql.DateTime, default=dt.datetime.utcnow)

    author = orm.relationship("User", back_populates="quizes")


class Question(database.Base):
    __tablename__ = "questions"
    id = sql.Column(sql.Integer, primary_key=True, index=True)
    quiz_id = sql.Column(sql.Integer, sql.ForeignKey("quizes.id"))
    title = sql.Column(sql.String, index=True)

    answers = orm.relationship("Answer", back_populates="question")


class Answer(database.Base):
    __tablename__ = "answers"
    id = sql.Column(sql.Integer, primary_key=True, index=True)
    question_id = sql.Column(sql.Integer, sql.ForeignKey("questions.id"))
    title = sql.Column(sql.String, index=True)
    is_correct = sql.Column(sql.Boolean, default=False)

    question = orm.relationship("Question", back_populates="answers")


class Leaderboard(database.Base):
    __tablename__ = "leaderboards"
    id = sql.Column(sql.Integer, primary_key=True, index=True)
    quiz_id = sql.Column(sql.Integer, sql.ForeignKey("quizes.id"))
    user_name = sql.Column(sql.String, sql.ForeignKey("users.name"))
    score = sql.Column(sql.Integer, default=0)
    date = sql.Column(sql.DateTime, default=dt.datetime.utcnow)
