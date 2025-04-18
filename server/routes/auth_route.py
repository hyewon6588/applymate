from fastapi import APIRouter, HTTPException
from models.user_model import SignupRequest,LoginRequest
from services.auth_service import create_user, authenticate_user
from db.mongodb import user_collection

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.get("/check-username")
def check_username(username: str):
     # Check if username already exists in the collection
    existing_user = user_collection.find_one({"username": username})
    
    return {"available": existing_user is None}

@router.post("/signup")
def signup(user: SignupRequest):
    try:
        user_id = create_user(user)
        return {"message": "User created successfully", "user_id": user_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login")
def login_user(login_data: LoginRequest):
    token = authenticate_user(login_data)
    return {"access_token": token, "token_type": "bearer"}