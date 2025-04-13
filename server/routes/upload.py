from fastapi import APIRouter, UploadFile, File, Form
from services.supabase_upload import upload_to_supabase
from models.application_model import save_resume_entry
from utils.format_upload import format_uploaded_file

router = APIRouter(prefix="/upload", tags=["Upload"])

@router.post("/resume")
async def upload_resume(
    file: UploadFile = File(...),
    file_type: str = Form(...),   # e.g., resume, coverletter, transcript
    user_id: str = Form(...),      # Will be dynamic after login/signup feature
    company: str = Form(...),
    position: str = Form(...)
):
    # Upload file to Supabase Storage
    result = await upload_to_supabase(file, user_id,file_type=file_type,
        company=company,
        position=position)

    # Save metadata to MongoDB
    formatted = format_uploaded_file(file.filename, result["public_url"])
    save_resume_entry(user_id, file_type, formatted, result["size"])

    return {"message": "Upload successful", "url": result["public_url"],"original_name": result["original_name"]}
