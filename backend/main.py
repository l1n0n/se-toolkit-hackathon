from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List
import os

from database import engine, SessionLocal, Base
from models import Contact, User
from schemas import ContactCreate, ContactResponse, UserCreate, UserLogin, Token, UserResponse
from auth import (
    get_db, 
    get_password_hash, 
    authenticate_user, 
    create_access_token, 
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

# Создаём таблицы при запуске
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ContactHub API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

FRONTEND_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")

@app.get("/")
def root():
    return FileResponse(os.path.join(FRONTEND_PATH, "index.html"))

app.mount("/static", StaticFiles(directory=FRONTEND_PATH), name="static")


@app.post("/api/auth/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username уже занят")
    
    hashed_password = get_password_hash(user.password)
    db_user = User(username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@app.post("/api/auth/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = authenticate_user(db, user.username, user.password)
    if not db_user:
        raise HTTPException(status_code=400, detail="Неверное имя пользователя или пароль")
    
    access_token = create_access_token(
        data={"sub": db_user.username}
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/api/auth/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@app.post("/api/contacts", response_model=ContactResponse)
def create_contact(
    contact: ContactCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_contact = Contact(
        name=contact.name, 
        phone=contact.phone, 
        email=contact.email,
        owner_id=current_user.id
    )
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact


@app.get("/api/contacts", response_model=List[ContactResponse])
def get_contacts(
    search: str = None, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if search:
        search_pattern = f"%{search}%"
        contacts = (
            db.query(Contact)
            .filter(Contact.owner_id == current_user.id)
            .filter(
                Contact.name.like(search_pattern)
                | Contact.phone.like(search_pattern)
                | Contact.email.like(search_pattern)
            )
            .all()
        )
        return contacts

    contacts = db.query(Contact).filter(Contact.owner_id == current_user.id).all()
    return contacts
