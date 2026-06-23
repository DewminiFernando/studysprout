from typing import List, Any

def get_topic_from_answer(answer: Any) -> str:
    """
    Extracts the topic from an answer object (dict, Pydantic model, or SQLAlchemy model).
    Defaults to "General" if topic is missing, empty, or None.
    """
    topic = None
    
    if isinstance(answer, dict):
        topic = answer.get("topic")
        if not topic and "question" in answer:
            q = answer["question"]
            if isinstance(q, dict):
                topic = q.get("topic")
            else:
                topic = getattr(q, "topic", None)
    else:
        # Check direct attribute (e.g. schema or join model with topic)
        topic = getattr(answer, "topic", None)
        # Check nested question relationship
        if not topic:
            question = getattr(answer, "question", None)
            if question:
                topic = getattr(question, "topic", None)
                
    if topic is None or str(topic).strip() == "":
        return "General"
    return str(topic).strip()

def get_similarity_score(answer: Any) -> float:
    """Extracts similarity score from answer object."""
    if isinstance(answer, dict):
        score = answer.get("similarity_score")
    else:
        score = getattr(answer, "similarity_score", None)
    return float(score) if score is not None else 0.0

def get_result_status(answer: Any) -> str:
    """Extracts result category from answer object."""
    if isinstance(answer, dict):
        res = answer.get("result")
    else:
        res = getattr(answer, "result", None)
    return str(res) if res is not None else ""

def calculate_weak_topics(answers: List[Any]) -> List[dict]:
    """
    Groups answer results by topic, identifies weak areas, calculates metrics,
    and returns list of weak topics sorted by weakness_rate descending.
    
    Weak answers are defined as:
    - "Partially Correct"
    - "Needs Revision"
    """
    if not answers:
        return []
        
    topic_groups = {}
    
    for answer in answers:
        topic = get_topic_from_answer(answer)
        similarity = get_similarity_score(answer)
        status = get_result_status(answer)
        
        is_weak = status in ("Partially Correct", "Needs Revision")
        
        if topic not in topic_groups:
            topic_groups[topic] = {
                "topic": topic,
                "weak_answers": 0,
                "total_questions": 0,
                "similarity_sum": 0.0
            }
            
        group = topic_groups[topic]
        group["total_questions"] += 1
        group["similarity_sum"] += similarity
        if is_weak:
            group["weak_answers"] += 1
            
    weak_topics = []
    for group in topic_groups.values():
        total = group["total_questions"]
        weak = group["weak_answers"]
        
        # Calculate metrics
        avg_similarity = round(group["similarity_sum"] / total, 4) if total > 0 else 0.0
        weakness_rate = round(weak / total, 4) if total > 0 else 0.0
        
        # We only consider it a weak topic if there is at least one weak answer
        if weak > 0:
            weak_topics.append({
                "topic": group["topic"],
                "weak_answers": weak,
                "total_questions": total,
                "average_similarity": avg_similarity,
                "weakness_rate": weakness_rate
            })
            
    # Sort by weakness_rate descending, then optionally by total_questions descending
    weak_topics.sort(key=lambda x: (-x["weakness_rate"], -x["total_questions"]))
    
    return weak_topics
