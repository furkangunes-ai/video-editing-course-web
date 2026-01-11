from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from app.database import get_db
from app.models.user import User, generate_referral_code
from app.models.referral import Referral, ReferralSettings, DiscountCode
from app.services.auth import get_current_active_user, get_admin_user

router = APIRouter(prefix="/api/referrals", tags=["referrals"])


# Schemas
class ReferralCodeResponse(BaseModel):
    referral_code: str
    referral_link: str

    class Config:
        from_attributes = True


class ReferralStatsResponse(BaseModel):
    total_referrals: int
    active_referrals: int
    pending_referrals: int
    total_earnings: float
    available_balance: float


class ReferralResponse(BaseModel):
    id: int
    referred_email: str
    status: str
    referrer_reward: float
    created_at: datetime
    activated_at: Optional[datetime]

    class Config:
        from_attributes = True


class ValidateCodeResponse(BaseModel):
    valid: bool
    discount_amount: float
    message: str


class ReferralSettingsSchema(BaseModel):
    referrer_reward: float
    referred_discount: float
    is_active: bool
    min_purchase_amount: float

    class Config:
        from_attributes = True


class DiscountCodeCreate(BaseModel):
    code: str
    discount_type: str = "fixed"
    discount_amount: float = 0
    discount_percent: float = 0
    max_uses: Optional[int] = None
    expires_at: Optional[datetime] = None


class DiscountCodeResponse(BaseModel):
    id: int
    code: str
    discount_type: str
    discount_amount: float
    discount_percent: float
    max_uses: Optional[int]
    current_uses: int
    is_active: bool
    expires_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== USER ENDPOINTS ====================

