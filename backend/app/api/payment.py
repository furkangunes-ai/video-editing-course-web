from fastapi import APIRouter, Depends, HTTPException, Request, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
import hashlib
import hmac
import base64
import random
import time
from typing import Optional

from app.database import get_db
from app.models.user import User, CourseAccess
from app.models.payment import Order
from app.services.auth import get_current_active_user
from app.config import get_settings

router = APIRouter(prefix="/api/payment", tags=["payment"])
settings = get_settings()

# Ürün bilgileri
PRODUCTS = {
    "ustalık-sinifi": {
        "name": "Video Editörlüğü Ustalık Sınıfı",
        "price": 199.00,
        "original_price": 1199.00,
        "course_ids": [1],  # Ana kurs
        "type": 1  # Dijital ürün
    },
    "canli-egitim": {
        "name": "Canlı Video Editörlük Eğitimi",
        "price": 899.00,
        "original_price": 1199.00,
        "course_ids": [1, 2],  # Bundle: Ana kurs + Canlı eğitim kursu
        "type": 1  # Dijital ürün
    }
}


def grant_course_access(db: Session, user_id: int, course_ids: list, granted_by: str = "purchase"):
    """Kullanıcıya kurs erişimi ver"""
    for course_id in course_ids:
        # Zaten erişimi var mı kontrol et
        existing = db.query(CourseAccess).filter(
            CourseAccess.user_id == user_id,
            CourseAccess.course_id == course_id
        ).first()

        if not existing:
            access = CourseAccess(
                user_id=user_id,
                course_id=course_id,
                granted_by=granted_by
            )
            db.add(access)


def generate_signature(data: str, secret: str) -> str:
    """Shopier için HMAC-SHA256 imza oluştur"""
    signature = hmac.new(
        secret.encode('utf-8'),
        data.encode('utf-8'),
        hashlib.sha256
    ).digest()
    return base64.b64encode(signature).decode('utf-8')


def generate_order_code(user_id: int) -> str:
    """Benzersiz sipariş kodu oluştur"""
    timestamp = int(time.time())
    return f"VM-{user_id}-{timestamp}"


