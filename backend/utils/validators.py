import os
import magic
from typing import Tuple, Optional
from backend.config import settings

def validate_file_upload(file_path: str, file_size: int) -> Tuple[bool, Optional[str]]:
    """
    Validate uploaded file for security and format compliance
    
    Returns:
        Tuple of (is_valid, error_message)
    """
    
    # Check file size
    if file_size > settings.MAX_FILE_SIZE:
        return False, f"File size exceeds maximum limit of {settings.MAX_FILE_SIZE // (1024*1024)}MB"
    
    # Check file extension
    file_ext = os.path.splitext(file_path)[1].lower()
    if file_ext not in settings.ALLOWED_EXTENSIONS:
        return False, f"File type {file_ext} not supported"
    
    # Check MIME type for security
    try:
        mime_type = magic.from_file(file_path, mime=True)
        
        # Validate MIME type matches extension
        valid_mime_types = {
            '.txt': ['text/plain'],
            '.md': ['text/plain', 'text/markdown'],
            '.json': ['application/json', 'text/plain'],
            '.jpg': ['image/jpeg'],
            '.jpeg': ['image/jpeg'],
            '.png': ['image/png'],
            '.gif': ['image/gif'],
            '.bmp': ['image/bmp'],
            '.mp4': ['video/mp4'],
            '.avi': ['video/x-msvideo'],
            '.mov': ['video/quicktime'],
            '.mkv': ['video/x-matroska'],
            '.mp3': ['audio/mpeg'],
            '.wav': ['audio/wav'],
            '.m4a': ['audio/mp4'],
            '.ogg': ['audio/ogg']
        }
        
        expected_mimes = valid_mime_types.get(file_ext, [])
        if expected_mimes and mime_type not in expected_mimes:
            return False, f"File content doesn't match extension {file_ext}"
            
    except Exception as e:
        return False, f"Could not validate file type: {str(e)}"
    
    return True, None

def validate_metadata(metadata: dict) -> Tuple[bool, Optional[str]]:
    """
    Validate submission metadata
    
    Returns:
        Tuple of (is_valid, error_message)
    """
    required_fields = ["title", "category", "description", "consent", "attribution"]
    
    for field in required_fields:
        if field not in metadata:
            return False, f"Missing required field: {field}"
        
        if not metadata[field] and field != "consent":
            return False, f"Field {field} cannot be empty"
    
    # Validate consent
    if not metadata.get("consent"):
        return False, "User consent is required for content submission"
    
    # Validate category
    valid_categories = [
        "Tamil Classical Dance", "Traditional Medicine", "Religious Rituals",
        "Folk Arts", "Culinary Traditions", "Musical Heritage", 
        "Architectural Styles", "Literary Works"
    ]
    
    if metadata.get("category") not in valid_categories:
        return False, f"Invalid category. Must be one of: {', '.join(valid_categories)}"
    
    # Validate text lengths
    if len(metadata.get("title", "")) > 200:
        return False, "Title must be less than 200 characters"
    
    if len(metadata.get("description", "")) > 2000:
        return False, "Description must be less than 2000 characters"
    
    return True, None