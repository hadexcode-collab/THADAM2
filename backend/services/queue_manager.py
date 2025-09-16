import asyncio
from typing import Dict, Any, Optional
from datetime import datetime
import json

class QueueManager:
    """Simple in-memory queue manager for processing jobs"""
    
    def __init__(self):
        self.job_queue = asyncio.Queue()
        self.processing_jobs = {}
    
    async def add_job(self, job_data: Dict[str, Any]) -> str:
        """Add a new job to the processing queue"""
        job_id = job_data.get("submission_id", "unknown")
        
        job = {
            "id": job_id,
            "data": job_data,
            "created_at": datetime.utcnow().isoformat(),
            "status": "queued"
        }
        
        await self.job_queue.put(job)
        return job_id
    
    async def get_job(self) -> Optional[Dict[str, Any]]:
        """Get the next job from the queue"""
        try:
            job = await asyncio.wait_for(self.job_queue.get(), timeout=1.0)
            job["status"] = "processing"
            job["started_at"] = datetime.utcnow().isoformat()
            
            # Track processing job
            self.processing_jobs[job["id"]] = job
            
            return job["data"]
        except asyncio.TimeoutError:
            return None
    
    async def complete_job(self, job_id: str, result: Dict[str, Any] = None):
        """Mark a job as completed"""
        if job_id in self.processing_jobs:
            job = self.processing_jobs[job_id]
            job["status"] = "completed"
            job["completed_at"] = datetime.utcnow().isoformat()
            job["result"] = result or {}
            
            # Remove from processing list
            del self.processing_jobs[job_id]
    
    async def fail_job(self, job_id: str, error: str):
        """Mark a job as failed"""
        if job_id in self.processing_jobs:
            job = self.processing_jobs[job_id]
            job["status"] = "failed"
            job["failed_at"] = datetime.utcnow().isoformat()
            job["error"] = error
            
            # Remove from processing list
            del self.processing_jobs[job_id]
    
    async def get_queue_status(self) -> Dict[str, Any]:
        """Get current queue status"""
        return {
            "queued_jobs": self.job_queue.qsize(),
            "processing_jobs": len(self.processing_jobs),
            "processing_list": list(self.processing_jobs.keys())
        }