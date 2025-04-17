# models/user_model.py

from pydantic import BaseModel, EmailStr
from datetime import datetime

# Input from frontend
class SignupRequest(BaseModel):
    username: str
    password: str
    email: EmailStr
    first_name: str
    last_name: str

# DB representation
class UserInDB(BaseModel):
    username: str
    password_hash: str
    email: EmailStr
    first_name: str
    last_name: str
    created_at: datetime

# Response to client
class UserPublic(BaseModel):
    username: str
    email: EmailStr
    first_name: str
    last_name: str

class LoginRequest(BaseModel):
    username: str
    password: str