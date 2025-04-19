from fastapi import APIRouter, HTTPException,Request
from pydantic import BaseModel
from utils.auth_utils import decode_access_token
from models.application_model import save_application, get_applications_by_userid
from typing import Optional

router = APIRouter()

class FileMetadata(BaseModel):
    name: str
    url: str

# Schema for uploaded file names
class UploadedFiles(BaseModel):
    resume: Optional[FileMetadata] = ""
    coverletter: Optional[FileMetadata] = ""
    transcript: Optional[FileMetadata] = ""
    job_posting: Optional[FileMetadata] = ""

# Schema for application payload
class ApplicationPayload(BaseModel):
    application_id: Optional[str] = None
    user_id: Optional[str] =""
    company: Optional[str] = ""
    position: Optional[str] = ""
    location: Optional[str] = ""
    status: Optional[str] = ""
    uploadedFiles: UploadedFiles


@router.get("/applications/me")
def get_user_applications(request: Request):
    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authorization token missing")

    token = auth_header.split(" ")[1]

    try:
        payload = decode_access_token(token)
        userId = payload.get("sub")
        if not userId:
            raise HTTPException(status_code=401, detail="Invalid token")

        return get_applications_by_userid(userId)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/applications")
def create_application(application: ApplicationPayload):
    """
    Save application to MongoDB.
    """
    try:
        app_dict = application.dict()
        inserted_id = save_application(app_dict)
        return {"message": "Application saved", "id": inserted_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