@router.post("/create-order")
async def create_order(
    product_id: str = "ustalık-sinifi",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Ödeme için sipariş oluştur ve Shopier form verilerini döndür"""

    # Kullanıcı zaten erişime sahip mi kontrol et
    if current_user.has_access:
        raise HTTPException(status_code=400, detail="Zaten kursa erişiminiz var")

    # Ürün bilgisi
    product = PRODUCTS.get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")

    # Sipariş kodu ve random number oluştur
    order_code = generate_order_code(current_user.id)
    random_nr = str(random.randint(100000, 999999))

    # Siparişi veritabanına kaydet
    order = Order(
        user_id=current_user.id,
        order_code=order_code,
        product_name=product["name"],
        amount=product["price"],
        currency=0,  # TRY
        status="pending",
        random_nr=random_nr
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    # İmza oluştur: random_nr + order_code + amount + currency
    signature_data = f"{random_nr}{order_code}{product['price']:.2f}0"
    signature = generate_signature(signature_data, settings.shopier_secret)

    # Shopier form verileri
    form_data = {
        "API_key": settings.shopier_api_key,
        "website_index": "1",
        "platform_order_id": order_code,
        "product_name": product["name"],
        "product_type": product["type"],
        "buyer_name": current_user.full_name.split()[0] if current_user.full_name else "Müşteri",
        "buyer_surname": current_user.full_name.split()[-1] if current_user.full_name and len(current_user.full_name.split()) > 1 else "",
        "buyer_email": current_user.email,
        "buyer_account_age": 0,
        "buyer_id_nr": str(current_user.id),
        "buyer_phone": "",
        "billing_address": "Türkiye",
        "billing_city": "İstanbul",
        "billing_country": "TR",
        "billing_postcode": "34000",
        "shipping_address": "Dijital Ürün",
        "shipping_city": "İstanbul",
        "shipping_country": "TR",
        "shipping_postcode": "34000",
        "total_order_value": f"{product['price']:.2f}",
        "currency": 0,
        "platform": 0,
        "is_in_frame": 0,
        "current_language": 0,
        "modul_version": "1.0.0",
        "random_nr": random_nr,
        "signature": signature
    }

    return {
        "order_id": order.id,
        "order_code": order_code,
        "payment_url": settings.shopier_payment_url,
        "form_data": form_data
    }


@router.post("/callback")
async def payment_callback(
    request: Request,
    db: Session = Depends(get_db)
):
    """Shopier'dan gelen ödeme sonucu callback"""

    # Form verilerini al
    form = await request.form()

    platform_order_id = form.get("platform_order_id", "")
    status = form.get("status", "")
    payment_id = form.get("payment_id", "")
    installment = form.get("installment", "")
    random_nr = form.get("random_nr", "")
    received_signature = form.get("signature", "")

    # Siparişi bul
    order = db.query(Order).filter(Order.order_code == platform_order_id).first()
    if not order:
        return RedirectResponse(
            url=f"{settings.frontend_url}/odeme-hatasi?error=order_not_found",
            status_code=302
        )

    # İmza doğrula
    signature_data = f"{random_nr}{platform_order_id}"
    expected_signature = generate_signature(signature_data, settings.shopier_secret)

    # Base64 decode edip karşılaştır
    try:
        received_decoded = base64.b64decode(received_signature)
        expected_decoded = base64.b64decode(expected_signature)
        signature_valid = received_decoded == expected_decoded
    except:
        signature_valid = received_signature == expected_signature

    if not signature_valid:
        order.status = "failed"
        db.commit()
        return RedirectResponse(
            url=f"{settings.frontend_url}/odeme-hatasi?error=invalid_signature",
            status_code=302
        )

    # Ödeme durumunu kontrol et
    if status.lower() == "success":
        # Siparişi güncelle
        order.status = "success"
        order.shopier_payment_id = payment_id
        order.paid_at = func.now()

        # Kullanıcıya erişim ver
        user = db.query(User).filter(User.id == order.user_id).first()
        if user:
            user.has_access = True

            # Ürüne göre kurs erişimi ver
            product = None
            for prod_id, prod_info in PRODUCTS.items():
                if prod_info["name"] == order.product_name:
                    product = prod_info
                    break

            if product and "course_ids" in product:
                grant_course_access(db, user.id, product["course_ids"], "purchase")

        db.commit()

        return RedirectResponse(
            url=f"{settings.frontend_url}/odeme-basarili?order={platform_order_id}",
            status_code=302
        )
    else:
        order.status = "failed"
        db.commit()

        error_message = form.get("error_message", "Ödeme başarısız")
        return RedirectResponse(
            url=f"{settings.frontend_url}/odeme-hatasi?error={error_message}",
            status_code=302
        )


@router.get("/order/{order_code}")
async def get_order_status(
    order_code: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Sipariş durumunu kontrol et"""

    order = db.query(Order).filter(
        Order.order_code == order_code,
        Order.user_id == current_user.id
    ).first()

    if not order:
        raise HTTPException(status_code=404, detail="Sipariş bulunamadı")

    return {
        "order_code": order.order_code,
        "product_name": order.product_name,
        "amount": order.amount,
        "status": order.status,
        "created_at": order.created_at,
        "paid_at": order.paid_at
    }


@router.get("/my-orders")
async def get_my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Kullanıcının tüm siparişlerini getir"""

    orders = db.query(Order).filter(
        Order.user_id == current_user.id
    ).order_by(Order.created_at.desc()).all()

    return [
        {
            "order_code": o.order_code,
            "product_name": o.product_name,
            "amount": o.amount,
            "status": o.status,
            "created_at": o.created_at,
            "paid_at": o.paid_at
        }
        for o in orders
    ]


from pydantic import BaseModel, EmailStr

class GuestOrderRequest(BaseModel):
    buyer_name: str
    buyer_surname: str
    buyer_email: EmailStr
    product_id: str = "ustalık-sinifi"
    verification_code: Optional[str] = None
    discount_code: Optional[str] = None
    discount_type: Optional[str] = None
    discount_amount: Optional[float] = None


def generate_guest_order_code() -> str:
    """Misafir kullanıcı için benzersiz sipariş kodu oluştur"""
    timestamp = int(time.time())
    random_suffix = random.randint(1000, 9999)
    return f"VM-G-{timestamp}-{random_suffix}"


@router.post("/create-guest-order")
async def create_guest_order(
    request: GuestOrderRequest,
    db: Session = Depends(get_db)
):
    """Misafir kullanıcı için ödeme siparişi oluştur (hesap zorunluluğu yok)"""

    # Ürün bilgisi
    product = PRODUCTS.get(request.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")

    # Kullanıcı zaten var mı kontrol et
    existing_user = db.query(User).filter(User.email == request.buyer_email).first()

    if existing_user:
        # Kullanıcı zaten kursa erişime sahip mi?
        if existing_user.has_access:
            raise HTTPException(
                status_code=400,
                detail="Bu email adresi ile zaten kursa erişiminiz var. Giriş yaparak dashboard'a erişebilirsiniz."
            )
        user_id = existing_user.id
    else:
        # Yeni kullanıcı oluştur (şifresiz - sonra email ile şifre oluşturabilir)
        import secrets
        temp_password = secrets.token_urlsafe(32)  # Rastgele güvenli şifre
        from app.services.auth import get_password_hash

        new_user = User(
            email=request.buyer_email,
            full_name=f"{request.buyer_name} {request.buyer_surname}",
            hashed_password=get_password_hash(temp_password),
            is_active=True,
            has_access=False
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        user_id = new_user.id

    # Sipariş kodu ve random number oluştur
    order_code = generate_guest_order_code()
    random_nr = str(random.randint(100000, 999999))

    # İndirim uygula
    final_price = product["price"]
    if request.discount_amount and request.discount_amount > 0:
        final_price = max(0, product["price"] - request.discount_amount)

    # Siparişi veritabanına kaydet
    order = Order(
        user_id=user_id,
        order_code=order_code,
        product_name=product["name"],
        amount=final_price,
        currency=0,  # TRY
        status="pending",
        random_nr=random_nr
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    # İmza oluştur: random_nr + order_code + amount + currency
    signature_data = f"{random_nr}{order_code}{final_price:.2f}0"
    signature = generate_signature(signature_data, settings.shopier_secret)

    # Shopier form verileri
    form_data = {
        "API_key": settings.shopier_api_key,
        "website_index": "1",
        "platform_order_id": order_code,
        "product_name": product["name"],
        "product_type": product["type"],
        "buyer_name": request.buyer_name,
        "buyer_surname": request.buyer_surname,
        "buyer_email": request.buyer_email,
        "buyer_account_age": 0,
        "buyer_id_nr": str(user_id),
        "buyer_phone": "",
        "billing_address": "Türkiye",
        "billing_city": "İstanbul",
        "billing_country": "TR",
        "billing_postcode": "34000",
        "shipping_address": "Dijital Ürün",
        "shipping_city": "İstanbul",
        "shipping_country": "TR",
        "shipping_postcode": "34000",
        "total_order_value": f"{final_price:.2f}",
        "currency": 0,
        "platform": 0,
        "is_in_frame": 0,
        "current_language": 0,
        "modul_version": "1.0.0",
        "random_nr": random_nr,
        "signature": signature
    }

    return {
        "order_id": order.id,
        "order_code": order_code,
        "payment_url": settings.shopier_payment_url,
        "form_data": form_data,
        "product_name": product["name"],
        "final_price": final_price
    }


@router.get("/products")
async def get_products():
    """Mevcut ürünleri getir"""
    return {
        product_id: {
            "id": product_id,
            "name": info["name"],
            "price": info["price"],
            "original_price": info["original_price"],
            "course_ids": info.get("course_ids", [])
        }
        for product_id, info in PRODUCTS.items()
    }


@router.get("/products/{product_id}")
async def get_product(product_id: str):
    """Tek bir ürün bilgisini getir"""
    product = PRODUCTS.get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")

    return {
        "id": product_id,
        "name": product["name"],
        "price": product["price"],
        "original_price": product["original_price"],
        "course_ids": product.get("course_ids", [])
    }
