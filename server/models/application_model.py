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
    Save full application entry to the 'applications' collection.
    Includes company info, status, uploaded file names, etc.
    """
    data["uploaded_at"] = datetime.utcnow()
    result = applications_collection.insert_one(data)
    return str(result.inserted_id)

def save_resume_entry(user_id: str, file_type: str, url: str, size: int):
    """
    Save a record of uploaded files (resume, cover letter, etc.) to a separate collection.
    Stores user ID, file type, public URL, and size.
    """
    entry = {
        "user_id": user_id,
        "file_type": file_type,  # e.g. resume, coverletter, transcript, job_posting
        "url": url,
        "size": size,
        "uploaded_at": datetime.utcnow()
    }
    uploads_collection.insert_one(entry)
