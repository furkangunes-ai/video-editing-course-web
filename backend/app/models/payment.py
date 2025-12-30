from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float
from sqlalchemy.sql import func
from app.database import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    order_code = Column(String, unique=True, nullable=False)  # Benzersiz sipariş kodu
    product_name = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(Integer, default=0)  # 0=TRY, 1=USD, 2=EUR
    status = Column(String, default="pending")  # pending, success, failed
    shopier_payment_id = Column(String, nullable=True)
    random_nr = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    paid_at = Column(DateTime(timezone=True), nullable=True)
