import sys
from pathlib import Path
import json
from sklearn.metrics import mean_absolute_error

# Add the project root (e.g., 'server') to PYTHONPATH
sys.path.append(str(Path(__file__).resolve().parents[1]))

# Import the hybrid scoring function
from services.embedding_utils import compute_embedding_similarity

# Load the evaluation dataset
def load_test_dataset():
    path = Path("assets/sample_matches.json")
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)

# Evaluate the accuracy of the match scoring model
def evaluate():
    dataset = load_test_dataset()
    expected_scores = []
    predicted_scores = []

    print("Evaluating compute_embedding_similarity()...\n")
    for i, entry in enumerate(dataset):
        resume = entry["resume"]
        jd = entry["job_description"]
        expected = entry["match_score"]

        raw_score, keywords = compute_embedding_similarity(resume, jd)
        predicted = round(60 + (raw_score / 100) * 40, 2)  # rescaled score

        print(f"[{i+1}] Expected: {expected:.1f}, Predicted: {predicted:.1f} → Keywords: {keywords[:5]}")
        expected_scores.append(expected)
        predicted_scores.append(predicted)

    mae = mean_absolute_error(expected_scores, predicted_scores)

    # relative tolerance accuracy
    tolerance = 0.15
    within_tolerance = sum(
        abs(e - p) <= tolerance * e for e, p in zip(expected_scores, predicted_scores)
    ) / len(expected_scores)

    print(f"\n✅ Mean Absolute Error (MAE): {mae:.2f}")
    print(f"✅ Accuracy within ±15%: {within_tolerance * 100:.1f}%")

if __name__ == "__main__":
    evaluate()
