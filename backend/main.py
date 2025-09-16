from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.config import settings
from backend.utils.validators import validate_file_upload, validate_metadata
import os
import json
import uuid
from datetime import datetime
from typing import List, Dict, Any
import asyncio
from models.database import Database
from services.queue_manager import QueueManager
from bots.recognizer_bot import RecognizerBot
from bots.authenticator_bot import AuthenticatorBot
from bots.pack_generator_bot import PackGeneratorBot
from bots.moderation_bot import ModerationBot

app = FastAPI(
    title="Thadam API", 
    version="1.0.0",
    description="Indian Cultural Knowledge Preservation Platform"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
db = Database()
queue_manager = QueueManager()

# Initialize bots
recognizer_bot = RecognizerBot()
authenticator_bot = AuthenticatorBot()
pack_generator_bot = PackGeneratorBot()
moderation_bot = ModerationBot()

# Storage directory
UPLOAD_DIR = settings.UPLOAD_DIR
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.on_event("startup")
async def startup_event():
    """Initialize database and start background workers"""
    await db.initialize()
    
    # Start worker processes
    asyncio.create_task(process_queue())

async def process_queue():
    """Background worker to process verification queue"""
    while True:
        try:
            job = await queue_manager.get_job()
            if job:
                await process_verification_job(job)
        except Exception as e:
            print(f"Queue processing error: {e}")
        
        await asyncio.sleep(1)  # Poll every second

async def process_verification_job(job: Dict[str, Any]):
    """Process a single verification job through the bot pipeline"""
    submission_id = job["submission_id"]
    file_path = job["file_path"]
    metadata = job["metadata"]
    
    try:
        # Update status to processing
        await db.update_submission_status(submission_id, "processing")
        
        # Step 1: Content Recognition
        recognition_result = await recognizer_bot.process(file_path, metadata)
        extracted_text = recognition_result.get("extracted_text", "")
        content_type = recognition_result.get("content_type", "text")
        
        # Step 2: Moderation Check
        moderation_result = await moderation_bot.process(extracted_text, metadata)
        if moderation_result.get("flagged", False):
            await db.update_submission_status(
                submission_id, 
                "rejected",
                {"moderation_reason": moderation_result.get("reason", "Content flagged by moderation")}
            )
            return
        
        # Step 3: Authenticity Verification
        auth_result = await authenticator_bot.process(extracted_text, metadata)
        authenticity_score = auth_result.get("authenticity_score", 0)
        
        # Update submission with authenticity results
        await db.update_submission_authenticity(
            submission_id,
            authenticity_score,
            auth_result.get("claims", []),
            auth_result.get("sources", [])
        )
        
        # Step 4: Determine final status based on score
        if authenticity_score >= 80:
            # High score: Auto-approve and generate pack
            await db.update_submission_status(submission_id, "verified")
            
            # Generate learning pack
            pack_result = await pack_generator_bot.process(extracted_text, metadata, auth_result)
            if pack_result.get("success", False):
                pack_id = await db.create_learning_pack(
                    submission_id,
                    pack_result.get("pack_data", {})
                )
                await db.update_submission_pack_id(submission_id, pack_id)
                
        elif authenticity_score >= 70:
            # Medium score: Hold for review
            await db.update_submission_status(submission_id, "review")
            
        else:
            # Low score: Reject
            await db.update_submission_status(submission_id, "rejected")
            
    except Exception as e:
        print(f"Verification job failed for {submission_id}: {e}")
        await db.update_submission_status(
            submission_id, 
            "error",
            {"error_message": str(e)}
        )

@app.post("/api/upload")
async def upload_content(
    file: UploadFile = File(...),
    metadata: str = Form(...)
):
    """Upload cultural content for verification"""
    try:
        # Parse metadata
        metadata_dict = json.loads(metadata)
        
        # Validate metadata
        is_valid, error_msg = validate_metadata(metadata_dict)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error_msg)
        
        # Generate submission ID
        submission_id = str(uuid.uuid4())
        
        # Save uploaded file
        file_extension = os.path.splitext(file.filename)[1]
        file_path = os.path.join(UPLOAD_DIR, f"{submission_id}{file_extension}")
        
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Validate uploaded file
        is_valid, error_msg = validate_file_upload(file_path, len(content))
        if not is_valid:
            os.remove(file_path)  # Clean up invalid file
            raise HTTPException(status_code=400, detail=error_msg)
        
        # Create submission record
        submission_data = {
            "id": submission_id,
            "title": metadata_dict["title"],
            "category": metadata_dict["category"],
            "description": metadata_dict["description"],
            "attribution": metadata_dict["attribution"],
            "file_path": file_path,
            "file_type": file.content_type,
            "file_size": len(content),
            "status": "queued",
            "uploaded_at": datetime.utcnow().isoformat(),
            "medical_disclaimer": metadata_dict.get("medicalDisclaimer", False)
        }
        
        await db.create_submission(submission_data)
        
        # Add to verification queue
        await queue_manager.add_job({
            "submission_id": submission_id,
            "file_path": file_path,
            "metadata": metadata_dict
        })
        
        return {
            "success": True,
            "submission_id": submission_id,
            "message": "Content uploaded successfully and queued for verification"
        }
        
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid metadata format")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.get("/api/submissions")
async def get_user_submissions(user_id: str = "default_user"):
    """Get all submissions for a user"""
    try:
        submissions = await db.get_user_submissions(user_id)
        return submissions
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch submissions: {str(e)}")

