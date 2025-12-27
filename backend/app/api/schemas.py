from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# Auth Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str]
    is_active: bool
    is_admin: bool
    has_access: bool
    created_at: datetime

    class Config:
        from_attributes = True


# Course Schemas
class LessonResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    video_url: Optional[str]
    duration_seconds: int
    order: int
    is_free: bool

    class Config:
        from_attributes = True


class CourseResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    thumbnail_url: Optional[str]
    order: int
    lessons: List[LessonResponse] = []

    class Config:
        from_attributes = True


class LessonCreate(BaseModel):
    course_id: int
    title: str
    description: Optional[str] = None
    video_url: Optional[str] = None
    duration_seconds: int = 0
    order: int = 0
    is_free: bool = False


class CourseCreate(BaseModel):
    title: str
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    order: int = 0
    is_published: bool = False


# Progress Schemas
class ProgressUpdate(BaseModel):
    lesson_id: int
    watched_seconds: int
    completed: bool = False


class ProgressResponse(BaseModel):
    lesson_id: int
    completed: bool
    watched_seconds: int

    class Config:
        from_attributes = True
