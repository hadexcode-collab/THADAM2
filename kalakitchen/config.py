"""
KalaKitchen Configuration
"""
import os
from typing import List, Dict
from pydantic import BaseSettings

class Settings(BaseSettings):
    # API Keys
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # Video Processing
    MAX_VIDEO_SIZE_MB: int = 500
    KEYFRAME_INTERVAL_SECONDS: int = 5
    MAX_DURATION_MINUTES: int = 60
    
    # Model Settings
    GEMINI_MODEL: str = "gemini-1.5-pro"
    WHISPER_MODEL: str = "base"
    
    # Trusted Sources for Web Enrichment
    TRUSTED_DOMAINS: List[str] = [
        "fdc.nal.usda.gov",  # USDA FoodData Central
        "pubmed.ncbi.nlm.nih.gov",  # PubMed
        "nih.gov",  # NIH
        "who.int",  # WHO
        "wikipedia.org",  # Wikipedia (secondary)
        "nutritiondata.self.com",  # Nutrition Data
        "healthline.com",  # Healthline
        "extension.edu",  # University Extensions
        "gov",  # Government sites
    ]
    
    # Scoring Thresholds
    VERIFIED_AUTHENTICITY_THRESHOLD: int = 80
    VERIFIED_COMPLETENESS_THRESHOLD: int = 75
    REVIEW_AUTHENTICITY_THRESHOLD: int = 70
    
    # File Paths
    UPLOAD_DIR: str = "uploads"
    TEMP_DIR: str = "temp"
    OUTPUT_DIR: str = "outputs"
    
    class Config:
        env_file = ".env"

settings = Settings()

# Gemini Prompt Templates
GEMINI_PROMPTS = {
    "claim_extraction": """
You are an expert culinary analyst. Analyze this cooking video transcript and keyframe descriptions to extract structured recipe information.

TRANSCRIPT:
{transcript}

KEYFRAME DESCRIPTIONS:
{keyframes}

VIDEO METADATA:
- Duration: {duration} seconds
- Language: {language}
- Region: {region}

Extract the following information in JSON format:
1. Recipe title (if mentioned or visible)
2. Timestamped cooking steps with start/end times
3. Ingredients with quantities and units (mark as estimated if not explicit)
4. Tools and equipment used
5. Cooking techniques mentioned

Preserve original language terms and provide transliteration for non-Latin scripts.
For quantities not explicitly stated, estimate based on visual cues and mark as estimated.

Return structured JSON with confidence scores for each claim.
""",

    "web_enrichment": """
You are a nutrition and culinary research expert. For the ingredient "{ingredient}", search for and compile:

1. Nutritional information per 100g (calories, protein, fat, carbs, fiber, vitamins, minerals)
2. Medicinal/functional properties with scientific backing
3. Culinary uses and substitution suggestions
4. Cultural significance if applicable

Use only trusted sources: USDA FoodData Central, PubMed, NIH, WHO, academic journals, government nutrition databases.

Provide citations for all claims with URL, title, and relevant snippet.
Rate confidence of each claim 0-100 based on source quality and consensus.
""",

    "quantity_resolution": """
Analyze the following evidence to determine the most accurate quantity for ingredient "{ingredient}":

TRANSCRIPT EVIDENCE: {transcript_evidence}
OCR EVIDENCE: {ocr_evidence}
VISUAL EVIDENCE: {visual_evidence}
TYPICAL RECIPE AMOUNTS: {typical_amounts}

Provide:
1. Best estimate quantity with unit
2. Confidence level (0-100)
3. Whether this is estimated or explicit
4. Estimation method if estimated
5. Error margin if applicable

Consider cultural cooking practices and typical recipe proportions.
""",

    "report_generation": """
Generate a comprehensive cooking video analysis report based on the following data:

EXTRACTED CLAIMS: {claims}
ENRICHMENT DATA: {enrichment}
NUTRITION DATA: {nutrition}
CONFIDENCE SCORES: {confidence}

Create:
1. Human-readable markdown summary (1 paragraph)
2. Learner pack with 3-6 key learning points
3. Quiz with 3 multiple choice questions
4. Overall authenticity and completeness scores
5. List of missing fields
6. Status recommendation (Verified/Review/Not Verified)

Include proper medical disclaimer for any health claims.
Maintain cultural sensitivity and preserve original terminology.
"""
}