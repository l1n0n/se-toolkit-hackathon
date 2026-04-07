from pydantic import BaseModel
from typing import Optional, List


# === User schemas ===
class UserCreate(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


# === Contact schemas ===
class ContactCreate(BaseModel):
    name: str
    phone: str
    email: str


class ContactResponse(BaseModel):
    id: int
    name: str
    phone: str
    email: str
    owner_id: int

    class Config:
        from_attributes = True
