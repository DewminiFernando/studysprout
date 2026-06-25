import numpy as np
from sentence_transformers import SentenceTransformer, util

# Global cached model variable to avoid reloading on every request
_model = None

def get_model():
    """
    Lazy load and cache the SentenceTransformer model to optimize performance.
    """
    global _model
    if _model is None:
        _model = SentenceTransformer('all-MiniLM-L6-v2')
    return _model

def check_answer(student_answer: str, correct_answer: str) -> dict:
    """
    Compares the student's answer with the correct answer using semantic similarity (all-MiniLM-L6-v2).
    
    Returns a dictionary with:
    - similarity_score: float (rounded to 4 decimals)
    - result: str ("Correct", "Partially Correct", or "Needs Revision")
    - points: float (1.0, 0.5, or 0.0)
    """
    # Handle empty or whitespace-only answers by returning 0.0 score directly
    if not student_answer or not student_answer.strip():
        return {
            "similarity_score": 0.0,
            "result": "Needs Revision",
            "points": 0.0
        }
        
    student_clean = student_answer.strip().lower()
    correct_clean = correct_answer.strip().lower()

    if student_clean == correct_clean:
        return {
            "similarity_score": 1.0,
            "result": "Correct",
            "points": 1.0
        }
        
    # Get cached model
    model = get_model()
    
    # Compute embeddings
    embeddings = model.encode([student_answer, correct_answer], convert_to_tensor=True)
    
    # Calculate Cosine Similarity
    similarity = float(util.cos_sim(embeddings[0], embeddings[1]).item())
    
    # Round similarity score to 4 decimals
    similarity_score = round(similarity, 4)
    
    # Classify answer and assign points
    if similarity_score >= 0.75:
        result = "Correct"
        points = 1.0
    elif similarity_score >= 0.50:
        result = "Partially Correct"
        points = 0.5
    else:
        result = "Needs Revision"
        points = 0.0
        
    return {
        "similarity_score": similarity_score,
        "result": result,
        "points": points
    }
