from typing import Any, Dict, List, TypedDict

class TopicStats(TypedDict):
    topic: str
    weak_answers: int
    total_questions: int
    similarity_sum: float

def get_topic_from_answer(answer: Any) -> str:
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
        topic = getattr(answer, "topic", None)
        if not topic:
            question = getattr(answer, "question", None)
            if question:
                topic = getattr(question, "topic", None)

    if topic is None or str(topic).strip() == "":
        return "General"

    return str(topic).strip()

def get_similarity_score(answer: Any) -> float:
    if isinstance(answer, dict):
        score = answer.get("similarity_score")
    else:
        score = getattr(answer, "similarity_score", None)

    try:
        return float(score) if score is not None else 0.0
    except (TypeError, ValueError):
        return 0.0

def get_result_status(answer: Any) -> str:
    if isinstance(answer, dict):
        result = answer.get("result")
    else:
        result = getattr(answer, "result", None)

    return str(result) if result is not None else ""

def calculate_weak_topics(answers: List[Any]) -> List[dict]:
    if not answers:
        return []

    topic_groups: Dict[str, TopicStats] = {}

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
                "similarity_sum": 0.0,
            }

        group = topic_groups[topic]
        group["total_questions"] += 1
        group["similarity_sum"] += similarity

        if is_weak:
            group["weak_answers"] += 1

    weak_topics: List[dict] = []

    for group in topic_groups.values():
        total = group["total_questions"]
        weak = group["weak_answers"]

        avg_similarity = round(group["similarity_sum"] / total, 4) if total > 0 else 0.0
        weakness_rate = round(weak / total, 4) if total > 0 else 0.0

        if weak > 0:
            weak_topics.append({
                "topic": group["topic"],
                "weak_answers": weak,
                "total_questions": total,
                "average_similarity": avg_similarity,
                "weakness_rate": weakness_rate,
            })

    weak_topics.sort(key=lambda item: (-item["weakness_rate"], -item["total_questions"]))

    return weak_topics
