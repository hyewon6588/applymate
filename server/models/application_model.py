from pymongo import MongoClient
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Connect to MongoDB Atlas
client = MongoClient(os.getenv("MONGO_URI"))
db = client.resume_app     # Database name
collection = db.resumes    # Collection name

# Save metadata of uploaded file
def save_resume_entry(user_id: str, file_type: str, url: str, size: int):
    entry = {
        "user_id": user_id,
        "file_type": file_type,         # resume, coverletter, etc
        "url": url,                     # Public Supabase file URL
        "size": size,                   # in bytes
        "uploaded_at": datetime.utcnow()
    }
    collection.insert_one(entry)
