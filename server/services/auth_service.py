from models.user_model import SignupRequest, UserInDB, UserPublic
from utils.auth_utils import hash_password
from datetime import datetime
from db.mongodb import user_collection


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
