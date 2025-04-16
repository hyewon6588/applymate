# db/mongodb.py
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["applymate"]
user_collection = db["users"]
application_collection = db["applications"]

