import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer, util

# Load model at module level
embedding_model = SentenceTransformer("sentence-transformers/all-mpnet-base-v2")

def clean_text(text: str) -> str:
    lines = text.split("\n")
    lines = [re.sub(r"\s+", " ", l.strip()) for l in lines if len(l.strip()) > 5]
    return " ".join(lines)

def compute_embedding_cosine(resume_text, jd_text):
    resume_vec = embedding_model.encode(resume_text, convert_to_tensor=True)
    jd_vec = embedding_model.encode(jd_text, convert_to_tensor=True)
    return float(util.cos_sim(resume_vec, jd_vec)[0][0])

def compute_tfidf_similarity(resume_text, jd_text):
    tfidf = TfidfVectorizer(stop_words="english")
    tfidf_matrix = tfidf.fit_transform([resume_text, jd_text])
    return cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]

def compute_keyword_overlap(resume_text, jd_text):
    r_tokens = set(re.findall(r"\b\w+\b", resume_text.lower()))
    jd_tokens = set(re.findall(r"\b\w+\b", jd_text.lower()))
    return len(r_tokens & jd_tokens) / len(jd_tokens) if jd_tokens else 0

def compute_hybrid_score(resume_text, jd_text):
    resume = clean_text(resume_text)
    jd = clean_text(jd_text)

    cosine = compute_embedding_cosine(resume, jd)
    tfidf = compute_tfidf_similarity(resume, jd)
    overlap = compute_keyword_overlap(resume, jd)

    score = 0.6 * cosine + 0.3 * tfidf + 0.1 * overlap
    return round(score * 100, 2), {
        "cosine": round(cosine * 100, 1),
        "tfidf": round(tfidf * 100, 1),
        "overlap": round(overlap * 100, 1),
    }
