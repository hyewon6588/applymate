from bson import ObjectId
from fastapi import HTTPException
from typing import Optional
from services.embedding_utils import compute_embedding_similarity
from services.text_extraction import extract_text_from_url
from db.mongodb import application_collection  # assumes db client abstraction exists

from services.embedding_utils import compute_embedding_cosine
from services.text_extraction import compute_tfidf_similarity, compute_keyword_overlap
from services.hybrid_model import compute_hybrid_score
from utils.test_dataset_loader import load_test_dataset
from sklearn.metrics import mean_absolute_error

def evaluate_model_accuracy():
    data = load_test_dataset()
    predictions, truths = [], []

    for entry in data:
        resume = entry["resume"]
        jd = entry["job_description"]
        expected = entry["match_score"]

        predicted, _ = compute_embedding_similarity(resume, jd)
        print(f"[DEBUG] Expected: {expected:.1f}, Predicted: {predicted:.1f}")
        predictions.append(predicted)
        truths.append(expected)

    mae = mean_absolute_error(truths, predictions)
    within_10 = sum(abs(p - t) <= 10 for p, t in zip(predictions, truths)) / len(truths)

    print(f"\n✅ [Model Eval] Mean Absolute Error (MAE): {mae:.2f}")
    print(f"✅ [Model Eval] Accuracy within ±10%: {within_10 * 100:.1f}%\n")

def analyze_match_and_keywords(application_id: str) -> dict:
    app = application_collection.find_one({"application_id": application_id})
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    uploaded = app.get("uploadedFiles", {})
    resume_info = uploaded.get("resume")
    jd_info = uploaded.get("job_posting")

    if not resume_info or not jd_info:
        raise HTTPException(status_code=400, detail="Resume or Job Posting missing")

    # Step 1: Extract text
    resume_text = extract_text_from_url(resume_info["url"])
    jd_text = extract_text_from_url(jd_info["url"])

    if not resume_text or not jd_text:
        raise HTTPException(status_code=422, detail="Failed to extract text from files")

    # Step 2: Calculate match percent and keyword relevance
    match_percent, keywords = compute_hybrid_score(resume_text, jd_text)

    # Step 3: Update database
    application_collection.update_one(
        {"application_id": application_id},
        {"$set": {
            "match_score": match_percent,
            "match_keywords": keywords
        }}
    )

    evaluate_model_accuracy()

    return {
        "match_score": match_percent,
        "keywords": keywords
    }