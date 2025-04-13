from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from models.application_model import save_application

router = APIRouter()

# Schema for uploaded file names
class UploadedFiles(BaseModel):
    resume: str = ""
    coverletter: str = ""
    transcript: str = ""
    job_posting: str = ""

# Schema for application payload
class ApplicationPayload(BaseModel):
    company: str
    position: str
    location: str
    status: str
    uploadedFiles: UploadedFiles

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
