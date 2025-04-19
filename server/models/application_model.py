from fastapi import HTTPException
from pymongo import MongoClient
from datetime import datetime
import os
from dotenv import load_dotenv
from bson import ObjectId


# Load environment variables
load_dotenv()

# Connect to MongoDB Atlas
client = MongoClient(os.getenv("MONGO_URI"))

# Select database and collections
db = client["applymate"]
user_collection = db["users"]
applications_collection = db["applications"]
uploads_collection = db["uploaded_files"]

def get_applications_by_userid(userid: str):
    user_id = ObjectId(userid)
    apps = list(applications_collection.find({"user_id": user_id}))
    for app in apps:
        app["_id"] = str(app["_id"])
        app["user_id"] = str(app["user_id"])
    return apps

def save_application(data: dict) -> str:
    """
    Upsert application entry by application_id.
    If not present, create new one. Otherwise, update existing.
    """
    application_id = data.get("application_id")
    if not application_id:
        raise ValueError("Missing application_id")
    user_id = data.get("user_id")
    if not user_id:
        raise ValueError("Missing user_id")
    
    try:
        data["user_id"] = ObjectId(user_id)
    except Exception:
        raise ValueError("Invalid user_id format")

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
