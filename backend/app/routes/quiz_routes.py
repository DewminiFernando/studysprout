import random
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc
from typing import List, Optional, cast
from datetime import datetime

from app.database import get_db
from app.dependencies.auth_dependency import get_current_user
from app.models.user import User
from app.models.material_model import Material
from app.models.question import Question
from app.models.quiz_attempt import QuizAttempt
from app.models.quiz_answer import QuizAnswer

from app.services.answer_check_service import check_answer
from app.services.weak_topic_service import calculate_weak_topics
from app.services.plant_service import update_plant_progress

from app.schemas.quiz_schema import (
    QuizStartRequest,
    QuizStartResponse,
    QuizQuestionResponse,
    QuizSubmitRequest,
    QuizSubmitResponse,
    QuizAnswerResult,
    WeakTopicResponse,
    QuizHistoryItem
)

router = APIRouter(
    prefix="/quiz",
    tags=["Quiz"]
)

@router.post("/start", response_model=QuizStartResponse)
def start_quiz(
    request: QuizStartRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Start a quiz for a specific material: verifies material ownership, retrieves its 
    questions, samples them randomly up to the requested limit, and returns them 
    without disclosing correct answers or explanations.
    """
    # Verify material belongs to current user
    material = (
        db.query(Material)
        .filter(Material.id == request.material_id, Material.owner_id == current_user.id)
        .first()
    )
    if not material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material not found or you do not have permission to access it."
        )

    # Retrieve all questions generated for this material
    questions = (
        db.query(Question)
        .filter(Question.material_id == request.material_id)
        .all()
    )
    if not questions:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No questions generated yet for this material. Please generate some first."
        )

    # Randomly select questions up to the requested limit
    limit = min(request.limit, len(questions))
    selected_questions = random.sample(questions, limit)

    # Format questions response, stripping solution data
    quiz_questions = [
        QuizQuestionResponse(
            id=cast(int, q.id),
            question_text=cast(str, q.question_text),
            question_type=cast(Optional[str], q.question_type),
            topic=cast(Optional[str], q.topic),
            difficulty=cast(Optional[str], q.difficulty)
        )
        for q in selected_questions
    ]

    return QuizStartResponse(
        material_id=request.material_id,
        total_questions=len(quiz_questions),
        questions=quiz_questions
    )

@router.post("/submit", response_model=QuizSubmitResponse)
def submit_quiz(
    request: QuizSubmitRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Submits student written answers, evaluates them semantically using SentenceTransformers,
    scores each answer, computes overall performance metrics, logs details in the database,
    identifies weak topics, and returns the full graded results.
    """
    # Verify material belongs to user
    material = (
        db.query(Material)
        .filter(Material.id == request.material_id, Material.owner_id == current_user.id)
        .first()
    )
    if not material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material not found or you do not have permission to access it."
        )

    total_questions = len(request.answers)
    if total_questions == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot submit an empty quiz."
        )

    earned_points = 0.0
    correct_count = 0
    partial_count = 0
    needs_revision_count = 0
    results_list = []
    quiz_answer_models = []

    # Verify and evaluate each answer
    for ans_input in request.answers:
        # Fetch question
        question = (
            db.query(Question)
            .filter(Question.id == ans_input.question_id, Question.material_id == request.material_id)
            .first()
        )
        if not question:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Question ID {ans_input.question_id} not found for this study material."
            )

        # Check semantic similarity
        correct_answer = cast(str, question.correct_answer)
        explanation = cast(Optional[str], question.explanation)

        answer_for_checking = correct_answer

        if explanation:
            answer_for_checking = f"{correct_answer}. {explanation}"

        check_res = check_answer(ans_input.student_answer, answer_for_checking)

        sim_score = cast(float, check_res["similarity_score"])
        res_label = cast(str, check_res["result"])
        pts = cast(float, check_res["points"])

        earned_points += pts
        if res_label == "Correct":
            correct_count += 1
        elif res_label == "Partially Correct":
            partial_count += 1
        else:
            needs_revision_count += 1

        # Populate schema representation for response
        results_list.append(
            QuizAnswerResult(
                question_id=cast(int, question.id),
                question_text=cast(str, question.question_text),
                topic=cast(Optional[str], question.topic),
                difficulty=cast(Optional[str], question.difficulty),
                student_answer=ans_input.student_answer,
                correct_answer=correct_answer, # Maps expected_answer
                explanation=explanation,       # Maps feedback
                similarity_score=sim_score,
                result=res_label,
                points=pts
            )
        )

        # Create database QuizAnswer model (linking to attempt happens below)
        db_answer = QuizAnswer(
            question_id=cast(int, question.id),
            student_answer=ans_input.student_answer,
            expected_answer=correct_answer,
            similarity_score=sim_score,
            result=res_label,
            feedback=explanation,
            points=pts
        )
        quiz_answer_models.append(db_answer)

    # Score calculation as percentage
    score_percentage = round((earned_points / total_questions) * 100.0, 2)

    # Create database QuizAttempt model
    db_attempt = QuizAttempt(
        user_id=cast(int, current_user.id),
        material_id=request.material_id,
        total_questions=total_questions,
        correct_count=correct_count,
        partial_count=partial_count,
        revision_count=needs_revision_count,
        score=score_percentage
    )
    db.add(db_attempt)
    db.flush()  # Generate db_attempt.id

    # Attach all answers to this attempt
    attempt_id = cast(int, db_attempt.id)
    for db_ans in quiz_answer_models:
        setattr(db_ans, "quiz_attempt_id", attempt_id)
        db.add(db_ans)

    db.commit()
    db.refresh(db_attempt)

    # Award plant progress XP
    try:
        user_id = cast(int, current_user.id)
        # Complete quiz action (+20 XP)
        update_plant_progress(db, user_id, "complete_quiz")
        # High score action (+25 XP, only if score >= 70)
        if score_percentage >= 70.0:
            update_plant_progress(db, user_id, "high_score")
    except Exception as e:
        print(f"Failed to update plant progress during quiz submission: {e}")

    # Analyze weak topics from this specific attempt's results
    weak_topics_data = calculate_weak_topics(results_list)
    weak_topics_list = [
        WeakTopicResponse(
            topic=wt["topic"],
            weak_answers=wt["weak_answers"],
            total_questions=wt["total_questions"],
            average_similarity=wt["average_similarity"],
            weakness_rate=wt["weakness_rate"]
        )
        for wt in weak_topics_data
    ]

    return QuizSubmitResponse(
        attempt_id=cast(int, db_attempt.id),
        material_id=request.material_id,
        score=score_percentage,
        total_questions=total_questions,
        earned_points=earned_points,
        correct_count=correct_count,
        partial_count=partial_count,
        needs_revision_count=needs_revision_count,
        results=results_list,
        weak_topics=weak_topics_list
    )

