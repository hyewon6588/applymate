from pymongo import MongoClient
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Connect to MongoDB Atlas
client = MongoClient(os.getenv("MONGO_URI"))

# Select database and collections
db = client["applymate"]
applications_collection = db["applications"]
uploads_collection = db["uploaded_files"]

def save_application(data: dict) -> str:
    """
    Upsert application entry by application_id.
    If not present, create new one. Otherwise, update existing.
    """
    application_id = data.get("application_id")
    if not application_id:
        raise ValueError("Missing application_id")

    result = applications_collection.update_one(
        {"application_id": application_id},
        {
            "$set": data,
            "$setOnInsert": {"uploaded_at": datetime.utcnow()}
        },
        upsert=True
    )

    return str(result.upserted_id) if result.upserted_id else "updated"

def save_resume_entry(user_id: str, file_type: str, file_info: dict, size: int):
    """
    Save a record of uploaded files (resume, cover letter, etc.) to a separate collection.
    Stores user ID, file type, public URL, and size.
    """
    entry = {
        "user_id": user_id,
        "file_type": file_type,  # e.g. resume, coverletter, transcript, job_posting
        "name": file_info["name"],
        "url": file_info["url"],
        "size": size,
        "uploaded_at": datetime.utcnow()
    }
    uploads_collection.insert_one(entry)
