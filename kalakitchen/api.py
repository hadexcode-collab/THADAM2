"""
KalaKitchen FastAPI Server
"""
from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import uvicorn
from .workflow import KalaKitchenWorkflow
from .models import ProcessingStatus, RecipeAnalysisReport

app = FastAPI(
    title="KalaKitchen API",
    description="ML-powered cooking video analysis",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize workflow
workflow = KalaKitchenWorkflow()

@app.post("/analyze", response_model=dict)
async def analyze_video(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    language: str = "en",
    region: str = "US"
):
    """
    Upload and analyze a cooking video
    """
    try:
        # Validate file
        if not file.content_type.startswith('video/'):
            raise HTTPException(status_code=400, detail="File must be a video")
        
        # Read file content
        video_content = await file.read()
        
        # Start analysis
        video_id = await workflow.analyze_video(
            video_content, file.filename, language, region
        )
        
        return {
            "success": True,
            "video_id": video_id,
            "message": "Video analysis started"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/status/{video_id}", response_model=ProcessingStatus)
async def get_status(video_id: str):
    """
    Get processing status for a video
    """
    status = workflow.get_status(video_id)
    if not status:
        raise HTTPException(status_code=404, detail="Video not found")
    
    return status

@app.get("/result/{video_id}", response_model=RecipeAnalysisReport)
async def get_result(video_id: str):
    """
    Get analysis result for a completed video
    """
    result = workflow.get_result(video_id)
    if not result:
        status = workflow.get_status(video_id)
        if not status:
            raise HTTPException(status_code=404, detail="Video not found")
        elif status.status == "processing":
            raise HTTPException(status_code=202, detail="Analysis still in progress")
        elif status.status == "failed":
            raise HTTPException(status_code=500, detail=f"Analysis failed: {status.error_message}")
        else:
            raise HTTPException(status_code=404, detail="Result not available")
    
    return result

@app.post("/analyze-sync", response_model=RecipeAnalysisReport)
async def analyze_video_sync(
    file: UploadFile = File(...),
    language: str = "en",
    region: str = "US"
):
    """
    Upload and analyze a cooking video synchronously (waits for completion)
    """
    try:
        # Validate file
        if not file.content_type.startswith('video/'):
            raise HTTPException(status_code=400, detail="File must be a video")
        
        # Read file content
        video_content = await file.read()
        
        # Run complete analysis
        result = await workflow.analyze_video_sync(
            video_content, file.filename, language, region
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "KalaKitchen"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)