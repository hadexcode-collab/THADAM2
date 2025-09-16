"""
WebEnricher - Uses Gemini and web search to enrich ingredient data with nutrition and medicinal info
"""
import asyncio
import aiohttp
from typing import List, Dict, Any, Optional
from urllib.parse import quote_plus
import google.generativeai as genai
from bs4 import BeautifulSoup
from ..models import Ingredient, Source, MedicinalNote, NutritionPer100g
from ..config import settings, GEMINI_PROMPTS

class WebEnricher:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.gemini_model = genai.GenerativeModel(settings.GEMINI_MODEL)
        self.session = None
    
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    async def enrich_ingredients(self, ingredients: List[Ingredient]) -> List[Ingredient]:
        """
        Enrich ingredient list with nutrition and medicinal data from web sources
        """
        enriched_ingredients = []
        
        for ingredient in ingredients:
            try:
                enriched = await self._enrich_single_ingredient(ingredient)
                enriched_ingredients.append(enriched)
                
                # Rate limiting
                await asyncio.sleep(0.5)
                
            except Exception as e:
                print(f"Failed to enrich ingredient {ingredient.name}: {e}")
                enriched_ingredients.append(ingredient)
        
        return enriched_ingredients
    
    async def _enrich_single_ingredient(self, ingredient: Ingredient) -> Ingredient:
        """Enrich a single ingredient with web data"""
        
        # Search for nutrition data
        nutrition_data = await self._get_nutrition_data(ingredient.name)
        
        # Search for medicinal properties
        medicinal_notes = await self._get_medicinal_properties(ingredient.name)
        
        # Get culinary uses and substitutions
        culinary_info = await self._get_culinary_information(ingredient.name)
        
        # Update ingredient with enriched data
        ingredient.nutrition_per_100g = nutrition_data
        ingredient.medicinal_notes = medicinal_notes
        ingredient.uses.extend(culinary_info.get("uses", []))
        ingredient.substitutions = culinary_info.get("substitutions", [])
        ingredient.cultural_notes = culinary_info.get("cultural_notes")
        
        return ingredient
    
    async def _get_nutrition_data(self, ingredient_name: str) -> Optional[NutritionPer100g]:
        """Get nutrition data from USDA and other trusted sources"""
        
        # Search USDA FoodData Central
        usda_data = await self._search_usda_nutrition(ingredient_name)
        if usda_data:
            return usda_data
        
        # Fallback to Gemini web search
        return await self._gemini_nutrition_search(ingredient_name)
    
    async def _search_usda_nutrition(self, ingredient_name: str) -> Optional[NutritionPer100g]:
        """Search USDA FoodData Central API"""
        try:
            # USDA FoodData Central API endpoint
            search_url = f"https://api.nal.usda.gov/fdc/v1/foods/search"
            params = {
                "query": ingredient_name,
                "dataType": ["Foundation", "SR Legacy"],
                "pageSize": 1,
                "api_key": "DEMO_KEY"  # Replace with actual API key
            }
            
            async with self.session.get(search_url, params=params) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    if data.get("foods"):
                        food = data["foods"][0]
                        nutrients = food.get("foodNutrients", [])
                        
                        # Map USDA nutrients to our model
                        nutrition = NutritionPer100g()
                        
                        for nutrient in nutrients:
                            nutrient_id = nutrient.get("nutrientId")
                            value = nutrient.get("value", 0)
                            
                            # Map common nutrients (USDA nutrient IDs)
                            if nutrient_id == 1008:  # Energy
                                nutrition.calories = value
                            elif nutrient_id == 1003:  # Protein
                                nutrition.protein_g = value
                            elif nutrient_id == 1004:  # Total lipid (fat)
                                nutrition.fat_g = value
                            elif nutrient_id == 1005:  # Carbohydrate
                                nutrition.carbs_g = value
                            elif nutrient_id == 1079:  # Fiber
                                nutrition.fiber_g = value
                            elif nutrient_id == 1093:  # Sodium
                                nutrition.sodium_mg = value
                            elif nutrient_id == 1087:  # Calcium
                                nutrition.calcium_mg = value
                            elif nutrient_id == 1089:  # Iron
                                nutrition.iron_mg = value
                            elif nutrient_id == 1162:  # Vitamin C
                                nutrition.vitamin_c_mg = value
                        
                        return nutrition
                        
        except Exception as e:
            print(f"USDA search failed for {ingredient_name}: {e}")
        
        return None
    
    async def _gemini_nutrition_search(self, ingredient_name: str) -> Optional[NutritionPer100g]:
        """Use Gemini to search for nutrition information"""
        
        prompt = GEMINI_PROMPTS["web_enrichment"].format(ingredient=ingredient_name)
        
        # Add specific nutrition search instructions
        nutrition_prompt = f"""
        {prompt}
        
        Search specifically for nutritional information per 100g for "{ingredient_name}".
        
        Find and return:
        - Calories per 100g
        - Protein (g) per 100g
        - Fat (g) per 100g
        - Carbohydrates (g) per 100g
        - Fiber (g) per 100g
        - Sugar (g) per 100g
        - Sodium (mg) per 100g
        - Potassium (mg) per 100g
        - Vitamin C (mg) per 100g
        - Iron (mg) per 100g
        - Calcium (mg) per 100g
        
        Prioritize USDA FoodData Central, nutrition databases, and government sources.
        Return data in JSON format with source citations.
        """
        
        try:
            response = self.gemini_model.generate_content(nutrition_prompt)
            
            # Parse nutrition data from response
            # This would need proper JSON parsing in production
            return NutritionPer100g(
                calories=100,  # Placeholder - parse from Gemini response
                protein_g=5.0,
                fat_g=2.0,
                carbs_g=15.0,
                fiber_g=3.0
            )
            
        except Exception as e:
            print(f"Gemini nutrition search failed for {ingredient_name}: {e}")
            return None
    
    async def _get_medicinal_properties(self, ingredient_name: str) -> List[MedicinalNote]:
        """Get medicinal properties from PubMed and other medical sources"""
        
        medicinal_prompt = f"""
        Search for scientific evidence of medicinal or functional properties of "{ingredient_name}".
        
        Focus on:
        1. Anti-inflammatory properties
        2. Antioxidant effects
        3. Digestive benefits
        4. Cardiovascular effects
        5. Immune system support
        6. Traditional medicinal uses
        
        Use only high-quality sources:
        - PubMed/NCBI research papers
        - NIH/WHO publications
        - Peer-reviewed medical journals
        - Government health databases
        
        For each claim, provide:
        - The specific health benefit
        - Source citation (URL, title, snippet)
        - Confidence level based on evidence quality
        
        Return as JSON array of medicinal notes with sources.
        """
        
        try:
            response = self.gemini_model.generate_content(medicinal_prompt)
            
            # Parse medicinal notes from response
            # Placeholder implementation - would parse actual JSON response
            medicinal_notes = [
                MedicinalNote(
                    claim="Anti-inflammatory properties",
                    sources=[
                        Source(
                            url="https://pubmed.ncbi.nlm.nih.gov/example",
                            title="Anti-inflammatory effects of common spices",
                            snippet="Research shows significant anti-inflammatory activity...",
                            domain="pubmed.ncbi.nlm.nih.gov",
                            confidence=85
                        )
                    ],
                    confidence=85
                )
            ]
            
            return medicinal_notes
            
        except Exception as e:
            print(f"Medicinal properties search failed for {ingredient_name}: {e}")
            return []
    
    async def _get_culinary_information(self, ingredient_name: str) -> Dict[str, Any]:
        """Get culinary uses, substitutions, and cultural information"""
        
        culinary_prompt = f"""
        Search for culinary information about "{ingredient_name}":
        
        1. CULINARY USES:
        - Common cooking applications
        - Flavor profile and characteristics
        - Best cooking methods
        - Pairing suggestions
        
        2. SUBSTITUTIONS:
        - What can substitute for this ingredient
        - Conversion ratios if applicable
        - When substitutions work best
        
        3. CULTURAL SIGNIFICANCE:
        - Traditional uses in different cuisines
        - Cultural or religious significance
        - Regional variations
        
        Use reliable culinary sources, cultural databases, and cooking references.
        Return as JSON with uses, substitutions, and cultural_notes.
        """
        
        try:
            response = self.gemini_model.generate_content(culinary_prompt)
            
            # Parse culinary information
            # Placeholder - would parse actual JSON response
            return {
                "uses": ["flavoring", "coloring", "preservation"],
                "substitutions": ["paprika (for color)", "ginger (for warmth)"],
                "cultural_notes": "Sacred spice in Indian cuisine, used in traditional ceremonies"
            }
            
        except Exception as e:
            print(f"Culinary information search failed for {ingredient_name}: {e}")
            return {"uses": [], "substitutions": [], "cultural_notes": None}
    
    def _is_trusted_domain(self, url: str) -> bool:
        """Check if URL is from a trusted domain"""
        for domain in settings.TRUSTED_DOMAINS:
            if domain in url.lower():
                return True
        return False
    
    async def _web_search(self, query: str, site_filter: str = None) -> List[Dict[str, str]]:
        """Perform web search with optional site filtering"""
        # This would integrate with a search API (Google Custom Search, Bing, etc.)
        # Placeholder implementation
        return [
            {
                "url": "https://example.com/nutrition",
                "title": "Nutrition Information",
                "snippet": "Nutritional data for cooking ingredients..."
            }
        ]