from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey
from sqlalchemy.sql import func
from app.database import Base
import secrets
import string


def generate_referral_code():
    """8 karakterli benzersiz referans kodu oluştur"""
    chars = string.ascii_uppercase + string.digits
    return ''.join(secrets.choice(chars) for _ in range(8))


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    has_access = Column(Boolean, default=False)  # Kurs erişimi var mı?
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Referans sistemi alanları
    referral_code = Column(String(10), unique=True, index=True, nullable=True)
    referred_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    referral_earnings = Column(Float, default=0)  # Toplam kazanç
    referral_balance = Column(Float, default=0)   # Çekilebilir bakiye
