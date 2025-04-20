# server/utils/test_dataset_loader.py

import json
from pathlib import Path
from typing import List

def load_test_dataset():
    path = Path("assets/sample_matches.json")
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)
    
def load_keyword_dataset():
    path = Path("assets/sample_matches_missing.json")  # ← 여기!
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)
    
def get_all_missing_phrases_from_dataset(path="assets/sample_matches_missing.json") -> List[str]:
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    phrases = set()
    for entry in data:
        phrases.update([kw.lower() for kw in entry.get("expected_keywords", [])])
    return list(phrases)