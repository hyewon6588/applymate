import requests
from bs4 import BeautifulSoup

def extract_text_from_url(url: str) -> str:
    """
    Fetches and extracts text content from a URL pointing to a .docx or .pdf file.
    For now, only extracts raw response text or HTML preview as fallback.
    """
    try:
        response = requests.get(url)
        response.raise_for_status()
        content_type = response.headers.get("Content-Type", "")

        # Fallback if actual parsing (e.g. PDF, DOCX) is not implemented
        if "text" in content_type or "html" in content_type:
            soup = BeautifulSoup(response.text, "html.parser")
            return soup.get_text()
        else:
            return response.text[:3000]  # fallback: limit to 3k chars
    except Exception as e:
        print(f"Failed to extract from {url}: {e}")
        return ""
    
# services/text_extraction.py
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def compute_tfidf_similarity(resume_text, jd_text):
    tfidf = TfidfVectorizer(stop_words="english")
    tfidf_matrix = tfidf.fit_transform([resume_text, jd_text])
    return cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]

def compute_keyword_overlap(resume_text, jd_text):
    r_tokens = set(re.findall(r"\b\w+\b", resume_text.lower()))
    jd_tokens = set(re.findall(r"\b\w+\b", jd_text.lower()))
    return len(r_tokens & jd_tokens) / len(jd_tokens) if jd_tokens else 0

