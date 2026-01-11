from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class Quiz(Base):
    """Quiz/Sınav tablosu"""
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    passing_score = Column(Integer, default=70)  # %70 geçme notu
    order = Column(Integer, default=0)  # Sıralama için
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # İlişkiler
    questions = relationship("QuizQuestion", back_populates="quiz", order_by="QuizQuestion.order")
    course = relationship("Course", backref="quizzes")


class QuizQuestion(Base):
    """Quiz soruları tablosu"""
    __tablename__ = "quiz_questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False)
    question_text = Column(Text, nullable=False)
    option_a = Column(String(500), nullable=False)
    option_b = Column(String(500), nullable=False)
    option_c = Column(String(500), nullable=False)
    option_d = Column(String(500), nullable=False)
    correct_answer = Column(String(1), nullable=False)  # A, B, C, D
    explanation = Column(Text, nullable=True)  # Doğru cevap açıklaması
    order = Column(Integer, default=0)

    # İlişkiler
    quiz = relationship("Quiz", back_populates="questions")


class QuizAttempt(Base):
    """Kullanıcı quiz denemeleri tablosu"""
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False)
    score = Column(Integer, nullable=False)  # Yüzde puan
    passed = Column(Boolean, default=False)
    answers = Column(JSON, nullable=True)  # {question_id: selected_answer}
    completed_at = Column(DateTime(timezone=True), server_default=func.now())

    # İlişkiler
    user = relationship("User", backref="quiz_attempts")
    quiz = relationship("Quiz", backref="attempts")


class CourseContent(Base):
    """Unified content ordering (lessons + quizzes)"""
    __tablename__ = "course_contents"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    content_type = Column(String(20), nullable=False)  # 'lesson' veya 'quiz'
    content_id = Column(Integer, nullable=False)  # lesson.id veya quiz.id
    order = Column(Integer, default=0)

    # İlişkiler
    course = relationship("Course", backref="contents")
