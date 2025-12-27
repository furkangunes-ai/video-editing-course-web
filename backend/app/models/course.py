from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    thumbnail_url = Column(String, nullable=True)
    order = Column(Integer, default=0)
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    lessons = relationship("Lesson", back_populates="course", order_by="Lesson.order")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    video_url = Column(String, nullable=True)  # Bunny.net URL
    duration_seconds = Column(Integer, default=0)
    order = Column(Integer, default=0)
    is_free = Column(Boolean, default=False)  # Ücretsiz önizleme?
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    course = relationship("Course", back_populates="lessons")


class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    completed = Column(Boolean, default=False)
    watched_seconds = Column(Integer, default=0)
    last_watched_at = Column(DateTime(timezone=True), onupdate=func.now())
