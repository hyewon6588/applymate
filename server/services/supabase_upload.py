import os
import uuid
import requests
from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

# 50MB limit
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB in bytes

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/octet-stream"
}

async def upload_to_supabase(file, user_id: str, file_type: str = "resume"):
    file_bytes = await file.read()
    file_size = len(file_bytes)

    # 1. Validate file size
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File exceeds 50MB limit.")

    # 2. Construct path: applications/{user_id}/{file_type}/{uuid_filename}
    filename = f"{uuid.uuid4().hex}_{file.filename}"
    path = f"{user_id}/{file_type}/{filename}"
    upload_url = f"{SUPABASE_URL}/storage/v1/object/applications/{path}"

    # 3. Upload to Supabase
    response = requests.post(upload_url, headers=headers, data=file_bytes)

    if response.status_code not in (200, 201):
        raise HTTPException(status_code=500, detail="Supabase upload failed.")

    # 4. Return public URL and size
    public_url = f"{SUPABASE_URL}/storage/v1/object/public/applications/{path}"

    return {"public_url": public_url, "size": file_size}
