"""
ReportGenerator - Creates final analysis report with human-readable summary and learner pack
"""
import json
from typing import List, Dict, Any
import google.generativeai as genai
from ..models import (
    RecipeAnalysisReport, RecipeTitle, CookingStep, Ingredient, 
    NutritionSummary, LearnerPack, QuizQuestion, Source
)
from ..config import settings, GEMINI_PROMPTS

class ReportGenerator:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.gemini_model = genai.GenerativeModel(settings.GEMINI_MODEL)
    
    async def generate_report(self,
                            recipe_title: RecipeTitle,
                            duration_seconds: float,
                            steps: List[CookingStep],
                            ingredients: List[Ingredient],
                            tools: List[str],
                            nutrition_summary: NutritionSummary,
                            citations: List[Source],
                            processing_time: float) -> RecipeAnalysisReport:
        """
        Generate comprehensive analysis report
        """
        
        # Calculate quality scores
        authenticity_score = self._calculate_authenticity_score(
            recipe_title, steps, ingredients
        )
        completeness_score = self._calculate_completeness_score(
            recipe_title, steps, ingredients, nutrition_summary
        )
        
        # Determine status
        status = self._determine_status(authenticity_score, completeness_score)
        
        # Find missing fields
        missing_fields = self._identify_missing_fields(
            recipe_title, steps, ingredients, nutrition_summary
        )
        
        # Generate educational content using Gemini
        learner_pack = await self._generate_learner_pack(
            recipe_title, steps, ingredients, nutrition_summary
        )
        
        # Generate human-readable summary
        human_summary = await self._generate_human_summary(
            recipe_title, steps, ingredients, nutrition_summary, 
            authenticity_score, completeness_score
        )
        
        # Create final report
        report = RecipeAnalysisReport(
            recipe_title=recipe_title,
            duration_seconds=duration_seconds,
            steps=steps,
            ingredients=ingredients,
            tools=tools,
            nutrition_summary=nutrition_summary,
            authenticity_score=authenticity_score,
            completeness_score=completeness_score,
            missing_fields=missing_fields,
            status=status,
            citations=citations,
            learner_pack=learner_pack,
            human_summary_markdown=human_summary,
            processing_time_seconds=processing_time
        )
        
        return report
    
    def _calculate_authenticity_score(self,
                                    recipe_title: RecipeTitle,
                                    steps: List[CookingStep],
                                    ingredients: List[Ingredient]) -> int:
        """Calculate overall authenticity score based on confidence of claims"""
        
        scores = []
        
        # Recipe title confidence
        scores.append(recipe_title.confidence)
        
        # Step confidences
        for step in steps:
            scores.append(step.confidence)
        
        # Ingredient confidences (based on provenance)
        for ingredient in ingredients:
            if ingredient.provenance:
                # Higher confidence for explicit mentions
                confidence = 80 if not ingredient.estimated else 60
                scores.append(confidence)
            else:
                scores.append(40)  # Low confidence for unverified ingredients
        
        # Calculate weighted average
        if scores:
            return int(sum(scores) / len(scores))
        else:
            return 50  # Default medium confidence
    
    def _calculate_completeness_score(self,
                                    recipe_title: RecipeTitle,
                                    steps: List[CookingStep],
                                    ingredients: List[Ingredient],
                                    nutrition_summary: NutritionSummary) -> int:
        """Calculate completeness score based on available information"""
        
        total_fields = 0
        completed_fields = 0
        
        # Recipe title
        total_fields += 1
        if recipe_title.text and recipe_title.text != "Unknown Recipe":
            completed_fields += 1
        
        # Steps
        total_fields += 1
        if steps and len(steps) > 0:
            completed_fields += 1
        
        # Ingredients with quantities
        total_fields += 1
        ingredients_with_quantities = sum(
            1 for ing in ingredients if ing.quantity is not None
        )
        if ingredients_with_quantities > 0:
            completed_fields += 1
        
        # Nutrition data
        total_fields += 1
        if nutrition_summary.total_calories:
            completed_fields += 1
        
        # Servings
        total_fields += 1
        if nutrition_summary.servings:
            completed_fields += 1
        
        # Tools/equipment
        total_fields += 1
        if tools and len(tools) > 0:
            completed_fields += 1
        
        # Calculate percentage
        if total_fields > 0:
            return int((completed_fields / total_fields) * 100)
        else:
            return 0
    
    def _determine_status(self, authenticity_score: int, completeness_score: int) -> str:
        """Determine verification status based on scores"""
        
        if (authenticity_score >= settings.VERIFIED_AUTHENTICITY_THRESHOLD and 
            completeness_score >= settings.VERIFIED_COMPLETENESS_THRESHOLD):
            return "Verified"
        elif authenticity_score >= settings.REVIEW_AUTHENTICITY_THRESHOLD:
            return "Review"
        else:
            return "Not Verified"
    
    def _identify_missing_fields(self,
                               recipe_title: RecipeTitle,
                               steps: List[CookingStep],
                               ingredients: List[Ingredient],
                               nutrition_summary: NutritionSummary) -> List[str]:
        """Identify missing or incomplete fields"""
        
        missing = []
        
        # Check recipe title
        if not recipe_title.text or recipe_title.text == "Unknown Recipe":
            missing.append("recipe_title")
        
        # Check steps
        if not steps or len(steps) == 0:
            missing.append("cooking_steps")
        
        # Check ingredients with quantities
        ingredients_without_quantities = [
            ing.name for ing in ingredients if ing.quantity is None
        ]
        if ingredients_without_quantities:
            missing.append(f"quantities_for_{len(ingredients_without_quantities)}_ingredients")
        
        # Check nutrition data
        if not nutrition_summary.total_calories:
            missing.append("nutrition_data")
        
        # Check servings
        if not nutrition_summary.servings:
            missing.append("serving_size")
        
        # Check for ingredients without nutrition data
        ingredients_without_nutrition = [
            ing.name for ing in ingredients if not ing.nutrition_per_100g
        ]
        if ingredients_without_nutrition:
            missing.append(f"nutrition_data_for_{len(ingredients_without_nutrition)}_ingredients")
        
        return missing
    
    async def _generate_learner_pack(self,
                                   recipe_title: RecipeTitle,
                                   steps: List[CookingStep],
                                   ingredients: List[Ingredient],
                                   nutrition_summary: NutritionSummary) -> LearnerPack:
        """Generate educational content using Gemini"""
        
        # Prepare data for Gemini
        recipe_data = {
            "title": recipe_title.text,
            "steps": [{"text": step.text, "techniques": step.techniques} for step in steps],
            "ingredients": [{"name": ing.name, "uses": ing.uses} for ing in ingredients],
            "nutrition": {
                "calories": nutrition_summary.total_calories,
                "servings": nutrition_summary.servings
            }
        }
        
        prompt = f"""
        Create educational content for this recipe analysis:
        
        RECIPE DATA: {json.dumps(recipe_data, indent=2)}
        
        Generate:
        1. LEARNING BULLETS: 3-6 key learning points about this recipe, focusing on:
           - Cooking techniques demonstrated
           - Nutritional benefits of ingredients
           - Cultural or culinary significance
           - Tips for success
        
        2. QUIZ QUESTIONS: Create 3 multiple choice questions with 4 options each:
           - Question about cooking technique
           - Question about ingredient benefits
           - Question about nutrition or serving size
        
        Return as JSON with this structure:
        {{
            "bullets": ["learning point 1", "learning point 2", ...],
            "quiz": [
                {{
                    "question": "What is the main cooking technique used?",
                    "options": ["option1", "option2", "option3", "option4"],
                    "correct_answer": 0,
                    "explanation": "Brief explanation of correct answer"
                }}
            ]
        }}
        """
        
        try:
            response = self.gemini_model.generate_content(prompt)
            
            # Parse response (would need proper JSON parsing in production)
            # For now, create reasonable defaults
            
            bullets = [
                f"This recipe demonstrates {len(steps)} key cooking steps",
                f"Contains {len(ingredients)} ingredients with various nutritional benefits",
                f"Provides approximately {nutrition_summary.total_calories or 'unknown'} calories total"
            ]
            
            # Add ingredient-specific learning points
            for ingredient in ingredients[:3]:  # Top 3 ingredients
                if ingredient.uses:
                    bullets.append(f"{ingredient.name.title()} is used for {', '.join(ingredient.uses[:2])}")
            
            # Create quiz questions
            quiz_questions = [
                QuizQuestion(
                    question=f"What is the main ingredient in {recipe_title.text}?",
                    options=[
                        ingredients[0].name if ingredients else "Unknown",
                        "Salt", "Water", "Oil"
                    ],
                    correct_answer=0,
                    explanation=f"The recipe features {ingredients[0].name if ingredients else 'various ingredients'} as a key component."
                ),
                QuizQuestion(
                    question="How many cooking steps does this recipe have?",
                    options=[str(len(steps)), str(len(steps)+1), str(len(steps)-1), str(len(steps)+2)],
                    correct_answer=0,
                    explanation=f"The recipe has {len(steps)} distinct cooking steps."
                ),
                QuizQuestion(
                    question="What is the estimated serving size?",
                    options=[
                        str(nutrition_summary.servings or 2),
                        str((nutrition_summary.servings or 2) + 1),
                        str((nutrition_summary.servings or 2) - 1),
                        "Unknown"
                    ],
                    correct_answer=0,
                    explanation=f"The recipe serves approximately {nutrition_summary.servings or 2} people."
                )
            ]
            
            return LearnerPack(
                bullets=bullets[:6],  # Limit to 6 bullets
                quiz=quiz_questions,
                difficulty_level="beginner"
            )
            
        except Exception as e:
            print(f"Failed to generate learner pack: {e}")
            
            # Return basic fallback
            return LearnerPack(
                bullets=[
                    f"Recipe: {recipe_title.text}",
                    f"Contains {len(ingredients)} ingredients",
                    f"Has {len(steps)} cooking steps"
                ],
                quiz=[
                    QuizQuestion(
                        question="What type of content is this?",
                        options=["Recipe", "Story", "News", "Tutorial"],
                        correct_answer=0,
                        explanation="This is a cooking recipe analysis."
                    )
                ]
            )
    
    async def _generate_human_summary(self,
                                    recipe_title: RecipeTitle,
                                    steps: List[CookingStep],
                                    ingredients: List[Ingredient],
                                    nutrition_summary: NutritionSummary,
                                    authenticity_score: int,
                                    completeness_score: int) -> str:
        """Generate human-readable markdown summary"""
        
        summary_data = {
            "title": recipe_title.text,
            "steps_count": len(steps),
            "ingredients_count": len(ingredients),
            "calories": nutrition_summary.total_calories,
            "servings": nutrition_summary.servings,
            "authenticity": authenticity_score,
            "completeness": completeness_score
        }
        
        prompt = f"""
        Write a concise, engaging paragraph summary of this recipe analysis:
        
        DATA: {json.dumps(summary_data, indent=2)}
        
        The summary should:
        - Be 3-4 sentences long
        - Mention the recipe name and key characteristics
        - Include authenticity and completeness scores
        - Be written for a general audience
        - Sound natural and informative
        
        Return just the paragraph text, no markdown formatting.
        """
        
        try:
            response = self.gemini_model.generate_content(prompt)
            return f"### Recipe Analysis Summary\n\n{response.text.strip()}"
            
        except Exception as e:
            print(f"Failed to generate human summary: {e}")
            
            # Return basic fallback
            return f"""### Recipe Analysis Summary

This cooking video analysis identified "{recipe_title.text}" with {len(steps)} cooking steps and {len(ingredients)} ingredients. The recipe achieved an authenticity score of {authenticity_score}% and completeness score of {completeness_score}%, providing {nutrition_summary.total_calories or 'estimated'} total calories for {nutrition_summary.servings or 2} servings. The analysis includes detailed ingredient information, cooking techniques, and nutritional data to help preserve and share this culinary knowledge."""