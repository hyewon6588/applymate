# services/text_extraction.py
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import requests
import tempfile
from pathlib import Path
from docx import Document
from urllib.parse import urlparse
import os

def compute_tfidf_similarity(resume_text, jd_text):
    tfidf = TfidfVectorizer(stop_words="english")
    tfidf_matrix = tfidf.fit_transform([resume_text, jd_text])
    return cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]

def compute_keyword_overlap(resume_text, jd_text):
    r_tokens = set(re.findall(r"\b\w+\b", resume_text.lower()))
    jd_tokens = set(re.findall(r"\b\w+\b", jd_text.lower()))
    return len(r_tokens & jd_tokens) / len(jd_tokens) if jd_tokens else 0

def extract_text_from_url(file_url: str) -> str:
    """
    Downloads a .docx file from a URL, extracts visible text only (ignores images).
    Returns cleaned paragraph text.
    """
    try:
        # Download file
        response = requests.get(file_url)
        response.raise_for_status()

        # Save to temp file
        parsed_url = urlparse(file_url)
        file_ext = os.path.splitext(parsed_url.path)[-1] or ".docx"

        with tempfile.NamedTemporaryFile(suffix=file_ext, delete=False) as tmp_file:
            tmp_file.write(response.content)
            tmp_path = Path(tmp_file.name)

        # Parse .docx and extract text
        document = Document(tmp_path)
        paragraphs = [
            p.text.strip() for p in document.paragraphs if p.text.strip()
        ]

        return "\n".join(paragraphs)

    except Exception as e:
        print("❌ Failed to extract text from URL:", e)
        return ""