@app.get("/api/verify/{submission_id}")
async def get_verification_status(submission_id: str):
    """Get verification status for a specific submission"""
    try:
        submission = await db.get_submission(submission_id)
        if not submission:
            raise HTTPException(status_code=404, detail="Submission not found")
        
        return {
            "id": submission_id,
            "status": submission.get("status"),
            "authenticity_score": submission.get("authenticity_score"),
            "verified_at": submission.get("verified_at"),
            "claims": submission.get("claims", []),
            "sources": submission.get("sources", [])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get verification status: {str(e)}")

@app.get("/api/packs")
async def get_cultural_packs():
    """Get all available verified cultural packs"""
    try:
        packs = await db.get_all_packs()
        return packs
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch packs: {str(e)}")

@app.get("/api/pack/{pack_id}")
async def get_cultural_pack(pack_id: str):
    """Get detailed information about a specific cultural pack"""
    try:
        pack = await db.get_pack(pack_id)
        if not pack:
            raise HTTPException(status_code=404, detail="Pack not found")
        
        return pack
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch pack: {str(e)}")

@app.post("/api/pack/create")
async def create_learning_pack(submission_id: str):
    """Manually trigger pack creation for a verified submission"""
    try:
        submission = await db.get_submission(submission_id)
        if not submission:
            raise HTTPException(status_code=404, detail="Submission not found")
        
        if submission.get("status") != "verified":
            raise HTTPException(status_code=400, detail="Submission must be verified first")
        
        if submission.get("pack_id"):
            raise HTTPException(status_code=400, detail="Pack already exists for this submission")
        
        # Read the uploaded file content
        file_path = submission.get("file_path")
        extracted_text = ""
        
        # This would normally come from the recognizer bot results
        # For demo purposes, we'll create a mock pack
        pack_data = {
            "title": submission.get("title"),
            "category": submission.get("category"),
            "description": submission.get("description"),
            "authenticity_score": submission.get("authenticity_score", 0),
            "uploader_attribution": submission.get("attribution")
        }
        
        pack_id = await db.create_learning_pack(submission_id, pack_data)
        await db.update_submission_pack_id(submission_id, pack_id)
        
        return {
            "success": True,
            "pack_id": pack_id,
            "message": "Learning pack created successfully"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create pack: {str(e)}")

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }

# Serve static files for uploaded content
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app, 
        host=settings.HOST, 
        port=settings.PORT,
        reload=settings.DEBUG
    )