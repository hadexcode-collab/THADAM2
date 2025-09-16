"""
NutritionMapper - Calculates nutrition totals and per-serving values
"""
from typing import List, Dict, Optional
from ..models import Ingredient, NutritionSummary, NutritionPer100g

class NutritionMapper:
    def __init__(self):
        pass
    
    def calculate_nutrition_summary(self, 
                                  ingredients: List[Ingredient],
                                  estimated_servings: Optional[int] = None) -> NutritionSummary:
        """
        Calculate total nutrition and per-serving values
        """
        # Calculate totals
        totals = self._calculate_totals(ingredients)
        
        # Estimate servings if not provided
        if not estimated_servings:
            estimated_servings = self._estimate_servings(ingredients)
        
        # Calculate per-serving values
        per_serving = {}
        if estimated_servings and estimated_servings > 0:
            for key, value in totals.items():
                if value is not None:
                    per_serving[key] = round(value / estimated_servings, 2)
        
        return NutritionSummary(
            total_calories=totals.get('calories'),
            total_protein_g=totals.get('protein_g'),
            total_fat_g=totals.get('fat_g'),
            total_carbs_g=totals.get('carbs_g'),
            servings=estimated_servings,
            per_serving=per_serving if per_serving else None
        )
    
    def _calculate_totals(self, ingredients: List[Ingredient]) -> Dict[str, Optional[float]]:
        """Calculate total nutrition values for all ingredients"""
        totals = {
            'calories': 0,
            'protein_g': 0,
            'fat_g': 0,
            'carbs_g': 0,
            'fiber_g': 0,
            'sugar_g': 0,
            'sodium_mg': 0,
            'potassium_mg': 0,
            'vitamin_c_mg': 0,
            'iron_mg': 0,
            'calcium_mg': 0
        }
        
        for ingredient in ingredients:
            if not ingredient.nutrition_per_100g or not ingredient.quantity_in_grams:
                continue
            
            # Calculate scaling factor (ingredient grams / 100g)
            scale_factor = ingredient.quantity_in_grams / 100.0
            
            nutrition = ingredient.nutrition_per_100g
            
            # Add scaled nutrition values
            if nutrition.calories:
                totals['calories'] += nutrition.calories * scale_factor
            if nutrition.protein_g:
                totals['protein_g'] += nutrition.protein_g * scale_factor
            if nutrition.fat_g:
                totals['fat_g'] += nutrition.fat_g * scale_factor
            if nutrition.carbs_g:
                totals['carbs_g'] += nutrition.carbs_g * scale_factor
            if nutrition.fiber_g:
                totals['fiber_g'] += nutrition.fiber_g * scale_factor
            if nutrition.sugar_g:
                totals['sugar_g'] += nutrition.sugar_g * scale_factor
            if nutrition.sodium_mg:
                totals['sodium_mg'] += nutrition.sodium_mg * scale_factor
            if nutrition.potassium_mg:
                totals['potassium_mg'] += nutrition.potassium_mg * scale_factor
            if nutrition.vitamin_c_mg:
                totals['vitamin_c_mg'] += nutrition.vitamin_c_mg * scale_factor
            if nutrition.iron_mg:
                totals['iron_mg'] += nutrition.iron_mg * scale_factor
            if nutrition.calcium_mg:
                totals['calcium_mg'] += nutrition.calcium_mg * scale_factor
        
        # Round values
        for key in totals:
            if totals[key] > 0:
                totals[key] = round(totals[key], 2)
            else:
                totals[key] = None
        
        return totals
    
    def _estimate_servings(self, ingredients: List[Ingredient]) -> int:
        """Estimate number of servings based on ingredient quantities"""
        
        # Look for main ingredients to estimate servings
        main_ingredients = ['rice', 'pasta', 'chicken', 'beef', 'fish', 'flour']
        
        for ingredient in ingredients:
            ingredient_name = ingredient.name.lower()
            
            # Check if this is a main ingredient
            for main_ing in main_ingredients:
                if main_ing in ingredient_name and ingredient.quantity_in_grams:
                    # Estimate servings based on main ingredient amount
                    if main_ing in ['rice', 'pasta']:
                        # ~75g dry rice/pasta per serving
                        return max(1, round(ingredient.quantity_in_grams / 75))
                    elif main_ing in ['chicken', 'beef', 'fish']:
                        # ~150g protein per serving
                        return max(1, round(ingredient.quantity_in_grams / 150))
                    elif main_ing == 'flour':
                        # ~100g flour per serving for baked goods
                        return max(1, round(ingredient.quantity_in_grams / 100))
        
        # Default estimation based on total ingredient count and quantities
        total_weight = sum(
            ing.quantity_in_grams for ing in ingredients 
            if ing.quantity_in_grams
        )
        
        if total_weight:
            # Estimate ~300g total ingredients per serving
            estimated = max(1, round(total_weight / 300))
            return min(estimated, 8)  # Cap at 8 servings for reasonableness
        
        # Default to 2 servings if no good estimate
        return 2
    
    def validate_nutrition_data(self, nutrition_summary: NutritionSummary) -> List[str]:
        """Validate nutrition data and return list of issues"""
        issues = []
        
        # Check for reasonable calorie ranges
        if nutrition_summary.total_calories:
            if nutrition_summary.total_calories < 50:
                issues.append("Total calories seem too low")
            elif nutrition_summary.total_calories > 5000:
                issues.append("Total calories seem too high")
        
        # Check macronutrient balance
        if (nutrition_summary.total_protein_g and 
            nutrition_summary.total_fat_g and 
            nutrition_summary.total_carbs_g):
            
            total_macros = (nutrition_summary.total_protein_g + 
                          nutrition_summary.total_fat_g + 
                          nutrition_summary.total_carbs_g)
            
            if total_macros == 0:
                issues.append("No macronutrient data available")
        
        # Check per-serving reasonableness
        if nutrition_summary.per_serving and nutrition_summary.per_serving.get('calories'):
            per_serving_calories = nutrition_summary.per_serving['calories']
            if per_serving_calories < 20:
                issues.append("Per-serving calories seem too low")
            elif per_serving_calories > 1500:
                issues.append("Per-serving calories seem too high")
        
        return issues