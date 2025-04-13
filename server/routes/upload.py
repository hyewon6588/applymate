from fastapi import APIRouter, UploadFile, File, Form
from services.supabase_upload import upload_to_supabase
from models.application_model import save_resume_entry
from utils.format_upload import format_uploaded_file
from utils.file_parser import extract_text_and_fields

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

@router.post("/upload/resume")
async def upload_job_posting(
    file: UploadFile,
    file_type: str = Form(...),
    user_id: str = Form(...),
    company: str = Form(""),
    position: str = Form(""),
):
    # 1. Upload to Supabase
    result = await upload_to_supabase(
        file,
        user_id,
        file_type=file_type,
        company=company,
        position=position
    )
    uploaded_url = result["public_url"]

    # 2. Extract job fields from the file
    extracted_fields = await extract_text_and_fields(file)

    # 3. Return everything needed for autofill
    return {
        "url": uploaded_url,
        "parsed_company": extracted_fields.get("company", ""),
        "parsed_position": extracted_fields.get("position", ""),
        "parsed_location": extracted_fields.get("location", "")
    }