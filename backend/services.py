import fastapi
import fastapi.security as security
import sqlalchemy.orm as orm
import passlib.hash as hash
import database
import models
import schemas
import jwt
from dotenv import load_dotenv
import os

load_dotenv("../.env.production")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
oath2schema = security.OAuth2PasswordBearer(tokenUrl="/api/token")

def create_database():
    return database.Base.metadata.create_all(bind=database.engine)


def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close


async def get_user_by_login(login: str, db: orm.Session):
    return db.query(models.User).filter(models.User.login == login).first()


async def create_user(user: schemas.UserCreate, db: orm.Session):
    user_obj = models.User(login=user.login, hashed_password=hash.bcrypt.hash(
        user.hashed_password), name=user.name)
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)
    return user_obj


async def authenticate_user(login: str, password: str, db: orm.Session):
    user = await get_user_by_login(login, db)
    if not user:
        return False
    if not user.verify_password(password):
        return False
    return user


async def create_token(user: models.User):
    user_obj = schemas.User.from_orm(user)
    token = jwt.encode(user_obj.dict(), JWT_SECRET_KEY)
    return dict(access_token=token, token_type="bearer")


async def get_current_user(db: orm.Session = fastapi.Depends(get_db), token: str = fastapi.Depends(oath2schema)):
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
        user = db.query(models.User).get(payload["id"])
    except:
        raise fastapi.HTTPException(
            status_code=401, detail="Invalid Email or Password")
    return schemas.User.from_orm(user)


async def create_quiz(user: schemas.User, db: orm.Session, quiz: schemas.QuizCreate):
    quiz_info = models.Quiz(
        title=quiz.title, description=quiz.description, author_id=user.id)
    db.add(quiz_info)
    db.commit()
    db.refresh(quiz_info)
    questions = quiz.questions
    quiz = schemas.Quiz.from_orm(quiz_info)
    for question in questions:
        question_info = models.Question(quiz_id=quiz.id, title=question.title)
        db.add(question_info)
        db.commit()
        db.refresh(question_info)
        for answer in question.answers:
            answer_info = models.Answer(question_id=schemas.Question.from_orm(
                question_info).id, title=answer.title, is_correct=answer.is_correct)
            db.add(answer_info)
            db.commit()
            db.refresh(answer_info)
    return quiz


async def select_quiz(quiz_id: int, db: orm.Session):
    quiz = db.query(models.Quiz).filter_by(id=quiz_id).first()
    if quiz is None:
        raise fastapi.HTTPException(
            status_code=404, detail="quiz does not exist")
    return quiz


async def get_user_quizes(user: schemas.User, db: orm.Session):
    quizes = db.query(models.Quiz).filter_by(author_id=user.id)
    return list(map(schemas.Quiz.from_orm, quizes))


async def get_quiz(quiz_id: int, db: orm.Session):
    quiz = await select_quiz(quiz_id, db)
    quiz = dict(schemas.Quiz.from_orm(quiz))
    res = []
    for i in list(map(schemas.Question.from_orm, db.query(models.Question).filter_by(quiz_id=quiz_id))):
        a = dict(i)
        a["answers"] = list(map(schemas.AnswerPublic.from_orm, db.query(
            models.Answer).filter_by(question_id=a["id"])))
        res.append(a)
    quiz["questions"] = res
    quiz["date_created"] = quiz["date_created"]
    return quiz


async def get_quiz_bio(quiz_id: int, db: orm.Session):
    quiz = await select_quiz(quiz_id, db)
    author_name = db.query(models.User).filter_by(id=quiz.author_id).first()
    quiz = dict(schemas.Quiz.from_orm(quiz))
    if author_name:
        quiz["author_name"] = author_name.name
    return quiz


async def delete_quiz(quiz_id: int, user: schemas.User, db: orm.Session):
    quiz = db.query(models.Quiz).filter_by(
        id=quiz_id).filter_by(author_id=user.id).first()
    if quiz:
        db.delete(quiz)
        db.commit()
    questions = db.query(models.Question).filter(
        models.Question.quiz_id == quiz_id)
    for q in questions:
        answers = db.query(models.Answer).filter_by(question_id=q.id)
        for a in answers:
            db.delete(a)
            db.commit()
        db.delete(q)
        db.commit()


async def update_quiz(quiz_id: int, quiz: schemas.QuizCreate, user: schemas.User, db: orm.Session):
    quiz_db = await select_quiz(quiz_id, db)
    quiz_db.title = quiz.title
    quiz_db.description = quiz.description
    db.commit()
    db.refresh(quiz_db)
    questions = db.query(models.Question).filter(
        models.Question.quiz_id == quiz_id)
    for q in questions:
        answers = db.query(models.Answer).filter_by(question_id=q.id)
        for a in answers:
            db.delete(a)
            db.commit()
        db.delete(q)
        db.commit()
    for q in quiz.questions:
        question_info = models.Question(quiz_id=quiz_id, title=q.title)
        db.add(question_info)
        db.commit()
        db.refresh(question_info)
        for a in q.answers:
            answer_info = models.Answer(question_id=schemas.Question.from_orm(
                question_info).id, title=a.title, is_correct=a.is_correct)
            db.add(answer_info)
            db.commit()
            db.refresh(answer_info)


async def check_answers(data: schemas.AnswersCheck, db: orm.Session):
    user_answers = data.answers
    user_name = data.name
    answers = dict()
    items = tuple(user_answers.items())
    quiz_id = db.query(models.Question).filter_by(id=items[0][0]).first().quiz_id
    for question_index, us_answers in items:
        correct_answers = {x.title: x.is_correct for x in db.query(models.Answer).filter_by(question_id=question_index)}
        answers[db.query(models.Question).filter_by(id=question_index).first().title] = dict(
            real_answers=correct_answers,
            user_answers=us_answers
        )
    score = 0
    for key, value in answers.items():
        flag = True
        for i in zip(value["user_answers"].values(), value["real_answers"].values()):
            if i[0] != i[1]:
                flag = False
                break
        if flag:
            score += 1

    leaderboard = models.Leaderboard(
        quiz_id=quiz_id, user_name=user_name, score=score)
    db.add(leaderboard)
    db.commit()
    db.refresh(leaderboard)

    return answers, score

async def get_leaderboard(quiz_id: int, db: orm.Session):
    leaderboard = db.query(models.Leaderboard).filter(models.Leaderboard.quiz_id == quiz_id)
    return sorted(list(map(schemas.Leaderboard.from_orm, leaderboard)), key=lambda x: x.score, reverse=True)
