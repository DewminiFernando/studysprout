from sqlalchemy.orm import Session
from app.models.question import Question


def replace_questions_for_material(db: Session, material_id: int, questions_data: list):
    """
    Replaces all existing questions for a material with newly generated ones.
    This prevents duplicate questions every time the user clicks Generate Questions.

    Steps:
    1. Delete all existing questions for the material
    2. Create and save new Question objects from the generated data
    3. Commit and refresh all saved objects
    4. Return the list of saved questions
    """
    # 1. Delete old questions for this material
    db.query(Question).filter(Question.material_id == material_id).delete()

    # 2. Create new question objects
    saved_questions = []
    for q_data in questions_data:
        new_question = Question(
            material_id=material_id,
            topic=q_data.get("topic", "General"),
            question_type=q_data.get("question_type", "short-answer"),
            difficulty=q_data.get("difficulty", "medium"),
            question_text=q_data.get("question_text", ""),
            correct_answer=q_data.get("correct_answer", ""),
            explanation=q_data.get("explanation", ""),
        )
        db.add(new_question)
        saved_questions.append(new_question)

    # 3. Commit all changes
    db.commit()

    # 4. Refresh saved objects to get generated IDs
    for q in saved_questions:
        db.refresh(q)

    return saved_questions