@router.get("/my-code", response_model=ReferralCodeResponse)
async def get_my_referral_code(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Kullanıcının referans kodunu getir (yoksa oluştur)"""
    if not current_user.referral_code:
        # Benzersiz kod oluştur
        while True:
            code = generate_referral_code()
            existing = db.query(User).filter(User.referral_code == code).first()
            if not existing:
                break

        current_user.referral_code = code
        db.commit()
        db.refresh(current_user)

    return {
        "referral_code": current_user.referral_code,
        "referral_link": f"https://videomasterkurs.com/kayit?ref={current_user.referral_code}"
    }


@router.get("/my-stats", response_model=ReferralStatsResponse)
async def get_my_referral_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Kullanıcının referans istatistiklerini getir"""
    referrals = db.query(Referral).filter(Referral.referrer_id == current_user.id).all()

    total = len(referrals)
    active = len([r for r in referrals if r.status == "active"])
    pending = len([r for r in referrals if r.status == "pending"])

    return {
        "total_referrals": total,
        "active_referrals": active,
        "pending_referrals": pending,
        "total_earnings": current_user.referral_earnings or 0,
        "available_balance": current_user.referral_balance or 0
    }


@router.get("/my-referrals", response_model=List[ReferralResponse])
async def get_my_referrals(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Kullanıcının davet ettiği kişileri listele"""
    referrals = db.query(Referral).filter(
        Referral.referrer_id == current_user.id
    ).order_by(Referral.created_at.desc()).all()

    result = []
    for ref in referrals:
        referred_user = db.query(User).filter(User.id == ref.referred_id).first()
        result.append({
            "id": ref.id,
            "referred_email": referred_user.email if referred_user else "Bilinmiyor",
            "status": ref.status,
            "referrer_reward": ref.referrer_reward,
            "created_at": ref.created_at,
            "activated_at": ref.activated_at
        })

    return result


@router.get("/validate/{code}", response_model=ValidateCodeResponse)
async def validate_referral_code(
    code: str,
    db: Session = Depends(get_db)
):
    """Referans kodunu doğrula"""
    # Ayarları al
    settings = db.query(ReferralSettings).first()
    if not settings:
        # Varsayılan ayarlar
        settings = ReferralSettings(
            referrer_reward=50,
            referred_discount=30,
            is_active=True,
            min_purchase_amount=0
        )
        db.add(settings)
        db.commit()

    if not settings.is_active:
        return {
            "valid": False,
            "discount_amount": 0,
            "message": "Referans programı şu an aktif değil"
        }

    # Kodu bul
    referrer = db.query(User).filter(User.referral_code == code.upper()).first()

    if not referrer:
        return {
            "valid": False,
            "discount_amount": 0,
            "message": "Geçersiz referans kodu"
        }

    return {
        "valid": True,
        "discount_amount": settings.referred_discount,
        "message": f"Referans kodu geçerli! {settings.referred_discount} TL indirim kazandınız."
    }


# ==================== DISCOUNT CODE ENDPOINTS ====================

@router.get("/discounts/validate/{code}")
async def validate_discount_code(
    code: str,
    db: Session = Depends(get_db)
):
    """İndirim kodunu doğrula"""
    discount = db.query(DiscountCode).filter(
        DiscountCode.code == code.upper(),
        DiscountCode.is_active == True
    ).first()

    if not discount:
        raise HTTPException(status_code=404, detail="Geçersiz indirim kodu")

    # Süre kontrolü
    if discount.expires_at and discount.expires_at < datetime.utcnow():
        return {
            "valid": False,
            "discount_amount": 0,
            "message": "Bu indirim kodunun süresi dolmuş"
        }

    # Kullanım limiti kontrolü
    if discount.max_uses and discount.current_uses >= discount.max_uses:
        return {
            "valid": False,
            "discount_amount": 0,
            "message": "Bu indirim kodu kullanım limitine ulaşmış"
        }

    return {
        "valid": True,
        "discount_amount": discount.discount_amount,
        "discount_percent": discount.discount_percent,
        "discount_type": discount.discount_type,
        "message": f"İndirim kodu uygulandı!"
    }


# ==================== ADMIN ENDPOINTS ====================

@router.get("/admin/settings", response_model=ReferralSettingsSchema)
async def get_referral_settings(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Referans ayarlarını getir"""
    settings = db.query(ReferralSettings).first()
    if not settings:
        settings = ReferralSettings(
            referrer_reward=50,
            referred_discount=30,
            is_active=True,
            min_purchase_amount=0
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)

    return settings


@router.put("/admin/settings", response_model=ReferralSettingsSchema)
async def update_referral_settings(
    settings_update: ReferralSettingsSchema,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Referans ayarlarını güncelle"""
    settings = db.query(ReferralSettings).first()
    if not settings:
        settings = ReferralSettings()
        db.add(settings)

    settings.referrer_reward = settings_update.referrer_reward
    settings.referred_discount = settings_update.referred_discount
    settings.is_active = settings_update.is_active
    settings.min_purchase_amount = settings_update.min_purchase_amount
    settings.updated_by = admin.id

    db.commit()
    db.refresh(settings)
    return settings


@router.get("/admin/all")
async def get_all_referrals(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Tüm referansları listele"""
    referrals = db.query(Referral).order_by(Referral.created_at.desc()).all()

    result = []
    for ref in referrals:
        referrer = db.query(User).filter(User.id == ref.referrer_id).first()
        referred = db.query(User).filter(User.id == ref.referred_id).first()
        result.append({
            "id": ref.id,
            "referrer_email": referrer.email if referrer else "Bilinmiyor",
            "referred_email": referred.email if referred else "Bilinmiyor",
            "status": ref.status,
            "referrer_reward": ref.referrer_reward,
            "referred_discount": ref.referred_discount,
            "created_at": ref.created_at,
            "activated_at": ref.activated_at
        })

    return result


@router.get("/admin/stats")
async def get_admin_referral_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Admin için genel referans istatistikleri"""
    total = db.query(Referral).count()
    active = db.query(Referral).filter(Referral.status == "active").count()
    pending = db.query(Referral).filter(Referral.status == "pending").count()

    total_paid = db.query(func.sum(Referral.referrer_reward)).filter(
        Referral.status == "active"
    ).scalar() or 0

    return {
        "total_referrals": total,
        "active_referrals": active,
        "pending_referrals": pending,
        "total_rewards_paid": total_paid
    }


# ==================== DISCOUNT CODE ADMIN ====================

@router.get("/admin/discount-codes", response_model=List[DiscountCodeResponse])
async def get_discount_codes(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Tüm indirim kodlarını listele"""
    codes = db.query(DiscountCode).order_by(DiscountCode.created_at.desc()).all()
    return codes


@router.post("/admin/discount-codes", response_model=DiscountCodeResponse)
async def create_discount_code(
    code_data: DiscountCodeCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """Yeni indirim kodu oluştur"""
    existing = db.query(DiscountCode).filter(
        DiscountCode.code == code_data.code.upper()
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Bu kod zaten mevcut")

    discount = DiscountCode(
        code=code_data.code.upper(),
        discount_type=code_data.discount_type,
        discount_amount=code_data.discount_amount,
        discount_percent=code_data.discount_percent,
        max_uses=code_data.max_uses,
        expires_at=code_data.expires_at,
        created_by=admin.id
    )

    db.add(discount)
    db.commit()
    db.refresh(discount)
    return discount


@router.put("/admin/discount-codes/{code_id}/toggle")
async def toggle_discount_code(
    code_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """İndirim kodunu aktif/pasif yap"""
    discount = db.query(DiscountCode).filter(DiscountCode.id == code_id).first()
    if not discount:
        raise HTTPException(status_code=404, detail="İndirim kodu bulunamadı")

    discount.is_active = not discount.is_active
    db.commit()

    return {"message": "Durum güncellendi", "is_active": discount.is_active}


@router.delete("/admin/discount-codes/{code_id}")
async def delete_discount_code(
    code_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    """İndirim kodunu sil"""
    discount = db.query(DiscountCode).filter(DiscountCode.id == code_id).first()
    if not discount:
        raise HTTPException(status_code=404, detail="İndirim kodu bulunamadı")

    db.delete(discount)
    db.commit()

    return {"message": "İndirim kodu silindi"}
