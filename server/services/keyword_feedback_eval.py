from typing import List, Set
from services.keyword_feedback_model import extract_missing_keywords_normalized
from utils.test_dataset_loader import get_all_missing_phrases_from_dataset

def evaluate_keyword_feedback_accuracy(data: List[dict], top_n: int = 30):
    hits = 0
    total_recall = 0
    total_precision = 0

    for i, entry in enumerate(data):
        resume = entry["resume"]
        jd = entry["job_description"]
        expected_phrases = entry.get("expected_keywords", [])

        predicted_phrases = extract_missing_keywords_normalized(
            resume, jd, get_all_missing_phrases_from_dataset(), top_n
        )

        # 🔍 Token-level comparison
        expected_tokens = set()
        for phrase in expected_phrases:
            expected_tokens.update(phrase.lower().split())

        predicted_tokens = set()
        for phrase in predicted_phrases:
            predicted_tokens.update(phrase.lower().split())

        # ✅ Hit = at least one expected token matched
        hit = bool(expected_tokens & predicted_tokens)
        hits += int(hit)

        # 📊 Metrics
        recall = len(expected_tokens & predicted_tokens) / len(expected_tokens) if expected_tokens else 1.0
        precision = len(expected_tokens & predicted_tokens) / len(predicted_tokens) if predicted_tokens else 0

        total_recall += recall
        total_precision += precision

        print(f"\n[{i+1}] Expected: {list(expected_tokens)}")
        print(f"    Predicted: {list(predicted_tokens)}")
        print(f"✅ Hit: {hit}")

    total = len(data)
    print(f"\n✅ [Eval] Exact Match Hit Rate: {hits / total * 100:.1f}%")
    print(f"✅ [Eval] Average Recall: {total_recall / total * 100:.1f}% (Top {top_n} tokens)")
    print(f"✅ [Eval] Top-N Accuracy: {total_precision / total * 100:.1f}%\n")
