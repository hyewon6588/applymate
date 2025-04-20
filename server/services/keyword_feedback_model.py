import re
from typing import List, Set
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

SIMILAR_TERMS = {
    "engineer": {"developer", "programmer"},
    "developer": {"engineer", "programmer"},
    "qa": {"quality assurance", "testing"},
    "nlp": {"natural language processing"},
    "ci/cd": {"pipelines"},
}

TERM_NORMALIZATION = {}
for base, synonyms in SIMILAR_TERMS.items():
    TERM_NORMALIZATION[base] = base
    for synonym in synonyms:
        TERM_NORMALIZATION[synonym] = base

def normalize(term: str) -> str:
    return TERM_NORMALIZATION.get(term.lower(), term.lower())

def tokenize(text: str) -> Set[str]:
    return set(re.findall(r"\b\w[\w\-]+\b", text.lower()))

def extract_missing_keywords_normalized(
    resume_text: str,
    jd_text: str,
    known_phrases: List[str],
    top_n: int = 10
) -> List[str]:
    resume_tokens = {normalize(token) for token in tokenize(resume_text)}
    jd_text = jd_text.lower()

    # Extract candidate JD phrases
    tfidf_jd = TfidfVectorizer(ngram_range=(1, 3), stop_words="english")
    try:
        tfidf_jd.fit([jd_text])
    except ValueError:
        return []  # JD text was empty

    jd_phrases = tfidf_jd.get_feature_names_out()
    if not jd_phrases.any() or not known_phrases:
        return []

    # Vectorization
    vectorizer = TfidfVectorizer()
    try:
        vectorizer.fit(known_phrases + list(jd_phrases))
    except ValueError:
        return []  # fallback if fit fails

    known_vecs = vectorizer.transform(known_phrases)
    jd_vecs = vectorizer.transform(jd_phrases)

    if jd_vecs.shape[0] == 0 or known_vecs.shape[0] == 0:
        return []

    similarities = cosine_similarity(jd_vecs, known_vecs).max(axis=1)
    phrase_scores = list(zip(jd_phrases, similarities))
    phrase_scores.sort(key=lambda x: x[1], reverse=True)

    selected = []
    total_tokens = 0
    for phrase, _ in phrase_scores:
        phrase_tokens = {normalize(t) for t in phrase.split()}
        if not phrase_tokens & resume_tokens:
            token_count = len(phrase.split())
            if total_tokens + token_count > top_n:
                break
            selected.append(phrase)
            total_tokens += token_count

    return selected
