from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class Referral(Base):
    """Referans takip tablosu"""
    __tablename__ = "referrals"

    id = Column(Integer, primary_key=True, index=True)
    referrer_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Davet eden
    referred_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Davet edilen
    status = Column(String(20), default="pending")  # pending, active, paid
    referrer_reward = Column(Float, default=50)  # Referans veren kazancı
    referred_discount = Column(Float, default=30)  # Referans alan indirimi
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    activated_at = Column(DateTime(timezone=True), nullable=True)

    # İlişkiler
    referrer = relationship("User", foreign_keys=[referrer_id])
    referred = relationship("User", foreign_keys=[referred_id])


class ReferralSettings(Base):
    """Admin tarafından ayarlanabilir referans sistemi ayarları"""
    __tablename__ = "referral_settings"

    id = Column(Integer, primary_key=True, index=True)
    referrer_reward = Column(Float, default=50)  # Referans veren alacağı TL
    referred_discount = Column(Float, default=30)  # Referans alan indirim TL
    is_active = Column(Boolean, default=True)  # Sistem aktif mi?
    min_purchase_amount = Column(Float, default=0)  # Min. satın alma tutarı
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)


class DiscountCode(Base):
    """Admin tarafından oluşturulan indirim kodları"""
    __tablename__ = "discount_codes"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(20), unique=True, index=True, nullable=False)
    discount_type = Column(String(10), default="fixed")  # fixed, percent
    discount_amount = Column(Float, default=0)  # Sabit indirim TL
    discount_percent = Column(Float, default=0)  # Yüzde indirim
    max_uses = Column(Integer, nullable=True)  # Maks kullanım (null = sınırsız)
    current_uses = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    expires_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
