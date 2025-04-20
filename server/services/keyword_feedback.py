import re
from sklearn.feature_extraction.text import TfidfVectorizer
from typing import List

# Optional: domain-specific terms you want to ignore
STOPWORD_LIKE_TERMS = {
    "experience", "background", "ideal", "candidate", "preferred", "requirements",
    "skills", "looking", "apply", "team", "work", "position", "program",
    "opportunity", "strong", "related", "engineer", "summer", "internship"
}

SIMILAR_TERMS = {
    "engineer": {"developer", "programmer"},
    "developer": {"engineer", "programmer"},
    "qa": {"quality assurance", "testing"},
    "nlp": {"natural language processing"},
    "ci/cd": {"pipelines"},
}

# Flatten all synonyms to normalize them
TERM_NORMALIZATION = {}
for base, synonyms in SIMILAR_TERMS.items():
    TERM_NORMALIZATION[base] = base
    for synonym in synonyms:
        TERM_NORMALIZATION[synonym] = base

def normalize(term: str) -> str:
    return TERM_NORMALIZATION.get(term.lower(), term.lower())

def tokenize(text: str) -> Set[str]:
    return set(re.findall(r"\b\w[\w\-]+\b", text.lower()))

def extract_missing_keywords_normalized(resume_text: str, jd_text: str, top_n: int = 10) -> List[str]:
    """
    Extracts missing keywords using normalized similarity terms and TF-IDF.
    """
    resume_tokens = {normalize(token) for token in tokenize(resume_text)}
    jd_tokens = tokenize(jd_text)

    tfidf = TfidfVectorizer(stop_words="english", ngram_range=(1, 3))
    tfidf_matrix = tfidf.fit_transform([jd_text])
    feature_names = tfidf.get_feature_names_out()
    scores = tfidf_matrix.toarray()[0]

    keyword_scores = list(zip(feature_names, scores))
    keyword_scores.sort(key=lambda x: x[1], reverse=True)

    # Only keep if none of the normalized words in the phrase appear in resume
    missing_keywords = []
    for phrase, _ in keyword_scores:
        phrase_tokens = phrase.lower().split()
        normalized_tokens = {normalize(t) for t in phrase_tokens}
        if not normalized_tokens & resume_tokens:
            missing_keywords.append(phrase)

        if len(missing_keywords) >= top_n:
            break

    return missing_keywords

def evaluate_keyword_feedback_accuracy(data: List[dict], top_n: int = 30):
    hits = 0
    total_recall = 0
    total_precision = 0

    for i, entry in enumerate(data):
        resume = entry["resume"]
        jd = entry["job_description"]
        expected = set([kw.lower() for kw in entry.get("missing_keywords", [])])

        predicted_phrases = set(extract_missing_keywords_normalized(resume, jd, top_n))
        predicted_tokens = set()
        for phrase in predicted_phrases:
            predicted_tokens.update(phrase.lower().split())

        hit = expected.issubset(predicted_tokens)
        recall = len(expected & predicted_tokens) / len(expected) if expected else 1.0
        precision = len(expected & predicted_tokens) / min(len(predicted_tokens), top_n) if predicted_tokens else 0

        print(f"\n[{i+1}] Expected: {list(expected)}")
        print(f"    Predicted: {list(predicted_tokens)}")
        print(f"✅ Hit: {hit}")

        if hit:
            hits += 1
        total_recall += recall
        total_precision += precision

    total = len(data)
    hit_rate = hits / total
    avg_recall = total_recall / total
    avg_precision = total_precision / total

    print(f"\n✅ [Eval] Exact Match Hit Rate: {hit_rate * 100:.1f}%")
    print(f"✅ [Eval] Average Recall: {avg_recall * 100:.1f}% (Top {top_n})")
    print(f"✅ [Eval] Top-N Accuracy: {avg_precision * 100:.1f}%\n")

    