import os
import magic
from typing import Dict, Any
from PIL import Image
import json

class RecognizerBot:
    """Bot responsible for content recognition and text extraction"""
    
    def __init__(self):
        self.supported_types = {
            'text': ['.txt', '.md', '.json'],
            'image': ['.jpg', '.jpeg', '.png', '.gif', '.bmp'],
            'video': ['.mp4', '.avi', '.mov', '.mkv'],
            'audio': ['.mp3', '.wav', '.m4a', '.ogg']
        }
    
    async def process(self, file_path: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process uploaded content and extract text for authenticity verification
        
        Args:
            file_path: Path to the uploaded file
            metadata: Submission metadata
            
        Returns:
            Dictionary containing extracted text and content analysis
        """
        try:
            # Determine content type
            content_type = await self._detect_content_type(file_path)
            
            # Extract text based on content type
            if content_type == 'text':
                extracted_text = await self._extract_text_from_text(file_path)
            elif content_type == 'image':
                extracted_text = await self._extract_text_from_image(file_path)
            elif content_type == 'video':
                extracted_text = await self._extract_text_from_video(file_path)
            elif content_type == 'audio':
                extracted_text = await self._extract_text_from_audio(file_path)
            else:
                extracted_text = metadata.get('description', '')
            
            # Enhance extracted text with metadata
            enhanced_text = await self._enhance_with_metadata(extracted_text, metadata)
            
            return {
                "success": True,
                "content_type": content_type,
                "extracted_text": enhanced_text,
                "file_info": {
                    "size": os.path.getsize(file_path),
                    "type": content_type
                },
                "extraction_quality": self._assess_extraction_quality(enhanced_text)
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Content recognition failed: {str(e)}",
                "content_type": "unknown",
                "extracted_text": metadata.get('description', ''),
                "extraction_quality": 0.3
            }
    
    async def _detect_content_type(self, file_path: str) -> str:
        """Detect the type of content from file"""
        try:
            # Use python-magic to detect file type
            file_type = magic.from_file(file_path, mime=True)
            
            if file_type.startswith('text/'):
                return 'text'
            elif file_type.startswith('image/'):
                return 'image'
            elif file_type.startswith('video/'):
                return 'video'
            elif file_type.startswith('audio/'):
                return 'audio'
            else:
                # Fallback to file extension
                ext = os.path.splitext(file_path)[1].lower()
                for content_type, extensions in self.supported_types.items():
                    if ext in extensions:
                        return content_type
                
                return 'unknown'
                
        except Exception:
            # Fallback to extension-based detection
            ext = os.path.splitext(file_path)[1].lower()
            for content_type, extensions in self.supported_types.items():
                if ext in extensions:
                    return content_type
            return 'unknown'
    
    async def _extract_text_from_text(self, file_path: str) -> str:
        """Extract text from text files"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        except UnicodeDecodeError:
            # Try with different encoding
            with open(file_path, 'r', encoding='latin-1') as f:
                return f.read()
    
    async def _extract_text_from_image(self, file_path: str) -> str:
        """
        Extract text from images using OCR
        Note: This is a simplified implementation. In production, you'd use
        services like Google Vision API, Tesseract, or Azure Computer Vision
        """
        try:
            # For demo purposes, return a placeholder
            # In production, use OCR library like pytesseract:
            # import pytesseract
            # image = Image.open(file_path)
            # return pytesseract.image_to_string(image)
            
            return "OCR text extraction would be performed here. This is a demo placeholder showing text extracted from the image describing Tamil cultural practices, dance movements, or traditional knowledge."
            
        except Exception as e:
            return f"OCR extraction failed: {str(e)}"
    
    async def _extract_text_from_video(self, file_path: str) -> str:
        """
        Extract text/speech from video files
        Note: This would use ASR (Automatic Speech Recognition) in production
        """
        try:
            # For demo purposes, return a placeholder
            # In production, use services like:
            # - Google Speech-to-Text API
            # - Azure Speech Services  
            # - AWS Transcribe
            # - OpenAI Whisper
            
            return "ASR transcription would be performed here. This is a demo placeholder representing speech-to-text conversion from video content about Tamil cultural practices, explanations of traditional methods, or cultural storytelling."
            
        except Exception as e:
            return f"ASR extraction failed: {str(e)}"
    
    async def _extract_text_from_audio(self, file_path: str) -> str:
        """Extract speech from audio files using ASR"""
        try:
            # Similar to video processing
            return "ASR transcription from audio would be performed here. This represents spoken content about Tamil heritage, traditional knowledge, or cultural practices converted to text."
            
        except Exception as e:
            return f"Audio ASR extraction failed: {str(e)}"
    
    async def _enhance_with_metadata(self, extracted_text: str, metadata: Dict[str, Any]) -> str:
        """Enhance extracted text with contextual metadata"""
        enhanced_parts = [
            f"Title: {metadata.get('title', 'Unknown')}",
            f"Category: {metadata.get('category', 'Unknown')}",
            f"Attribution: {metadata.get('attribution', 'Unknown')}",
            f"Description: {metadata.get('description', 'No description provided')}",
            "",
            "Extracted Content:",
            extracted_text
        ]
        
        return "\n".join(enhanced_parts)
    
    def _assess_extraction_quality(self, text: str) -> float:
        """Assess the quality of text extraction"""
        if not text or len(text.strip()) < 10:
            return 0.1
        
        # Simple quality metrics
        word_count = len(text.split())
        char_count = len(text)
        
        # Basic quality scoring
        if word_count > 100 and char_count > 500:
            return 0.9
        elif word_count > 50 and char_count > 200:
            return 0.7
        elif word_count > 20 and char_count > 100:
            return 0.5
        else:
            return 0.3