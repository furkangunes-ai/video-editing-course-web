from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from sqlalchemy import text
from sqlalchemy.orm import Session
from typing import List
import os
import uuid
from datetime import datetime

from app.database import get_db
from app.models.user import User, CourseAccess
from app.models.course import Course, Lesson, UserProgress
from app.services.auth import get_current_active_user, get_admin_user
from app.api.schemas import (
    CourseResponse,
    CourseCreate,
    CourseUpdate,
    LessonResponse,
    LessonCreate,
    LessonUpdate,
    ProgressUpdate,
    ProgressResponse,
)

router = APIRouter(prefix="/api/courses", tags=["courses"])


def user_has_course_access(db: Session, user_id: int, course_id: int) -> bool:
    """Kullanıcının belirli bir kursa erişimi olup olmadığını kontrol et"""
    # Önce CourseAccess tablosuna bak
    access = db.query(CourseAccess).filter(
        CourseAccess.user_id == user_id,
        CourseAccess.course_id == course_id
    ).first()

    if access:
        return True

    # Geriye uyumluluk: has_access True ise ve kurs ID 1 ise erişim var
    user = db.query(User).filter(User.id == user_id).first()
    if user and user.has_access and course_id == 1:
        return True

    return False


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
    has_access = user_has_course_access(db, current_user.id, course_id)
    if not lesson.is_free and not has_access:
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


# Kullanıcının erişebildiği kursları getir
@router.get("/my-courses")
async def get_my_courses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Kullanıcının erişimi olan kursları getir"""
    # CourseAccess tablosundan erişimi olan kurs ID'lerini al
    access_records = db.query(CourseAccess).filter(
        CourseAccess.user_id == current_user.id
    ).all()

    course_ids = [a.course_id for a in access_records]

    # Geriye uyumluluk: has_access True ise kurs 1'e erişimi var
    if current_user.has_access and 1 not in course_ids:
        course_ids.append(1)

    if not course_ids:
        return []

    # Kursları getir
    courses = db.query(Course).filter(
        Course.id.in_(course_ids),
        Course.is_published == True
    ).order_by(Course.order).all()

    # Her kurs için ilerleme hesapla
    result = []
    for course in courses:
        # Toplam ders sayısı
        total_lessons = db.query(Lesson).filter(Lesson.course_id == course.id).count()

        # Tamamlanan ders sayısı
        completed_lessons = db.query(UserProgress).join(Lesson).filter(
            UserProgress.user_id == current_user.id,
            Lesson.course_id == course.id,
            UserProgress.completed == True
        ).count()

        completion_percentage = int((completed_lessons / total_lessons * 100)) if total_lessons > 0 else 0

        result.append({
            "id": course.id,
            "title": course.title,
            "description": course.description,
            "thumbnail_url": course.thumbnail_url,
            "total_lessons": total_lessons,
            "completed_lessons": completed_lessons,
            "completion_percentage": completion_percentage
        })

    return result


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


@router.post("/admin/thumbnail")
async def upload_thumbnail(
    file: UploadFile = File(...),
    course_id: int = Form(...),
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Kurs kapak resmi yükle (Admin)"""

    # Kurs var mı kontrol et
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Kurs bulunamadı")

    # Dosya türü kontrolü
    allowed_types = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Sadece JPEG, PNG, WebP veya GIF dosyaları kabul edilir")

    # Dosya boyutu kontrolü (5MB)
    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Dosya boyutu 5MB'dan küçük olmalı")

    # Upload klasörünü oluştur
    upload_dir = os.path.join(os.path.dirname(__file__), "..", "..", "static", "thumbnails")
    os.makedirs(upload_dir, exist_ok=True)

    # Benzersiz dosya adı oluştur
    file_ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    unique_filename = f"course_{course_id}_{uuid.uuid4().hex[:8]}.{file_ext}"
    file_path = os.path.join(upload_dir, unique_filename)

    # Dosyayı kaydet
    with open(file_path, "wb") as f:
        f.write(contents)

    # Thumbnail URL'ini oluştur
    thumbnail_url = f"/static/thumbnails/{unique_filename}"

    # Kurs thumbnail'ını güncelle
    course.thumbnail_url = thumbnail_url
    db.commit()

    return {
        "message": "Kapak resmi başarıyla yüklendi",
        "thumbnail_url": thumbnail_url,
        "course_id": course_id
    }