@router.get("/history", response_model=List[QuizHistoryItem])
def get_quiz_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Returns a list of all quiz attempts taken by the logged-in user, ordered newest first.
    """
    attempts = (
        db.query(QuizAttempt)
        .filter(QuizAttempt.user_id == current_user.id)
        .order_by(desc(QuizAttempt.created_at))
        .all()
    )

    return [
        QuizHistoryItem(
            attempt_id=cast(int, a.id),
            material_id=cast(int, a.material_id),
            score=cast(float, a.score),
            total_questions=cast(int, a.total_questions),
            created_at=cast(datetime, a.created_at)
        )
        for a in attempts
    ]

@router.get("/weak-topics", response_model=List[WeakTopicResponse])
def get_weak_topics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Computes weak topics for the user by checking all their quiz answers that did not
    receive a "Correct" score. Groups answers by topic and calculates weakness rates.
    """
    # 1. Fetch user's quiz attempts
    attempts = (
        db.query(QuizAttempt)
        .filter(QuizAttempt.user_id == current_user.id)
        .all()
    )
    if not attempts:
        return []

    attempt_ids = [cast(int, a.id) for a in attempts]

    # 2. Fetch all incorrect/partially correct answers across user's attempts (with topic data)
    answers = (
        db.query(QuizAnswer)
        .options(joinedload(QuizAnswer.question))
        .filter(QuizAnswer.quiz_attempt_id.in_(attempt_ids))
        .filter(QuizAnswer.result != "Correct")
        .all()
    )

    # 3. Process grouped statistics using weak_topic_service
    weak_topics_data = calculate_weak_topics(answers)

    return [
        WeakTopicResponse(
            topic=wt["topic"],
            weak_answers=wt["weak_answers"],
            total_questions=wt["total_questions"],
            average_similarity=wt["average_similarity"],
            weakness_rate=wt["weakness_rate"]
        )
        for wt in weak_topics_data
    ]
