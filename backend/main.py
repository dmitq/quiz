from fastapi import FastAPI, Depends, HTTPException, Request
import fastapi.security as security
from fastapi.middleware.cors import CORSMiddleware
import sqlalchemy.orm as orm
import services
import schemas
from typing import List
import uvicorn
from dotenv import load_dotenv
import os
import sys
from load_envs import PUBLIC_URL, API_HOST, API_PORT
services.create_database()

app = FastAPI()
app.add_middleware(CORSMiddleware,
                   allow_origins=[ PUBLIC_URL, ],
                   allow_credentials=True,
                   allow_methods=["*"],
                   allow_headers=["*"])


@app.post("/api/users")
async def create_user(user: schemas.UserCreate,
                      db: orm.Session = Depends(services.get_db)):
    db_user = await services.get_user_by_login(user.login, db)
    if db_user:
        raise HTTPException(status_code=400, detail="login exists")
    user = await services.create_user(user, db)
    return await services.create_token(user)


@app.post("/api/token")
async def generate_token(
        form_data: security.OAuth2PasswordRequestForm = Depends(),
        db: orm.Session = Depends(services.get_db)):
    user = await services.authenticate_user(form_data.username,
                                            form_data.password, db)
    if not user:
        raise HTTPException(status_code=400,
                            detail="invalid email or password")
    return await services.create_token(user)


@app.get("/api/users/me", response_model=schemas.User)
async def get_user(user: schemas.User = Depends(services.get_current_user)):
    return user


@app.post("/api/quizes")  # ,response_model=schemas.Quiz)
async def create_quiz(quiz: schemas.QuizCreate,
                      user: schemas.User = Depends(services.get_current_user),
                      db: orm.Session = Depends(services.get_db)):
    return await services.create_quiz(user, db, quiz)


@app.get("/api/quizes", response_model=List[schemas.Quiz])
async def get_user_quizes(user: schemas.User = Depends(
    services.get_current_user),
                          db: orm.Session = Depends(services.get_db)):
    return await services.get_user_quizes(user, db)


@app.get("/api/quizes/{quiz_id}", status_code=200)
async def get_quiz(quiz_id: int, db: orm.Session = Depends(services.get_db)):
    return await services.get_quiz(quiz_id, db)


@app.get("/api/quizes/edit/{quiz_id}", status_code=200)
async def get_quiz_edit(quiz_id: int,
                        db: orm.Session = Depends(services.get_db),
                        user: schemas.User = Depends(
                            services.get_current_user)):
    quiz = await services.get_quiz(quiz_id, db)
    if quiz["author_id"] == user.id:
        return quiz
    raise HTTPException(status_code=400, detail="restricted")


@app.delete("/api/quizes/{quiz_id}", status_code=204)
async def delete_quiz(quiz_id: int,
                      user: schemas.User = Depends(services.get_current_user),
                      db: orm.Session = Depends(services.get_db)):
    await services.delete_quiz(quiz_id, user, db)
    return {"message": "Successfully Deleted"}


@app.put("/api/quizes/{quiz_id}", status_code=200)
async def update_quiz(
        quiz_id: int,
        quiz: schemas.QuizCreate,
        user: schemas.User = Depends(services.get_current_user),
        db: orm.Session = Depends(services.get_db),
):
    await services.update_quiz(quiz_id, quiz, user, db)


@app.get("/api/quizes/bio/{quiz_id}", status_code=200)
async def get_quiz_bio(quiz_id: int,
                       db: orm.Session = Depends(services.get_db)):
    return await services.get_quiz_bio(quiz_id, db)


@app.get("/api/quizes/{quiz_id}/leaderboard", status_code=200)
async def get_leaderboard(quiz_id: int,
                          db: orm.Session = Depends(services.get_db)):
    return await services.get_leaderboard(quiz_id, db)


@app.post("/api/check_answers", status_code=200)
async def check_answers(data: schemas.AnswersCheck,
                        db: orm.Session = Depends(services.get_db)):
    return await services.check_answers(data, db)


@app.get("/api")
async def root():
    return {"mes": "hello"}


if __name__ == "__main__":
    uvicorn.run(app, host=API_HOST, port=int(API_PORT))