# ---------------------------------------------------------------------------
# Admin: course + lesson management (list / update / delete)
# ---------------------------------------------------------------------------

@router.get("/admin", response_model=List[CourseResponse])
async def admin_list_courses(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    """Tüm kursları getir (taslak/yayınlanmış fark etmez) — Admin"""
    return db.query(Course).order_by(Course.order).all()


@router.put("/admin/course/{course_id}", response_model=CourseResponse)
async def admin_update_course(
    course_id: int,
    payload: CourseUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    """Kurs bilgilerini güncelle (Admin)"""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Kurs bulunamadı")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(course, field, value)

    db.commit()
    db.refresh(course)
    return course


@router.delete("/admin/course/{course_id}")
async def admin_delete_course(
    course_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    """Kursu sil (Admin) — cascade ile dersler, quizler, erişim kayıtları ve
    ilerlemeler de silinir."""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Kurs bulunamadı")

    db.delete(course)
    db.commit()
    return {"success": True, "deleted_course_id": course_id}


@router.put("/admin/lesson/{lesson_id}", response_model=LessonResponse)
async def admin_update_lesson(
    lesson_id: int,
    payload: LessonUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    """Ders bilgilerini güncelle (Admin) — video_url, title, description vb."""
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Ders bulunamadı")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(lesson, field, value)

    db.commit()
    db.refresh(lesson)
    return lesson


@router.delete("/admin/lesson/{lesson_id}")
async def admin_delete_lesson(
    lesson_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    """Dersi sil (Admin) — cascade ile bağlı user_progress kayıtları da silinir."""
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Ders bulunamadı")

    db.delete(lesson)
    db.commit()
    return {"success": True, "deleted_lesson_id": lesson_id}


# ---------------------------------------------------------------------------
# Admin: one-time CASCADE migration for existing PostgreSQL constraints
# ---------------------------------------------------------------------------

# (FK adı, tablo, sütun, hedef tablo, hedef sütun)
_CASCADE_FKS = [
    ("lessons_course_id_fkey", "lessons", "course_id", "courses", "id"),
    ("user_progress_lesson_id_fkey", "user_progress", "lesson_id", "lessons", "id"),
    ("user_progress_user_id_fkey", "user_progress", "user_id", "users", "id"),
    ("quizzes_course_id_fkey", "quizzes", "course_id", "courses", "id"),
    ("quiz_questions_quiz_id_fkey", "quiz_questions", "quiz_id", "quizzes", "id"),
    ("quiz_attempts_quiz_id_fkey", "quiz_attempts", "quiz_id", "quizzes", "id"),
    ("quiz_attempts_user_id_fkey", "quiz_attempts", "user_id", "users", "id"),
    ("course_contents_course_id_fkey", "course_contents", "course_id", "courses", "id"),
    ("course_access_user_id_fkey", "course_access", "user_id", "users", "id"),
    ("course_access_course_id_fkey", "course_access", "course_id", "courses", "id"),
]


@router.post("/admin/migrate-cascade")
async def admin_migrate_cascade(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    """ON DELETE CASCADE'i mevcut PostgreSQL constraint'lerine uygula. Bir kez
    çalıştırılması yeterlidir. Çalıştırma sırasında bağlı tablonun olmaması
    veya constraint'in farklı bir adda olması durumunda o satır atlanır.
    """
    results = []
    for fk_name, table, column, target_table, target_column in _CASCADE_FKS:
        try:
            db.execute(text(f'ALTER TABLE "{table}" DROP CONSTRAINT IF EXISTS "{fk_name}"'))
            db.execute(text(
                f'ALTER TABLE "{table}" ADD CONSTRAINT "{fk_name}" '
                f'FOREIGN KEY ("{column}") REFERENCES "{target_table}"("{target_column}") '
                f'ON DELETE CASCADE'
            ))
            db.commit()
            results.append({"constraint": fk_name, "status": "ok"})
        except Exception as exc:
            db.rollback()
            results.append({"constraint": fk_name, "status": "skipped", "reason": str(exc)[:200]})

    return {"applied": results}
