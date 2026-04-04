from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List
import os

from database import engine, SessionLocal, Base
from models import Contact
from schemas import ContactCreate, ContactResponse

# Создаём таблицы при запуске
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ContactHub API")

# Разрешаем запросы с фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Раздаём статические файлы (фронтенд)
FRONTEND_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")

@app.get("/")
def root():
    """Главная страница - фронтенд"""
    return FileResponse(os.path.join(FRONTEND_PATH, "index.html"))

app.mount("/static", StaticFiles(directory=FRONTEND_PATH), name="static")


# Получаем сессию БД
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/api/contacts", response_model=ContactResponse)
def create_contact(contact: ContactCreate, db: Session = Depends(get_db)):
    """Добавить новый контакт"""
    db_contact = Contact(name=contact.name, phone=contact.phone, email=contact.email)
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact


@app.get("/api/contacts", response_model=List[ContactResponse])
def get_contacts(search: str = None, db: Session = Depends(get_db)):
    """Получить все контакты или найти по имени/телефону/email"""
    if search:
        search_pattern = f"%{search}%"
        contacts = (
            db.query(Contact)
            .filter(
                Contact.name.like(search_pattern)
                | Contact.phone.like(search_pattern)
                | Contact.email.like(search_pattern)
            )
            .all()
        )
        return contacts
    
    contacts = db.query(Contact).all()
    return contacts


@app.get("/")
def root():
    """Главная страница - фронтенд"""
    return FileResponse(os.path.join(FRONTEND_PATH, "index.html"))
