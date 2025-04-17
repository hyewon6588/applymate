from fastapi import APIRouter, HTTPException
from models.user_model import SignupRequest,LoginRequest
from services.auth_service import create_user, authenticate_user

router = APIRouter(prefix="/auth", tags=["Auth"])

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