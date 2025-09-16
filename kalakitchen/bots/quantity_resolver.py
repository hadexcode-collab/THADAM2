"""
QuantityResolver - Merges evidence from multiple sources to determine ingredient quantities
"""
import re
from typing import List, Dict, Any, Optional, Tuple
import google.generativeai as genai
from ..models import Ingredient, TranscriptSegment, KeyframeData, MediaReference
from ..config import settings, GEMINI_PROMPTS

class QuantityResolver:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.gemini_model = genai.GenerativeModel(settings.GEMINI_MODEL)
        
        # Common unit conversions to grams
        self.unit_conversions = {
            # Volume to weight (approximate for common ingredients)
            'cup': {'flour': 120, 'sugar': 200, 'rice': 185, 'water': 240, 'oil': 220},
            'tbsp': {'flour': 8, 'sugar': 12, 'oil': 14, 'water': 15},
            'tsp': {'salt': 6, 'sugar': 4, 'oil': 5, 'water': 5},
            # Weight units
            'g': 1, 'gram': 1, 'grams': 1,
            'kg': 1000, 'kilogram': 1000,
            'oz': 28.35, 'ounce': 28.35,
            'lb': 453.59, 'pound': 453.59,
            # Pieces/counts
            'piece': 1, 'pieces': 1, 'whole': 1,
            'clove': 3, 'cloves': 3,  # garlic clove ~3g
        }
    
    async def resolve_quantities(self, 
                               ingredients: List[Ingredient],
                               transcript: List[TranscriptSegment],
                               keyframes: List[KeyframeData]) -> List[Ingredient]:
        """
        Resolve ingredient quantities by merging evidence from multiple sources
        """
        resolved_ingredients = []
        
        for ingredient in ingredients:
            try:
                resolved = await self._resolve_single_ingredient(
                    ingredient, transcript, keyframes
                )
                resolved_ingredients.append(resolved)
            except Exception as e:
                print(f"Failed to resolve quantity for {ingredient.name}: {e}")
                resolved_ingredients.append(ingredient)
        
        return resolved_ingredients
    
    async def _resolve_single_ingredient(self,
                                       ingredient: Ingredient,
                                       transcript: List[TranscriptSegment],
                                       keyframes: List[KeyframeData]) -> Ingredient:
        """Resolve quantity for a single ingredient"""
        
        # Collect evidence from different sources
        transcript_evidence = self._extract_transcript_evidence(ingredient, transcript)
        ocr_evidence = self._extract_ocr_evidence(ingredient, keyframes)
        visual_evidence = self._extract_visual_evidence(ingredient, keyframes)
        
        # Get typical recipe amounts for this ingredient
        typical_amounts = self._get_typical_amounts(ingredient.name)
        
        # Use Gemini to resolve conflicting evidence
        resolved_quantity = await self._gemini_quantity_resolution(
            ingredient, transcript_evidence, ocr_evidence, visual_evidence, typical_amounts
        )
        
        # Update ingredient with resolved quantity
        if resolved_quantity:
            ingredient.quantity = resolved_quantity.get('quantity')
            ingredient.unit = resolved_quantity.get('unit')
            ingredient.estimated = resolved_quantity.get('estimated', False)
            ingredient.estimation_method = resolved_quantity.get('estimation_method')
            
            # Convert to grams if possible
            ingredient.quantity_in_grams = self._convert_to_grams(
                ingredient.quantity, ingredient.unit, ingredient.name
            )
        
        return ingredient
    
    def _extract_transcript_evidence(self, 
                                   ingredient: Ingredient,
                                   transcript: List[TranscriptSegment]) -> List[Dict[str, Any]]:
        """Extract quantity mentions from transcript"""
        evidence = []
        ingredient_name = ingredient.name.lower()
        
        for segment in transcript:
            text = segment.text.lower()
            
            # Look for ingredient mentions with quantities
            if ingredient_name in text:
                # Extract quantity patterns
                quantity_matches = self._extract_quantity_patterns(text)
                
                for match in quantity_matches:
                    evidence.append({
                        'source': 'transcript',
                        'quantity': match['quantity'],
                        'unit': match['unit'],
                        'context': segment.text,
                        'timestamp': segment.start,
                        'confidence': segment.confidence
                    })
        
        return evidence
    
    def _extract_ocr_evidence(self,
                            ingredient: Ingredient,
                            keyframes: List[KeyframeData]) -> List[Dict[str, Any]]:
        """Extract quantity information from OCR text"""
        evidence = []
        ingredient_name = ingredient.name.lower()
        
        for frame in keyframes:
            for ocr_text in frame.ocr_text:
                text = ocr_text.lower()
                
                # Look for measurements near ingredient mentions
                if ingredient_name in text or self._contains_measurements(text):
                    quantity_matches = self._extract_quantity_patterns(text)
                    
                    for match in quantity_matches:
                        evidence.append({
                            'source': 'ocr',
                            'quantity': match['quantity'],
                            'unit': match['unit'],
                            'context': ocr_text,
                            'frame_id': frame.frame_id,
                            'timestamp': frame.timestamp,
                            'confidence': 75  # OCR has medium confidence
                        })
        
        return evidence
    
    def _extract_visual_evidence(self,
                               ingredient: Ingredient,
                               keyframes: List[KeyframeData]) -> List[Dict[str, Any]]:
        """Extract visual quantity cues from frame descriptions"""
        evidence = []
        ingredient_name = ingredient.name.lower()
        
        for frame in keyframes:
            description = frame.description.lower()
            
            if ingredient_name in description:
                # Look for visual quantity indicators
                visual_cues = self._extract_visual_quantity_cues(description)
                
                for cue in visual_cues:
                    evidence.append({
                        'source': 'visual',
                        'visual_cue': cue,
                        'context': frame.description,
                        'frame_id': frame.frame_id,
                        'timestamp': frame.timestamp,
                        'confidence': 60  # Visual estimation has lower confidence
                    })
        
        return evidence
    
    def _extract_quantity_patterns(self, text: str) -> List[Dict[str, Any]]:
        """Extract quantity and unit patterns from text"""
        patterns = [
            r'(\d+(?:\.\d+)?)\s*(cup|cups|tsp|tbsp|tablespoon|teaspoon|oz|lb|pound|gram|g|kg|ml|liter|l|piece|pieces|clove|cloves)',
            r'(\d+/\d+)\s*(cup|cups|tsp|tbsp)',  # Fractions
            r'(half|quarter|third)\s*(cup|cups|tsp|tbsp)',  # Word fractions
            r'(\d+)\s*(medium|large|small)\s*(onion|tomato|potato|carrot)',  # Sized items
        ]
        
        matches = []
        for pattern in patterns:
            for match in re.finditer(pattern, text, re.IGNORECASE):
                quantity_str = match.group(1)
                unit = match.group(2).lower()
                
                # Convert quantity to float
                quantity = self._parse_quantity(quantity_str)
                
                if quantity is not None:
                    matches.append({
                        'quantity': quantity,
                        'unit': unit,
                        'original_text': match.group(0)
                    })
        
        return matches
    
    def _parse_quantity(self, quantity_str: str) -> Optional[float]:
        """Parse quantity string to float"""
        try:
            # Handle fractions
            if '/' in quantity_str:
                parts = quantity_str.split('/')
                return float(parts[0]) / float(parts[1])
            
            # Handle word fractions
            word_fractions = {
                'half': 0.5, 'quarter': 0.25, 'third': 0.33
            }
            if quantity_str.lower() in word_fractions:
                return word_fractions[quantity_str.lower()]
            
            # Handle regular numbers
            return float(quantity_str)
            
        except (ValueError, ZeroDivisionError):
            return None
    
    def _contains_measurements(self, text: str) -> bool:
        """Check if text contains measurement units"""
        measurement_units = ['cup', 'tsp', 'tbsp', 'oz', 'lb', 'gram', 'ml', 'liter']
        return any(unit in text.lower() for unit in measurement_units)
    
    def _extract_visual_quantity_cues(self, description: str) -> List[str]:
        """Extract visual quantity indicators from frame descriptions"""
        cues = []
        
        # Look for visual quantity indicators
        visual_patterns = [
            r'(small|medium|large|huge|tiny)\s+(amount|portion|bowl|plate)',
            r'(handful|pinch|dash|sprinkle)',
            r'(full|half|quarter)\s+(cup|bowl|spoon)',
            r'(measuring\s+cup|measuring\s+spoon)',
        ]
        
        for pattern in visual_patterns:
            matches = re.finditer(pattern, description, re.IGNORECASE)
            for match in matches:
                cues.append(match.group(0))
        
        return cues
    
    def _get_typical_amounts(self, ingredient_name: str) -> Dict[str, Any]:
        """Get typical recipe amounts for an ingredient"""
        # Common ingredient amounts in recipes
        typical_amounts = {
            'salt': {'quantity': 1, 'unit': 'tsp', 'range': (0.5, 2)},
            'pepper': {'quantity': 0.5, 'unit': 'tsp', 'range': (0.25, 1)},
            'garlic': {'quantity': 2, 'unit': 'cloves', 'range': (1, 4)},
            'onion': {'quantity': 1, 'unit': 'medium', 'range': (0.5, 2)},
            'oil': {'quantity': 2, 'unit': 'tbsp', 'range': (1, 4)},
            'flour': {'quantity': 1, 'unit': 'cup', 'range': (0.5, 3)},
            'sugar': {'quantity': 0.5, 'unit': 'cup', 'range': (0.25, 2)},
            'rice': {'quantity': 1, 'unit': 'cup', 'range': (0.5, 2)},
        }
        
        return typical_amounts.get(ingredient_name.lower(), {
            'quantity': 1, 'unit': 'portion', 'range': (0.5, 2)
        })
    
    async def _gemini_quantity_resolution(self,
                                        ingredient: Ingredient,
                                        transcript_evidence: List[Dict[str, Any]],
                                        ocr_evidence: List[Dict[str, Any]],
                                        visual_evidence: List[Dict[str, Any]],
                                        typical_amounts: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Use Gemini to resolve conflicting quantity evidence"""
        
        prompt = GEMINI_PROMPTS["quantity_resolution"].format(
            ingredient=ingredient.name,
            transcript_evidence=str(transcript_evidence),
            ocr_evidence=str(ocr_evidence),
            visual_evidence=str(visual_evidence),
            typical_amounts=str(typical_amounts)
        )
        
        try:
            response = self.gemini_model.generate_content(prompt)
            
            # Parse Gemini's response
            # This would need proper JSON parsing in production
            # For now, return a reasonable estimate
            
            if transcript_evidence:
                # Prefer transcript evidence if available
                best_evidence = max(transcript_evidence, key=lambda x: x['confidence'])
                return {
                    'quantity': best_evidence['quantity'],
                    'unit': best_evidence['unit'],
                    'estimated': False,
                    'estimation_method': 'transcript_explicit'
                }
            elif ocr_evidence:
                # Use OCR evidence as second choice
                best_evidence = max(ocr_evidence, key=lambda x: x['confidence'])
                return {
                    'quantity': best_evidence['quantity'],
                    'unit': best_evidence['unit'],
                    'estimated': True,
                    'estimation_method': 'ocr_reading'
                }
            else:
                # Fall back to typical amounts
                return {
                    'quantity': typical_amounts['quantity'],
                    'unit': typical_amounts['unit'],
                    'estimated': True,
                    'estimation_method': 'typical_recipe_amount'
                }
                
        except Exception as e:
            print(f"Gemini quantity resolution failed: {e}")
            return None
    
    def _convert_to_grams(self, quantity: Optional[float], unit: Optional[str], ingredient_name: str) -> Optional[float]:
        """Convert quantity to grams using conversion tables"""
        if not quantity or not unit:
            return None
        
        unit = unit.lower()
        ingredient_name = ingredient_name.lower()
        
        # Direct weight units
        if unit in self.unit_conversions:
            if isinstance(self.unit_conversions[unit], dict):
                # Volume units - need ingredient-specific conversion
                if ingredient_name in self.unit_conversions[unit]:
                    return quantity * self.unit_conversions[unit][ingredient_name]
                else:
                    # Use water as default for volume
                    return quantity * self.unit_conversions[unit].get('water', 240)
            else:
                # Direct conversion factor
                return quantity * self.unit_conversions[unit]
        
        return None