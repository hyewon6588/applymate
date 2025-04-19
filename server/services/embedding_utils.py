import re
import nltk
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer, util
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Load model once at module level
embedding_model = SentenceTransformer("sentence-transformers/all-mpnet-base-v2")
stop_words = set(stopwords.words("english"))
lemmatizer = WordNetLemmatizer()

def clean_text_advanced(text):
    tokens = re.findall(r"\b\w+\b", text.lower())
    tokens = [lemmatizer.lemmatize(w) for w in tokens if w not in stop_words and not w.isdigit()]
    return " ".join(tokens)

def compute_embedding_similarity(resume_text: str, jd_text: str):
    """
    Computes hybrid similarity score between resume and job description using:
    - Sentence embedding (cosine similarity)
    - TF-IDF similarity
    - Keyword overlap

    Returns:
        - match percentage (0~100)
        - top overlapping keywords
    """
    resume_text = clean_text_advanced(resume_text)
    jd_text = clean_text_advanced(jd_text)

    # Embedding cosine similarity
    resume_vec = embedding_model.encode(resume_text, convert_to_tensor=True)
    jd_vec = embedding_model.encode(jd_text, convert_to_tensor=True)
    cosine_score = float(util.cos_sim(resume_vec, jd_vec)[0][0])

    # TF-IDF similarity & keyword analysis
    tfidf = TfidfVectorizer(stop_words="english")
    tfidf_matrix = tfidf.fit_transform([resume_text, jd_text])
    tfidf_score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]

    feature_names = tfidf.get_feature_names_out()
    tfidf_scores = tfidf_matrix.toarray()
    keyword_scores = {
        feature_names[i]: tfidf_scores[0][i] + tfidf_scores[1][i]
        for i in range(len(feature_names))
        if tfidf_scores[0][i] > 0 and tfidf_scores[1][i] > 0
    }

    sorted_keywords = sorted(keyword_scores.items(), key=lambda x: x[1], reverse=True)
    top_keywords = [kw for kw, _ in sorted_keywords[:10]]

    # Token overlap
    r_tokens = set(re.findall(r"\b\w+\b", resume_text.lower()))
    jd_tokens = set(re.findall(r"\b\w+\b", jd_text.lower()))
    overlap_score = len(r_tokens & jd_tokens) / len(jd_tokens) if jd_tokens else 0

    # Weighted final score
    final_score = 0.7 * cosine_score + 0.2 * tfidf_score + 0.1 * overlap_score
    match_percent = round(72+final_score *28, 2)

    return match_percent, top_keywords

def compute_embedding_cosine(resume_text, jd_text):
    resume_vec = embedding_model.encode(resume_text, convert_to_tensor=True)
    jd_vec = embedding_model.encode(jd_text, convert_to_tensor=True)
    return float(util.cos_sim(resume_vec, jd_vec)[0][0])