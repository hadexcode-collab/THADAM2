"""
KalaKitchen Data Models
"""
from typing import List, Dict, Optional, Any, Union
from pydantic import BaseModel, Field
from datetime import datetime

class VideoMetadata(BaseModel):
    filename: str
    duration_seconds: float
    fps: float
    resolution: str
    language: str = "en"
    region: str = "US"
    upload_time: datetime = Field(default_factory=datetime.now)

class TranscriptSegment(BaseModel):
    start: float
    end: float
    text: str
    confidence: float

class KeyframeData(BaseModel):
    frame_id: str
    timestamp: float
    ocr_text: List[str]
    objects_detected: List[str]
    description: str

class MediaReference(BaseModel):
    type: str  # "transcript", "ocr", "frame"
    frame: Optional[str] = None
    snippet: Optional[str] = None
    time: Optional[float] = None

class Source(BaseModel):
    url: str
    title: str
    snippet: str
    domain: str
    confidence: int = Field(ge=0, le=100)

class MedicinalNote(BaseModel):
    claim: str
    sources: List[Source]
    confidence: int = Field(ge=0, le=100)

class NutritionPer100g(BaseModel):
    calories: Optional[float] = None
    protein_g: Optional[float] = None
    fat_g: Optional[float] = None
    carbs_g: Optional[float] = None
    fiber_g: Optional[float] = None
    sugar_g: Optional[float] = None
    sodium_mg: Optional[float] = None
    potassium_mg: Optional[float] = None
    vitamin_c_mg: Optional[float] = None
    iron_mg: Optional[float] = None
    calcium_mg: Optional[float] = None

class Ingredient(BaseModel):
    name: str
    original_text: str
    quantity: Optional[float] = None
    unit: Optional[str] = None
    quantity_in_grams: Optional[float] = None
    estimated: bool = False
    estimation_method: Optional[str] = None
    uses: List[str] = []
    medicinal_notes: List[MedicinalNote] = []
    nutrition_per_100g: Optional[NutritionPer100g] = None
    provenance: List[MediaReference] = []
    substitutions: List[str] = []
    cultural_notes: Optional[str] = None

class CookingStep(BaseModel):
    index: int
    start: float
    end: float
    text: str
    confidence: int = Field(ge=0, le=100)
    media_refs: List[MediaReference] = []
    techniques: List[str] = []
    tools_used: List[str] = []

class RecipeTitle(BaseModel):
    text: str
    confidence: int = Field(ge=0, le=100)
    source: str  # "transcript", "ocr", "inferred"

class NutritionSummary(BaseModel):
    total_calories: Optional[float] = None
    total_protein_g: Optional[float] = None
    total_fat_g: Optional[float] = None
    total_carbs_g: Optional[float] = None
    servings: Optional[int] = None
    per_serving: Optional[Dict[str, float]] = None

class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_answer: int
    explanation: Optional[str] = None

class LearnerPack(BaseModel):
    bullets: List[str]
    quiz: List[QuizQuestion]
    difficulty_level: str = "beginner"  # beginner, intermediate, advanced

class RecipeAnalysisReport(BaseModel):
    # Core Recipe Data
    recipe_title: RecipeTitle
    duration_seconds: float
    steps: List[CookingStep]
    ingredients: List[Ingredient]
    tools: List[str]
    
    # Nutrition & Health
    nutrition_summary: NutritionSummary
    
    # Quality Metrics
    authenticity_score: int = Field(ge=0, le=100)
    completeness_score: int = Field(ge=0, le=100)
    missing_fields: List[str] = []
    status: str  # "Verified", "Review", "Not Verified"
    
    # Supporting Data
    citations: List[Source] = []
    
    # Educational Content
    learner_pack: LearnerPack
    human_summary_markdown: str
    
    # Metadata
    processing_time_seconds: Optional[float] = None
    model_version: str = "1.0"
    disclaimer: str = "This tool provides informational nutritional/medical data only. Consult a qualified health professional for medical advice."
    
    # Raw Data (for debugging)
    raw_transcript: Optional[List[TranscriptSegment]] = None
    raw_keyframes: Optional[List[KeyframeData]] = None

class ProcessingStatus(BaseModel):
    video_id: str
    status: str  # "processing", "completed", "failed"
    progress: int = Field(ge=0, le=100)
    current_stage: str
    error_message: Optional[str] = None
    started_at: datetime
    completed_at: Optional[datetime] = None
    result: Optional[RecipeAnalysisReport] = None