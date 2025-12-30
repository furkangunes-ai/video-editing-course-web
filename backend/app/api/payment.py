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
from app.models.user import User
from app.models.payment import Order
from app.services.auth import get_current_active_user
from app.config import get_settings

router = APIRouter(prefix="/api/payment", tags=["payment"])
settings = get_settings()

# Ürün bilgileri
PRODUCTS = {
    "ustalık-sinifi": {
        "name": "Video Editörlüğü Ustalık Sınıfı",
        "price": 999.00,
        "original_price": 5000.00,
        "type": 1  # Dijital ürün
    }
}


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
