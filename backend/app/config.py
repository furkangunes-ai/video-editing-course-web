from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Database
    database_url: str = ""

    # JWT
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # App
    app_name: str = "VideoMaster LMS"
    debug: bool = False

    # Shopier Payment
    shopier_api_key: str = "718bff1539173ceec3cfd8def2f1f18f"
    shopier_secret: str = "ec033b3905b8cb92b4387720ecbadee2"
    shopier_payment_url: str = "https://www.shopier.com/ShowProduct/api_pay4.php"
    frontend_url: str = "https://videomaster.up.railway.app"

    class Config:
        env_file = None


@lru_cache
def get_settings():
    return Settings()
