from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc
from app.models.material_model import Material
from app.models.question import Question
from app.models.quiz_attempt import QuizAttempt
from app.models.quiz_answer import QuizAnswer
from app.services.plant_service import get_or_create_plant_progress, calculate_stage_level_next_xp
from app.services.weak_topic_service import calculate_weak_topics

def get_dashboard_summary(db: Session, user_id: int) -> dict:
    """
    Aggregates user-isolated data for the Dashboard page.
    """
    # 1. Total PDFs uploaded by this user
    total_pdfs = db.query(Material).filter(Material.owner_id == user_id).count()

    # 2. Total questions generated for this user's materials
    total_questions = (
        db.query(Question)
        .join(Material)
        .filter(Material.owner_id == user_id)
        .count()
    )

    # 3. Average quiz score for this user's attempts
    attempts = (
        db.query(QuizAttempt)
        .filter(QuizAttempt.user_id == user_id)
        .all()
    )
    scores = [float(getattr(a, "score", 0.0) or 0.0) for a in attempts]
    average_quiz_score = round(sum(scores) / len(scores), 1) if scores else 0.0

    # 4. Plant progress and study streak
    plant = get_or_create_plant_progress(db, user_id)
    plant_xp = int(getattr(plant, "xp", 0) or 0)
    _, _, next_stage_xp, xp_needed = calculate_stage_level_next_xp(plant_xp)

    plant_widget = {
        "level": int(getattr(plant, "level", 1) or 1),
        "stage": str(getattr(plant, "stage", "Seed") or "Seed"),
        "xp": plant_xp,
        "next_stage_xp": next_stage_xp,
        "xp_needed": xp_needed,
        "study_streak": int(getattr(plant, "streak_days", 0) or 0)
    }

    # 5. Recent materials (top 4)
    recent_mats_db = (
        db.query(Material)
        .filter(Material.owner_id == user_id)
        .order_by(desc(Material.created_at))
        .limit(4)
        .all()
    )

    recent_materials = []
    for mat in recent_mats_db:
        # Count questions
        q_count = db.query(Question).filter(Question.material_id == mat.id).count()

        # Fetch latest quiz attempt for this specific material
        latest_attempt = (
            db.query(QuizAttempt)
            .filter(QuizAttempt.material_id == mat.id, QuizAttempt.user_id == user_id)
            .order_by(desc(QuizAttempt.created_at))
            .first()
        )

        if latest_attempt:
            latest_score = float(getattr(latest_attempt, "score", 0.0) or 0.0)
            last_score = f"{round(latest_score)}%"
            progress = 100
            status_type = "done" if latest_score >= 70.0 else "revision"
            status = "Quiz done" if latest_score >= 70.0 else "Needs revision"
        else:
            last_score = "N/A"
            progress = 0
            status_type = "revision"
            status = "Not started"

        # Format creation time nicely
        mat_created_at = getattr(mat, "created_at", None)
        if mat_created_at:
            week_str = f"Uploaded {mat_created_at.strftime('%b %d')}"
        else:
            week_str = "Uploaded Unknown"

        recent_materials.append({
            "id": int(getattr(mat, "id", 0) or 0),
            "name": str(getattr(mat, "title", "") or ""),
            "questions": q_count,
            "week": week_str,
            "progress": progress,
            "lastScore": last_score,
            "status": status,
            "statusType": status_type
        })

    # 6. Weak-topic tags for dashboard
    weak_topics_list = []
    attempt_ids = [int(getattr(a, "id", 0) or 0) for a in attempts]
    if attempt_ids:
        # Fetch all user quiz answers that are NOT Correct
        incorrect_answers = (
            db.query(QuizAnswer)
            .options(joinedload(QuizAnswer.question))
            .filter(QuizAnswer.quiz_attempt_id.in_(attempt_ids))
            .filter(QuizAnswer.result != "Correct")
            .all()
        )
        weak_topics_data = calculate_weak_topics(incorrect_answers)

        for idx, wt in enumerate(weak_topics_data):
            weak_topics_list.append({
                "id": idx + 1,
                "name": str(wt.get("topic", "")),
                "type": "weak"
            })

    # 7. Quiz history (top 5 attempts)
    recent_attempts_db = (
        db.query(QuizAttempt)
        .options(joinedload(QuizAttempt.material))
        .filter(QuizAttempt.user_id == user_id)
        .order_by(desc(QuizAttempt.created_at))
        .limit(5)
        .all()
    )

    quiz_history = []
    for att in recent_attempts_db:
        att_material = getattr(att, "material", None)
        mat_title = str(getattr(att_material, "title", "Deleted Material") or "Deleted Material") if att_material else "Deleted Material"
        att_score = float(getattr(att, "score", 0.0) or 0.0)
        quiz_history.append({
            "attempt_id": int(getattr(att, "id", 0) or 0),
            "material_name": mat_title,
            "score": att_score,
            "total_questions": int(getattr(att, "total_questions", 0) or 0),
            "created_at": getattr(att, "created_at", None)
        })

    return {
        "total_pdfs": total_pdfs,
        "total_questions": total_questions,
        "average_quiz_score": average_quiz_score,
        "study_streak": int(getattr(plant, "streak_days", 0) or 0),
        "recent_materials": recent_materials,
        "weak_topics": weak_topics_list,
        "quiz_history": quiz_history,
        "plant_progress": plant_widget
    }
