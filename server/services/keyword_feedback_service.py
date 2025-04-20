from bson import ObjectId
from fastapi import HTTPException
from db.mongodb import application_collection
from utils.test_dataset_loader import load_test_dataset
from services.text_extraction import extract_text_from_url
from services.keyword_feedback_model import extract_missing_keywords_normalized
from services.keyword_feedback_eval import evaluate_keyword_feedback_accuracy
from utils.test_dataset_loader import get_all_missing_phrases_from_dataset, load_keyword_dataset

def analyze_and_store_keyword_feedback(application_id: str) -> dict:
    # Retrieve application document
    app = application_collection.find_one({"application_id": application_id})
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    # Check uploaded files
    uploaded = app.get("uploadedFiles", {})
    resume_info = uploaded.get("resume")
    jd_info = uploaded.get("job_posting")

    if not resume_info or not jd_info:
        raise HTTPException(status_code=400, detail="Resume or Job Posting missing")

    # Extract text from URLs
    resume_text = extract_text_from_url(resume_info["url"])
    jd_text = extract_text_from_url(jd_info["url"])

    if not resume_text or not jd_text:
        raise HTTPException(status_code=422, detail="Failed to extract text from uploaded files")

    # Generate missing keywords
    missing_keywords = set(extract_missing_keywords_normalized(resume_text, jd_text,get_all_missing_phrases_from_dataset(), top_n=10))

    # Format feedback sentences
    feedback = [
        f"{kw}"
        for kw in missing_keywords
    ]

    # Store in DB
    application_collection.update_one(
        {"application_id": application_id},
        {"$set": {"keywordFeedback": feedback}}
    )

    evaluate_keyword_feedback_accuracy(load_keyword_dataset())

    return {"keyword_feedback": feedback}
