"""
KeyframeBot - Handles keyframe analysis, OCR, and object detection
"""
import cv2
import pytesseract
from pathlib import Path
from typing import List, Dict
import google.generativeai as genai
from PIL import Image
from ..models import KeyframeData
from ..config import settings

class KeyframeBot:
    def __init__(self):
        # Configure Gemini for vision tasks
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.gemini_model = genai.GenerativeModel(settings.GEMINI_MODEL)
    
    async def analyze_keyframes(self, keyframes_dir: Path) -> List[KeyframeData]:
        """
        Analyze all keyframes in directory for OCR text and object detection
        """
        keyframe_data = []
        
        # Get all keyframe files
        keyframe_files = sorted(keyframes_dir.glob("*.jpg"))
        
        for frame_path in keyframe_files:
            # Extract timestamp from filename (format: frame_0001_12.5s.jpg)
            filename = frame_path.stem
            timestamp_str = filename.split('_')[-1].replace('s', '')
            timestamp = float(timestamp_str)
            
            # Analyze this keyframe
            frame_data = await self._analyze_single_frame(frame_path, timestamp)
            keyframe_data.append(frame_data)
        
        return keyframe_data
    
    async def _analyze_single_frame(self, frame_path: Path, timestamp: float) -> KeyframeData:
        """Analyze a single keyframe"""
        frame_id = frame_path.stem
        
        # Load image
        image = cv2.imread(str(frame_path))
        
        # Extract OCR text
        ocr_text = self._extract_ocr_text(image)
        
        # Use Gemini for object detection and scene description
        objects_detected, description = await self._analyze_with_gemini(frame_path)
        
        return KeyframeData(
            frame_id=frame_id,
            timestamp=timestamp,
            ocr_text=ocr_text,
            objects_detected=objects_detected,
            description=description
        )
    
    def _extract_ocr_text(self, image) -> List[str]:
        """Extract text from image using Tesseract OCR"""
        try:
            # Convert BGR to RGB for PIL
            rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            pil_image = Image.fromarray(rgb_image)
            
            # Configure Tesseract for better cooking-related text recognition
            custom_config = r'--oem 3 --psm 6 -c tessedit_char_whitelist=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,/- '
            
            # Extract text
            text = pytesseract.image_to_string(pil_image, config=custom_config)
            
            # Clean and filter text
            lines = [line.strip() for line in text.split('\n') if line.strip()]
            
            # Filter for cooking-related terms (measurements, ingredients, etc.)
            cooking_terms = []
            for line in lines:
                if self._is_cooking_related(line):
                    cooking_terms.append(line)
            
            return cooking_terms
            
        except Exception as e:
            print(f"OCR extraction failed: {e}")
            return []
    
    def _is_cooking_related(self, text: str) -> bool:
        """Check if text is likely cooking-related"""
        cooking_keywords = [
            'cup', 'cups', 'tsp', 'tbsp', 'tablespoon', 'teaspoon',
            'oz', 'lb', 'pound', 'gram', 'kg', 'ml', 'liter',
            'salt', 'pepper', 'oil', 'water', 'flour', 'sugar',
            'onion', 'garlic', 'tomato', 'rice', 'chicken', 'beef',
            'min', 'minutes', 'hour', 'hours', 'degrees', '°F', '°C',
            'recipe', 'ingredients', 'cooking', 'bake', 'fry', 'boil'
        ]
        
        text_lower = text.lower()
        
        # Check for measurement patterns (numbers + units)
        import re
        if re.search(r'\d+\s*(cup|tsp|tbsp|oz|lb|gram|ml|min)', text_lower):
            return True
        
        # Check for cooking keywords
        return any(keyword in text_lower for keyword in cooking_keywords)
    
    async def _analyze_with_gemini(self, frame_path: Path) -> tuple[List[str], str]:
        """Use Gemini Vision to analyze the frame"""
        try:
            # Upload image to Gemini
            image_file = genai.upload_file(str(frame_path))
            
            prompt = """
            Analyze this cooking video frame and identify:
            
            1. OBJECTS: List all cooking-related objects, ingredients, tools, and equipment visible
            2. DESCRIPTION: Provide a detailed description of what's happening in this cooking scene
            
            Focus on:
            - Ingredients and their apparent quantities/states
            - Cooking tools and equipment
            - Cooking techniques being demonstrated
            - Any text or labels visible (ingredient packages, measuring tools)
            - Food preparation stages
            
            Return response in this format:
            OBJECTS: [list of objects separated by commas]
            DESCRIPTION: [detailed scene description]
            """
            
            response = self.gemini_model.generate_content([prompt, image_file])
            response_text = response.text
            
            # Parse response
            objects_detected = []
            description = ""
            
            lines = response_text.split('\n')
            for line in lines:
                if line.startswith('OBJECTS:'):
                    objects_text = line.replace('OBJECTS:', '').strip()
                    objects_detected = [obj.strip() for obj in objects_text.split(',') if obj.strip()]
                elif line.startswith('DESCRIPTION:'):
                    description = line.replace('DESCRIPTION:', '').strip()
            
            return objects_detected, description
            
        except Exception as e:
            print(f"Gemini vision analysis failed: {e}")
            return [], "Analysis failed"
    
    def detect_measurements(self, ocr_text: List[str]) -> List[Dict[str, str]]:
        """Extract measurement information from OCR text"""
        measurements = []
        
        import re
        measurement_pattern = r'(\d+(?:\.\d+)?)\s*(cup|cups|tsp|tbsp|tablespoon|teaspoon|oz|lb|pound|gram|g|kg|ml|liter|l)'
        
        for text in ocr_text:
            matches = re.finditer(measurement_pattern, text.lower())
            for match in matches:
                measurements.append({
                    'quantity': match.group(1),
                    'unit': match.group(2),
                    'original_text': text,
                    'confidence': 80  # OCR-based measurements have medium confidence
                })
        
        return measurements