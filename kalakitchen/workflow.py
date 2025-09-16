"""
KalaKitchen Main Workflow - Orchestrates the complete video analysis pipeline
"""
import asyncio
import time
from pathlib import Path
from typing import Dict, Any, Optional
from .models import ProcessingStatus, RecipeAnalysisReport, VideoMetadata
from .bots.video_ingest import VideoIngestBot
from .bots.asr import ASRBot
from .bots.keyframe import KeyframeBot
from .bots.claim_extractor import ClaimExtractor
from .bots.web_enricher import WebEnricher
from .bots.quantity_resolver import QuantityResolver
from .bots.nutrition_mapper import NutritionMapper
from .bots.report_generator import ReportGenerator

class KalaKitchenWorkflow:
    def __init__(self):
        self.video_ingest = VideoIngestBot()
        self.asr = ASRBot()
        self.keyframe = KeyframeBot()
        self.claim_extractor = ClaimExtractor()
        self.quantity_resolver = QuantityResolver()
        self.nutrition_mapper = NutritionMapper()
        self.report_generator = ReportGenerator()
        
        # Status tracking
        self.processing_status: Dict[str, ProcessingStatus] = {}
    
    async def analyze_video(self,
                          video_file: bytes,
                          filename: str,
                          language: str = "en",
                          region: str = "US") -> str:
        """
        Start video analysis workflow and return video_id for status tracking
        """
        start_time = time.time()
        
        try:
            # Step 1: Video Ingestion
            video_id, metadata = await self.video_ingest.process_video(
                video_file, filename, language, region
            )
            
            # Initialize status tracking
            self.processing_status[video_id] = ProcessingStatus(
                video_id=video_id,
                status="processing",
                progress=0,
                current_stage="Video ingestion completed",
                started_at=metadata.upload_time
            )
            
            # Run analysis pipeline asynchronously
            asyncio.create_task(self._run_analysis_pipeline(video_id, metadata, start_time))
            
            return video_id
            
        except Exception as e:
            # Create error status if video_id exists
            if 'video_id' in locals():
                self.processing_status[video_id] = ProcessingStatus(
                    video_id=video_id,
                    status="failed",
                    progress=0,
                    current_stage="Video ingestion failed",
                    error_message=str(e),
                    started_at=metadata.upload_time if 'metadata' in locals() else None
                )
            raise e
    
    async def _run_analysis_pipeline(self,
                                   video_id: str,
                                   metadata: VideoMetadata,
                                   start_time: float):
        """
        Run the complete analysis pipeline
        """
        try:
            # Step 2: Audio Transcription
            self._update_status(video_id, 15, "Transcribing audio...")
            proxy_path = self.video_ingest.get_proxy_path(video_id)
            transcript = await self.asr.transcribe_video(proxy_path)
            
            # Step 3: Keyframe Analysis
            self._update_status(video_id, 30, "Analyzing keyframes...")
            keyframes_path = self.video_ingest.get_keyframes_path(video_id)
            keyframes = await self.keyframe.analyze_keyframes(keyframes_path)
            
            # Step 4: Claim Extraction
            self._update_status(video_id, 45, "Extracting recipe claims...")
            claims = await self.claim_extractor.extract_claims(
                transcript, keyframes, metadata.duration_seconds, 
                metadata.language, metadata.region
            )
            
            # Step 5: Quantity Resolution
            self._update_status(video_id, 60, "Resolving ingredient quantities...")
            resolved_ingredients = await self.quantity_resolver.resolve_quantities(
                claims["ingredients"], transcript, keyframes
            )
            
            # Step 6: Web Enrichment
            self._update_status(video_id, 75, "Enriching with web data...")
            async with WebEnricher() as enricher:
                enriched_ingredients = await enricher.enrich_ingredients(resolved_ingredients)
            
            # Step 7: Nutrition Mapping
            self._update_status(video_id, 85, "Calculating nutrition...")
            nutrition_summary = self.nutrition_mapper.calculate_nutrition_summary(
                enriched_ingredients
            )
            
            # Step 8: Report Generation
            self._update_status(video_id, 95, "Generating final report...")
            
            # Collect all citations from enriched ingredients
            citations = []
            for ingredient in enriched_ingredients:
                for note in ingredient.medicinal_notes:
                    citations.extend(note.sources)
            
            processing_time = time.time() - start_time
            
            report = await self.report_generator.generate_report(
                recipe_title=claims["recipe_title"],
                duration_seconds=metadata.duration_seconds,
                steps=claims["steps"],
                ingredients=enriched_ingredients,
                tools=claims["tools"],
                nutrition_summary=nutrition_summary,
                citations=citations,
                processing_time=processing_time
            )
            
            # Add raw data for debugging
            report.raw_transcript = transcript
            report.raw_keyframes = keyframes
            
            # Step 9: Complete
            self._update_status(video_id, 100, "Analysis complete!")
            self.processing_status[video_id].status = "completed"
            self.processing_status[video_id].result = report
            self.processing_status[video_id].completed_at = metadata.upload_time
            
            # Cleanup temporary files
            self.video_ingest.cleanup_temp_files(video_id)
            
        except Exception as e:
            # Update status with error
            self.processing_status[video_id].status = "failed"
            self.processing_status[video_id].error_message = str(e)
            print(f"Analysis pipeline failed for video {video_id}: {e}")
    
    def _update_status(self, video_id: str, progress: int, stage: str):
        """Update processing status"""
        if video_id in self.processing_status:
            self.processing_status[video_id].progress = progress
            self.processing_status[video_id].current_stage = stage
    
    def get_status(self, video_id: str) -> Optional[ProcessingStatus]:
        """Get processing status for a video"""
        return self.processing_status.get(video_id)
    
    def get_result(self, video_id: str) -> Optional[RecipeAnalysisReport]:
        """Get analysis result for a completed video"""
        status = self.processing_status.get(video_id)
        if status and status.status == "completed":
            return status.result
        return None
    
    async def analyze_video_sync(self,
                               video_file: bytes,
                               filename: str,
                               language: str = "en",
                               region: str = "US") -> RecipeAnalysisReport:
        """
        Synchronous version that waits for complete analysis
        """
        video_id = await self.analyze_video(video_file, filename, language, region)
        
        # Wait for completion
        while True:
            status = self.get_status(video_id)
            if not status:
                raise Exception("Analysis status not found")
            
            if status.status == "completed":
                return status.result
            elif status.status == "failed":
                raise Exception(f"Analysis failed: {status.error_message}")
            
            # Wait before checking again
            await asyncio.sleep(1)