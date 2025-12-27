from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.user import User
from app.models.course import Course, Lesson, UserProgress
from app.services.auth import get_current_active_user, get_admin_user
from app.api.schemas import (
    CourseResponse,
    CourseCreate,
    LessonResponse,
    LessonCreate,
    ProgressUpdate,
    ProgressResponse,
)

router = APIRouter(prefix="/api/courses", tags=["courses"])


@router.get("/", response_model=List[CourseResponse])
async def get_courses(db: Session = Depends(get_db)):
    """Tüm yayınlanmış kursları getir"""
    courses = db.query(Course).filter(Course.is_published == True).order_by(Course.order).all()
    return courses


@router.get("/{course_id}", response_model=CourseResponse)
async def get_course(course_id: int, db: Session = Depends(get_db)):
    """Tek bir kursu getir"""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Kurs bulunamadı")
    return course


@router.get("/{course_id}/lessons/{lesson_id}", response_model=LessonResponse)
async def get_lesson(
    course_id: int,
    lesson_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Ders detayını getir (video URL dahil)"""
    lesson = db.query(Lesson).filter(
        Lesson.id == lesson_id,
        Lesson.course_id == course_id
    ).first()

    if not lesson:
        raise HTTPException(status_code=404, detail="Ders bulunamadı")

    # Ücretsiz ders veya erişimi var mı kontrol et
    if not lesson.is_free and not current_user.has_access:
        raise HTTPException(
            status_code=403,
            detail="Bu derse erişmek için kurs satın almalısınız"
        )

    return lesson


# Progress endpoints
@router.post("/progress", response_model=ProgressResponse)
async def update_progress(
    progress: ProgressUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Kullanıcının ders ilerlemesini güncelle"""
    # Mevcut ilerleme var mı kontrol et
    existing = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id,
        UserProgress.lesson_id == progress.lesson_id
    ).first()

    if existing:
        existing.watched_seconds = progress.watched_seconds
        existing.completed = progress.completed
    else:
        existing = UserProgress(
            user_id=current_user.id,
            lesson_id=progress.lesson_id,
            watched_seconds=progress.watched_seconds,
            completed=progress.completed
        )
        db.add(existing)

    db.commit()
    db.refresh(existing)
    return existing


@router.get("/progress/me", response_model=List[ProgressResponse])
async def get_my_progress(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Kullanıcının tüm ilerlemesini getir"""
    progress = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id
    ).all()
    return progress


# Admin endpoints
@router.post("/admin/course", response_model=CourseResponse)
async def create_course(
    course: CourseCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Yeni kurs oluştur (Admin)"""
    new_course = Course(**course.model_dump())
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    return new_course


@router.post("/admin/lesson", response_model=LessonResponse)
async def create_lesson(
    lesson: LessonCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Yeni ders oluştur (Admin)"""
    new_lesson = Lesson(**lesson.model_dump())
    db.add(new_lesson)
    db.commit()
    db.refresh(new_lesson)
    return new_lesson
