"""
ClaimExtractor - Uses Gemini to extract structured recipe claims from multimodal data
"""
import json
from typing import List, Dict, Any
import google.generativeai as genai
from ..models import TranscriptSegment, KeyframeData, CookingStep, Ingredient, RecipeTitle
from ..config import settings, GEMINI_PROMPTS

class ClaimExtractor:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.gemini_model = genai.GenerativeModel(settings.GEMINI_MODEL)
    
    async def extract_claims(self, 
                           transcript: List[TranscriptSegment],
                           keyframes: List[KeyframeData],
                           duration: float,
                           language: str = "en",
                           region: str = "US") -> Dict[str, Any]:
        """
        Extract structured recipe claims using Gemini multimodal reasoning
        """
        
        # Prepare transcript text
        transcript_text = self._format_transcript(transcript)
        
        # Prepare keyframe descriptions
        keyframe_text = self._format_keyframes(keyframes)
        
        # Create comprehensive prompt
        prompt = GEMINI_PROMPTS["claim_extraction"].format(
            transcript=transcript_text,
            keyframes=keyframe_text,
            duration=duration,
            language=language,
            region=region
        )
        
        # Add detailed extraction instructions
        extraction_prompt = f"""
        {prompt}
        
        EXTRACTION REQUIREMENTS:
        
        1. RECIPE TITLE:
        Extract or infer the recipe title. Look for:
        - Direct mentions: "Today we're making...", "This is my recipe for..."
        - Visual text in frames
        - Infer from main ingredients if not explicit
        
        2. COOKING STEPS:
        Create timestamped steps by analyzing:
        - Transcript segments for action words (chop, mix, cook, add, etc.)
        - Keyframe descriptions for visual cooking actions
        - Match transcript timing with visual evidence
        - Each step should have start/end times and clear instructions
        
        3. INGREDIENTS:
        For each ingredient, extract:
        - Name (preserve original language, add transliteration if needed)
        - Quantity (number, fraction, or "estimated" if visual only)
        - Unit (cups, tsp, pieces, etc.)
        - Context (when it's added, how it's prepared)
        - Mark as "estimated" if quantity not explicitly stated
        
        4. TOOLS & EQUIPMENT:
        List all cooking tools mentioned or visible:
        - Pans, pots, utensils, appliances
        - Measuring tools, cutting boards, etc.
        
        5. CONFIDENCE SCORING:
        Rate each claim 0-100 based on:
        - Explicit mention in transcript (high confidence)
        - Clear visual evidence (medium-high confidence)  
        - Inference from context (medium confidence)
        - Estimation from typical recipes (low-medium confidence)
        
        Return structured JSON with all extracted information and confidence scores.
        Preserve cultural authenticity - don't anglicize ingredient names.
        """
        
        try:
            response = self.gemini_model.generate_content(extraction_prompt)
            
            # Parse Gemini's JSON response
            claims_data = self._parse_gemini_response(response.text)
            
            # Convert to structured models
            structured_claims = self._structure_claims(claims_data, transcript, keyframes)
            
            return structured_claims
            
        except Exception as e:
            print(f"Claim extraction failed: {e}")
            return self._create_fallback_claims(transcript, keyframes, duration)
    
    def _format_transcript(self, transcript: List[TranscriptSegment]) -> str:
        """Format transcript for Gemini analysis"""
        formatted = []
        for segment in transcript:
            formatted.append(f"[{segment.start:.1f}s - {segment.end:.1f}s] {segment.text}")
        return "\n".join(formatted)
    
    def _format_keyframes(self, keyframes: List[KeyframeData]) -> str:
        """Format keyframe data for Gemini analysis"""
        formatted = []
        for frame in keyframes:
            ocr_text = "; ".join(frame.ocr_text) if frame.ocr_text else "No text detected"
            objects = ", ".join(frame.objects_detected) if frame.objects_detected else "No objects detected"
            
            formatted.append(f"""
            Frame {frame.frame_id} ({frame.timestamp:.1f}s):
            - Description: {frame.description}
            - OCR Text: {ocr_text}
            - Objects: {objects}
            """)
        
        return "\n".join(formatted)
    
    def _parse_gemini_response(self, response_text: str) -> Dict[str, Any]:
        """Parse Gemini's JSON response"""
        try:
            # Try to extract JSON from response
            import re
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            else:
                # Fallback parsing if no JSON found
                return self._parse_text_response(response_text)
        except json.JSONDecodeError:
            return self._parse_text_response(response_text)
    
    def _parse_text_response(self, response_text: str) -> Dict[str, Any]:
        """Fallback parser for non-JSON responses"""
        # Basic text parsing as fallback
        return {
            "recipe_title": {"text": "Recipe from video", "confidence": 50},
            "steps": [],
            "ingredients": [],
            "tools": [],
            "raw_response": response_text
        }
    
    def _structure_claims(self, claims_data: Dict[str, Any], 
                         transcript: List[TranscriptSegment],
                         keyframes: List[KeyframeData]) -> Dict[str, Any]:
        """Convert parsed claims to structured models"""
        
        # Extract recipe title
        title_data = claims_data.get("recipe_title", {})
        recipe_title = RecipeTitle(
            text=title_data.get("text", "Unknown Recipe"),
            confidence=title_data.get("confidence", 50),
            source=title_data.get("source", "inferred")
        )
        
        # Extract cooking steps
        steps = []
        for i, step_data in enumerate(claims_data.get("steps", [])):
            step = CookingStep(
                index=i + 1,
                start=step_data.get("start", 0.0),
                end=step_data.get("end", 0.0),
                text=step_data.get("text", ""),
                confidence=step_data.get("confidence", 50),
                techniques=step_data.get("techniques", []),
                tools_used=step_data.get("tools_used", [])
            )
            steps.append(step)
        
        # Extract ingredients
        ingredients = []
        for ing_data in claims_data.get("ingredients", []):
            ingredient = Ingredient(
                name=ing_data.get("name", ""),
                original_text=ing_data.get("original_text", ""),
                quantity=ing_data.get("quantity"),
                unit=ing_data.get("unit"),
                estimated=ing_data.get("estimated", False),
                estimation_method=ing_data.get("estimation_method"),
                uses=ing_data.get("uses", [])
            )
            ingredients.append(ingredient)
        
        # Extract tools
        tools = claims_data.get("tools", [])
        
        return {
            "recipe_title": recipe_title,
            "steps": steps,
            "ingredients": ingredients,
            "tools": tools,
            "raw_claims": claims_data
        }
    
    def _create_fallback_claims(self, transcript: List[TranscriptSegment],
                               keyframes: List[KeyframeData],
                               duration: float) -> Dict[str, Any]:
        """Create basic claims if Gemini extraction fails"""
        
        # Basic recipe title from transcript
        recipe_title = RecipeTitle(
            text="Cooking Recipe",
            confidence=30,
            source="fallback"
        )
        
        # Basic steps from transcript segments
        steps = []
        for i, segment in enumerate(transcript):
            step = CookingStep(
                index=i + 1,
                start=segment.start,
                end=segment.end,
                text=segment.text,
                confidence=int(segment.confidence),
                techniques=[],
                tools_used=[]
            )
            steps.append(step)
        
        return {
            "recipe_title": recipe_title,
            "steps": steps,
            "ingredients": [],
            "tools": [],
            "raw_claims": {"fallback": True}
        }