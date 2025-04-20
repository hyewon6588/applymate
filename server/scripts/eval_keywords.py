import sys
import json
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))
from utils.test_dataset_loader import get_all_missing_phrases_from_dataset
from services.keyword_feedback_model import extract_missing_keywords_normalized, normalize

def load_dataset():
    path = Path("assets/sample_matches_missing.json")
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)

def normalize_phrase_set(phrases: list[str]) -> set[str]:
    """
    Normalize each phrase by applying word-level normalization using SIMILAR_TERMS
    """
    return set(
        " ".join([normalize(w) for w in phrase.lower().split()])
        for phrase in phrases
    )

def evaluate_missing_keywords_accuracy():
    data = load_dataset()
    top_n = 10
    total = len(data)
    hits = 0

    all_phrases = get_all_missing_phrases_from_dataset()
    print(f"🧪 Total known phrases: {len(all_phrases)}")
    print(all_phrases[:10])

    print("🔍 Evaluating extract_missing_keywords_normalized()...\n")
    for i, entry in enumerate(data):
        resume = entry["resume"]
        jd = entry["job_description"]
        expected_raw = entry.get("expected_keywords", [])
        expected = normalize_phrase_set(expected_raw)

        predicted_raw = extract_missing_keywords_normalized(
            resume, jd, get_all_missing_phrases_from_dataset(), top_n=top_n
        )
        predicted = normalize_phrase_set(predicted_raw)

        correct = expected & predicted
        hit = len(correct) > 0
        hits += int(hit)

        print(f"[{i+1}] Expected: {sorted(expected)}")
        print(f"     Predicted: {sorted(predicted)}")
        print(f"     ✅ Hit: {hit}\n")

    accuracy = hits / total * 100
    print(f"✅ [Eval] Coverage Accuracy: {accuracy:.1f}% (Top {top_n})")

if __name__ == "__main__":
    evaluate_missing_keywords_accuracy()
