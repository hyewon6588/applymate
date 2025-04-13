from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from models.application_model import save_application, get_applications_by_user_id
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

@router.get("/applications/{user_id}")
def get_applications(user_id: str):
    try:
        return get_applications_by_user_id(user_id)
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
