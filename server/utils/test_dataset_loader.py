# server/utils/test_dataset_loader.py

import json
from pathlib import Path

def load_test_dataset():
    path = Path("assets/sample_matches.json")
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)
