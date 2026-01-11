from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import engine, Base
from app.api import auth, courses, payment, referrals, quizzes

settings = get_settings()

# Tabloları oluştur
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.app_name,
    description="VideoMaster Eğitim Platformu API",
    version="1.0.0"
)

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Production'da domain ile sınırla
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router'ları ekle
app.include_router(auth.router)
app.include_router(courses.router)
app.include_router(payment.router)
app.include_router(referrals.router)
app.include_router(quizzes.router)


@app.get("/")
async def root():
    return {"message": "VideoMaster LMS API", "status": "running"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
