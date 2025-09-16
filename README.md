# Thadam - Indian Cultural Knowledge Platform

**Thadam** (தடம் - "footprint" in Tamil) is a full-stack platform dedicated to preserving and authenticating Indian cultural knowledge including Tamil dances, traditional medicines, rituals, and cultural practices.

## 🚀 Features

- **Two User Roles**: Uploaders contribute content, Learners access verified cultural packs
- **ML Authentication Pipeline**: Multi-modal content verification with 0-100% authenticity scoring
- **Smart Pack Generation**: Auto-transforms verified content into structured learning materials
- **Cultural Ethics**: Consent-based uploads, proper attribution, medical disclaimers
- **Professional UI**: Dark-themed dashboard with modern design

## 🏗️ Architecture

```
thadam/
├── src/                    # Frontend (React + Tailwind)
│   ├── components/         # Reusable UI components
│   ├── pages/             # Main application pages
│   ├── services/          # API communication
│   └── utils/             # Helper functions
├── backend/               # FastAPI backend
│   ├── api/              # API endpoints
│   ├── bots/             # AI worker bots
│   ├── models/           # Database models
│   └── services/         # Business logic
└── tests/                # Unit tests
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+
- Python 3.9+
- Replit account (for deployment)

### Local Development

1. **Install Frontend Dependencies**
```bash
npm install
```

2. **Install Backend Dependencies**
```bash
pip install fastapi uvicorn python-multipart pillow python-magic
```

3. **Start Backend Server**
```bash
cd backend && python main.py
```

4. **Start Frontend Development Server**
```bash
npm run dev
```

### Replit Deployment

1. Fork this repository to Replit
2. Set environment variables in Replit secrets:
   - `DATABASE_URL` (optional, falls back to Replit DB)
   - `SECRET_KEY` for JWT authentication
3. Run the application - both frontend and backend will start automatically

## 🧪 Testing

Run the test suite:
```bash
python -m pytest tests/ -v
```

## 📊 Authenticity Scoring

- **≥80%**: Verified ✅ and published as learning pack
- **70-79%**: Held for manual review
- **<70%**: Rejected ❌

## 🤖 AI Bots

1. **RecognizerBot**: Detects content type and extracts text
2. **AuthenticatorBot**: Fact-checks claims against reliable sources
3. **PackGeneratorBot**: Creates structured learning materials
4. **ModerationBot**: Flags inappropriate or sensitive content

## 🔒 Privacy & Ethics

- User consent required before upload
- Proper attribution maintained
- Medical claims include safety disclaimers
- Cultural sensitivity respected

## 🌐 API Endpoints

- `POST /api/upload` - Upload cultural content
- `GET /api/verify/{submission_id}` - Check verification status
- `POST /api/pack/create` - Generate learning pack
- `GET /api/packs` - List available packs
- `GET /api/pack/{pack_id}` - Get pack details

## 🎯 Usage

1. **As an Uploader**: Sign in, upload cultural content with proper consent
2. **As a Learner**: Browse verified cultural packs and learn authenticated knowledge
3. **Content Verification**: Wait for AI pipeline to authenticate and score your submissions

## 🏆 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes with cultural sensitivity in mind
4. Submit pull request

## 📞 Support

For questions about Indian cultural practices or technical support, please create an issue.

---

*Preserving Tamil heritage through technology* 🕉️