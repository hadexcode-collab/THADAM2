# 🍳 KalaKitchen - ML-Powered Cooking Video Analysis

KalaKitchen is a comprehensive ML workflow that analyzes cooking videos using **Gemini** as the primary multimodal reasoning model to extract structured recipe information, nutritional data, and educational content.

## 🎯 Features

- **🎥 Video Ingestion** - Process cooking videos with validation and preprocessing
- **🎤 Audio Transcription** - Extract timestamped speech using Whisper or Gemini ASR
- **🖼️ Keyframe Analysis** - OCR text extraction and object detection on video frames
- **🧠 AI Claim Extraction** - Use Gemini to extract structured recipe data from multimodal inputs
- **🌐 Web Enrichment** - Enhance ingredients with nutrition and medicinal data from trusted sources
- **⚖️ Quantity Resolution** - Merge evidence from multiple sources to determine accurate ingredient amounts
- **📊 Nutrition Mapping** - Calculate total and per-serving nutritional values
- **📋 Report Generation** - Create comprehensive analysis reports with educational content

## 🏗️ Architecture

```
Video Input → VideoIngestBot → ASRBot → KeyframeBot → ClaimExtractor
                                                           ↓
ReportGenerator ← NutritionMapper ← QuantityResolver ← WebEnricher
```

## 🚀 Quick Start

### Installation

```bash
pip install -r requirements.txt
```

### Environment Setup

Create a `.env` file:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

### CLI Usage

```bash
python -m kalakitchen.cli video.mp4 --language en --region US --output results.json
```

### API Server

```bash
python -m kalakitchen.api
```

Then upload videos to `http://localhost:8000/analyze`

### Python API

```python
from kalakitchen.workflow import KalaKitchenWorkflow

workflow = KalaKitchenWorkflow()

# Analyze video
with open("cooking_video.mp4", "rb") as f:
    video_content = f.read()

result = await workflow.analyze_video_sync(
    video_content, "cooking_video.mp4", language="en", region="US"
)

print(f"Recipe: {result.recipe_title.text}")
print(f"Authenticity Score: {result.authenticity_score}%")
```

## 📊 Output Schema

The system returns a comprehensive `RecipeAnalysisReport` with:

```json
{
  "recipe_title": {"text": "Chicken Curry", "confidence": 95},
  "duration_seconds": 180.5,
  "steps": [
    {
      "index": 1,
      "start": 12.3,
      "end": 45.2,
      "text": "Heat oil in a pan",
      "confidence": 90,
      "techniques": ["heating", "sautéing"]
    }
  ],
  "ingredients": [
    {
      "name": "turmeric",
      "original_text": "1 tsp turmeric",
      "quantity": 1,
      "unit": "tsp",
      "quantity_in_grams": 3.0,
      "estimated": false,
      "uses": ["anti-inflammatory", "coloring"],
      "medicinal_notes": [...],
      "nutrition_per_100g": {...}
    }
  ],
  "nutrition_summary": {
    "total_calories": 450,
    "servings": 2,
    "per_serving": {"calories": 225}
  },
  "authenticity_score": 85,
  "completeness_score": 78,
  "status": "Verified",
  "learner_pack": {
    "bullets": ["Key learning points..."],
    "quiz": [{"question": "...", "options": [...]}]
  }
}
```

## 🔧 Configuration

Key settings in `config.py`:

- **Video Processing**: Max size (500MB), duration (60min), keyframe interval (5s)
- **AI Models**: Gemini model version, Whisper model size
- **Scoring Thresholds**: Verification (80%+ authenticity, 75%+ completeness)
- **Trusted Sources**: USDA, PubMed, NIH, WHO, academic sources

## 🧪 Verification & Scoring

- **Authenticity Score**: Weighted average of claim confidences (50% in-video evidence, 50% web corroboration)
- **Completeness Score**: Percentage of mandatory fields present
- **Status Determination**:
  - ≥80% authenticity + ≥75% completeness → "Verified"
  - 70-79% authenticity → "Review"
  - <70% authenticity → "Not Verified"

## 🌐 Trusted Sources

Prioritized sources for web enrichment:
- **Nutrition**: USDA FoodData Central, government nutrition databases
- **Medical**: PubMed/NCBI, NIH, WHO, peer-reviewed journals
- **Culinary**: University extensions, cultural databases, Wikipedia (secondary)

## 🔒 Cultural Sensitivity

- Preserves original language terms with transliteration
- Respects cultural naming conventions
- Includes cultural significance and traditional uses
- Maintains proper attribution and context

## 📋 Requirements

- Python 3.8+
- OpenCV for video processing
- Whisper for audio transcription
- Tesseract for OCR
- Google Generative AI (Gemini)
- FastAPI for web server
- Various ML and data processing libraries

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

**Built with ❤️ for culinary knowledge preservation**