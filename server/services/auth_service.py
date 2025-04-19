from models.user_model import SignupRequest, UserInDB, UserPublic, LoginRequest
from utils.auth_utils import hash_password, verify_password, create_access_token
from datetime import datetime
from db.mongodb import user_collection
from fastapi import HTTPException


def create_user(user: SignupRequest) -> str:
    hashed_pw = hash_password(user.password)
    user_dict = {
        "username": user.username,
        "password_hash": hashed_pw,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "created_at": datetime.utcnow()
    }
    result = user_collection.insert_one(user_dict)
    return str(result.inserted_id)


# Authenticate user during login
def authenticate_user(login_data: LoginRequest) -> str:
    user = user_collection.find_one({"username": login_data.username})
    if not user or not verify_password(login_data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    payload = {
        "sub": str(user["_id"]),
        "username": user["username"]
    }

    token = create_access_token(payload)
    return token