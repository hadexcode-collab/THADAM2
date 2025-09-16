import os
from typing import Optional

class Settings:
    """Application configuration settings"""
    
    # Server settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    
    # Database settings
    DATABASE_URL: Optional[str] = os.getenv("DATABASE_URL")
    
    # File upload settings
    MAX_FILE_SIZE: int = 100 * 1024 * 1024  # 100MB
    UPLOAD_DIR: str = "uploads"
    ALLOWED_EXTENSIONS: set = {
        ".txt", ".md", ".json",  # Text files
        ".jpg", ".jpeg", ".png", ".gif", ".bmp",  # Images
        ".mp4", ".avi", ".mov", ".mkv",  # Videos
        ".mp3", ".wav", ".m4a", ".ogg"  # Audio
    }
    
    # AI/ML settings
    AUTHENTICITY_THRESHOLD_VERIFIED: float = 80.0
    AUTHENTICITY_THRESHOLD_REVIEW: float = 70.0
    
    # External API settings (for production)
    WIKIPEDIA_API_URL: str = "https://en.wikipedia.org/api/rest_v1/"
    GOOGLE_VISION_API_KEY: Optional[str] = os.getenv("GOOGLE_VISION_API_KEY")
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY")
    
    # Security settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "thadam-secret-key-change-in-production")
    
    # Cultural knowledge sources
    RELIABLE_SOURCES = {
        "wikipedia": {"reliability": 0.85, "weight": 0.3},
        "gov_tn": {"reliability": 0.95, "weight": 0.25},
        "kalakshetra": {"reliability": 0.92, "weight": 0.2},
        "academic": {"reliability": 0.90, "weight": 0.25}
    }

settings = Settings()