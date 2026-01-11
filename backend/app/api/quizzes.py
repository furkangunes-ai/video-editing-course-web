from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from app.database import get_db
from app.models.user import User
from app.models.course import Course, Lesson
from app.models.quiz import Quiz, QuizQuestion, QuizAttempt, CourseContent
from app.services.auth import get_current_active_user, get_admin_user

router = APIRouter(prefix="/api/quizzes", tags=["quizzes"])


# ==================== SCHEMAS ====================

class QuestionCreate(BaseModel):
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_answer: str
    explanation: Optional[str] = None
    order: int = 0


class QuestionResponse(BaseModel):
    id: int
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_answer: Optional[str] = None  # Admin için göster, user için gizle
    explanation: Optional[str] = None
    order: int

    class Config:
        from_attributes = True


class QuizCreate(BaseModel):
    course_id: int
    title: str
    description: Optional[str] = None
    passing_score: int = 70
    order: int = 0
    is_published: bool = False


class QuizResponse(BaseModel):
    id: int
    course_id: int
    title: str
    description: Optional[str]
    passing_score: int
    order: int
    is_published: bool
    questions: List[QuestionResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True


class QuizSubmitRequest(BaseModel):
    answers: dict  # {question_id: "A"|"B"|"C"|"D"}


class QuizResultResponse(BaseModel):
    score: int
    passed: bool
    total_questions: int
    correct_answers: int
    results: List[dict]  # Her soru için detay


class AttemptResponse(BaseModel):
    id: int
    quiz_id: int
    quiz_title: str
    score: int
    passed: bool
    completed_at: datetime

    class Config:
        from_attributes = True


class ContentOrderItem(BaseModel):
    content_type: str
    content_id: int
    order: int


class ContentResponse(BaseModel):
    id: int
    content_type: str
    content_id: int
    order: int
    title: str

    class Config:
        from_attributes = True


# ==================== USER ENDPOINTS ====================

@router.get("/course/{course_id}", response_model=List[QuizResponse])
async def get_course_quizzes(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Kursun yayınlanmış quizlerini getir"""
    quizzes = db.query(Quiz).filter(
        Quiz.course_id == course_id,
        Quiz.is_published == True
    ).order_by(Quiz.order).all()

    # Kullanıcıya correct_answer gösterme
    result = []
    for quiz in quizzes:
        quiz_dict = {
            "id": quiz.id,
            "course_id": quiz.course_id,
            "title": quiz.title,
            "description": quiz.description,
            "passing_score": quiz.passing_score,
            "order": quiz.order,
            "is_published": quiz.is_published,
            "created_at": quiz.created_at,
            "questions": [{
                "id": q.id,
                "question_text": q.question_text,
                "option_a": q.option_a,
                "option_b": q.option_b,
                "option_c": q.option_c,
                "option_d": q.option_d,
                "order": q.order,
                "correct_answer": None,
                "explanation": None
            } for q in quiz.questions]
        }
        result.append(quiz_dict)

    return result


@router.get("/course/{course_id}/contents", response_model=List[ContentResponse])
async def get_course_contents(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Kursun sıralı içerik listesini getir (lessons + quizzes)"""
    contents = db.query(CourseContent).filter(
        CourseContent.course_id == course_id
    ).order_by(CourseContent.order).all()

    result = []
    for content in contents:
        title = ""
        if content.content_type == "lesson":
            lesson = db.query(Lesson).filter(Lesson.id == content.content_id).first()
            title = lesson.title if lesson else "Ders"
        else:
            quiz = db.query(Quiz).filter(Quiz.id == content.content_id).first()
            title = quiz.title if quiz else "Quiz"

        result.append({
            "id": content.id,
            "content_type": content.content_type,
            "content_id": content.content_id,
            "order": content.order,
            "title": title
        })

    return result


@router.get("/{quiz_id}", response_model=QuizResponse)
async def get_quiz(
    quiz_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Quiz detayını getir"""
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz bulunamadı")

    # Cevapları gizle
    return {
        "id": quiz.id,
        "course_id": quiz.course_id,
        "title": quiz.title,
        "description": quiz.description,
        "passing_score": quiz.passing_score,
        "order": quiz.order,
        "is_published": quiz.is_published,
        "created_at": quiz.created_at,
        "questions": [{
            "id": q.id,
            "question_text": q.question_text,
            "option_a": q.option_a,
            "option_b": q.option_b,
            "option_c": q.option_c,
            "option_d": q.option_d,
            "order": q.order,
            "correct_answer": None,
            "explanation": None
        } for q in quiz.questions]
    }


@router.post("/{quiz_id}/submit", response_model=QuizResultResponse)
async def submit_quiz(
    quiz_id: int,
    submission: QuizSubmitRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Quiz cevaplarını gönder ve sonucu al"""
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz bulunamadı")

    questions = quiz.questions
    total = len(questions)
    correct = 0
    results = []

    for question in questions:
        q_id = str(question.id)
        user_answer = submission.answers.get(q_id, "")
        is_correct = user_answer.upper() == question.correct_answer.upper()

        if is_correct:
            correct += 1

        results.append({
            "question_id": question.id,
            "user_answer": user_answer,
            "correct_answer": question.correct_answer,
            "is_correct": is_correct,
            "explanation": question.explanation
        })

    score = int((correct / total) * 100) if total > 0 else 0
    passed = score >= quiz.passing_score

    # Denemeyi kaydet
    attempt = QuizAttempt(
        user_id=current_user.id,
        quiz_id=quiz_id,
        score=score,
        passed=passed,
        answers=submission.answers
    )
    db.add(attempt)
    db.commit()

    return {
        "score": score,
        "passed": passed,
        "total_questions": total,
        "correct_answers": correct,
        "results": results
    }


@router.get("/my-attempts", response_model=List[AttemptResponse])
async def get_my_attempts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Kullanıcının quiz denemelerini getir"""
    attempts = db.query(QuizAttempt).filter(
        QuizAttempt.user_id == current_user.id
    ).order_by(QuizAttempt.completed_at.desc()).all()

    result = []
    for attempt in attempts:
        quiz = db.query(Quiz).filter(Quiz.id == attempt.quiz_id).first()
        result.append({
            "id": attempt.id,
            "quiz_id": attempt.quiz_id,
            "quiz_title": quiz.title if quiz else "Quiz",
            "score": attempt.score,
            "passed": attempt.passed,
            "completed_at": attempt.completed_at
        })

    return result


# ==================== ADMIN ENDPOINTS ====================

@router.get("/admin/list")
async def admin_list_quizzes(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Tüm quizleri listele (admin)"""
    quizzes = db.query(Quiz).order_by(Quiz.course_id, Quiz.order).all()

    result = []
    for quiz in quizzes:
        course = db.query(Course).filter(Course.id == quiz.course_id).first()
        result.append({
            "id": quiz.id,
            "course_id": quiz.course_id,
            "course_title": course.title if course else "Bilinmiyor",
            "title": quiz.title,
            "description": quiz.description,
            "passing_score": quiz.passing_score,
            "order": quiz.order,
            "is_published": quiz.is_published,
            "question_count": len(quiz.questions),
            "created_at": quiz.created_at
        })

    return result


@router.get("/admin/{quiz_id}")
async def admin_get_quiz(
    quiz_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Quiz detayını getir (admin - cevaplar dahil)"""
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz bulunamadı")

    return {
        "id": quiz.id,
        "course_id": quiz.course_id,
        "title": quiz.title,
        "description": quiz.description,
        "passing_score": quiz.passing_score,
        "order": quiz.order,
        "is_published": quiz.is_published,
        "created_at": quiz.created_at,
        "questions": [{
            "id": q.id,
            "question_text": q.question_text,
            "option_a": q.option_a,
            "option_b": q.option_b,
            "option_c": q.option_c,
            "option_d": q.option_d,
            "correct_answer": q.correct_answer,
            "explanation": q.explanation,
            "order": q.order
        } for q in quiz.questions]
    }


@router.post("/admin", response_model=QuizResponse)
async def create_quiz(
    quiz_data: QuizCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Yeni quiz oluştur"""
    course = db.query(Course).filter(Course.id == quiz_data.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Kurs bulunamadı")

    quiz = Quiz(**quiz_data.model_dump())
    db.add(quiz)
    db.commit()
    db.refresh(quiz)

    return quiz


@router.put("/admin/{quiz_id}")
async def update_quiz(
    quiz_id: int,
    quiz_data: QuizCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Quiz güncelle"""
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz bulunamadı")

    quiz.title = quiz_data.title
    quiz.description = quiz_data.description
    quiz.passing_score = quiz_data.passing_score
    quiz.order = quiz_data.order
    quiz.is_published = quiz_data.is_published

    db.commit()
    db.refresh(quiz)

    return {"message": "Quiz güncellendi", "quiz": quiz}


@router.delete("/admin/{quiz_id}")
async def delete_quiz(
    quiz_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Quiz sil"""
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz bulunamadı")

    # Soruları da sil
    db.query(QuizQuestion).filter(QuizQuestion.quiz_id == quiz_id).delete()
    db.delete(quiz)
    db.commit()

    return {"message": "Quiz silindi"}


@router.post("/admin/{quiz_id}/questions")
async def add_question(
    quiz_id: int,
    question_data: QuestionCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Quize soru ekle"""
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz bulunamadı")

    question = QuizQuestion(
        quiz_id=quiz_id,
        **question_data.model_dump()
    )
    db.add(question)
    db.commit()
    db.refresh(question)

    return {"message": "Soru eklendi", "question": question}


@router.put("/admin/questions/{question_id}")
async def update_question(
    question_id: int,
    question_data: QuestionCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Soru güncelle"""
    question = db.query(QuizQuestion).filter(QuizQuestion.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Soru bulunamadı")

    question.question_text = question_data.question_text
    question.option_a = question_data.option_a
    question.option_b = question_data.option_b
    question.option_c = question_data.option_c
    question.option_d = question_data.option_d
    question.correct_answer = question_data.correct_answer
    question.explanation = question_data.explanation
    question.order = question_data.order

    db.commit()
    db.refresh(question)

    return {"message": "Soru güncellendi", "question": question}


@router.delete("/admin/questions/{question_id}")
async def delete_question(
    question_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Soru sil"""
    question = db.query(QuizQuestion).filter(QuizQuestion.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Soru bulunamadı")

    db.delete(question)
    db.commit()

    return {"message": "Soru silindi"}


# ==================== CONTENT ORDERING ====================

@router.get("/admin/contents/{course_id}")
async def admin_get_course_contents(
    course_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Kursun tüm içeriklerini sıralı getir (admin)"""
    contents = db.query(CourseContent).filter(
        CourseContent.course_id == course_id
    ).order_by(CourseContent.order).all()

    # Eğer içerik yoksa, mevcut lessons ve quizlerden oluştur
    if not contents:
        lessons = db.query(Lesson).filter(Lesson.course_id == course_id).order_by(Lesson.order).all()
        quizzes = db.query(Quiz).filter(Quiz.course_id == course_id).order_by(Quiz.order).all()

        order = 0
        for lesson in lessons:
            content = CourseContent(
                course_id=course_id,
                content_type="lesson",
                content_id=lesson.id,
                order=order
            )
            db.add(content)
            order += 1

        for quiz in quizzes:
            content = CourseContent(
                course_id=course_id,
                content_type="quiz",
                content_id=quiz.id,
                order=order
            )
            db.add(content)
            order += 1

        db.commit()
        contents = db.query(CourseContent).filter(
            CourseContent.course_id == course_id
        ).order_by(CourseContent.order).all()

    result = []
    for content in contents:
        title = ""
        if content.content_type == "lesson":
            lesson = db.query(Lesson).filter(Lesson.id == content.content_id).first()
            title = lesson.title if lesson else "Ders"
        else:
            quiz = db.query(Quiz).filter(Quiz.id == content.content_id).first()
            title = quiz.title if quiz else "Quiz"

        result.append({
            "id": content.id,
            "content_type": content.content_type,
            "content_id": content.content_id,
            "order": content.order,
            "title": title
        })

    return result


@router.post("/admin/contents/reorder")
async def reorder_contents(
    course_id: int,
    items: List[ContentOrderItem],
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """İçerik sırasını güncelle"""
    # Mevcut içerikleri sil
    db.query(CourseContent).filter(CourseContent.course_id == course_id).delete()

    # Yeni sırayla ekle
    for item in items:
        content = CourseContent(
            course_id=course_id,
            content_type=item.content_type,
            content_id=item.content_id,
            order=item.order
        )
        db.add(content)

    db.commit()

    return {"message": "Sıralama güncellendi"}
