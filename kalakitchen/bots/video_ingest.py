"""
VideoIngestBot - Handles video upload, validation, and preprocessing
"""
import os
import cv2
import uuid
import shutil
from pathlib import Path
from typing import Tuple, List
import ffmpeg
from ..models import VideoMetadata
from ..config import settings

class VideoIngestBot:
    def __init__(self):
        self.upload_dir = Path(settings.UPLOAD_DIR)
        self.temp_dir = Path(settings.TEMP_DIR)
        self.upload_dir.mkdir(exist_ok=True)
        self.temp_dir.mkdir(exist_ok=True)
    
    async def process_video(self, video_file: bytes, filename: str, 
                          language: str = "en", region: str = "US") -> Tuple[str, VideoMetadata]:
        """
        Process uploaded video file and extract metadata
        """
        # Generate unique video ID
        video_id = str(uuid.uuid4())
        
        # Save original video
        video_path = self.upload_dir / f"{video_id}_{filename}"
        with open(video_path, "wb") as f:
            f.write(video_file)
        
        # Validate video size
        file_size_mb = len(video_file) / (1024 * 1024)
        if file_size_mb > settings.MAX_VIDEO_SIZE_MB:
            raise ValueError(f"Video too large: {file_size_mb:.1f}MB > {settings.MAX_VIDEO_SIZE_MB}MB")
        
        # Extract video metadata using OpenCV
        cap = cv2.VideoCapture(str(video_path))
        fps = cap.get(cv2.CAP_PROP_FPS)
        frame_count = cap.get(cv2.CAP_PROP_FRAME_COUNT)
        duration = frame_count / fps if fps > 0 else 0
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        cap.release()
        
        # Validate duration
        if duration > settings.MAX_DURATION_MINUTES * 60:
            raise ValueError(f"Video too long: {duration/60:.1f}min > {settings.MAX_DURATION_MINUTES}min")
        
        # Create metadata
        metadata = VideoMetadata(
            filename=filename,
            duration_seconds=duration,
            fps=fps,
            resolution=f"{width}x{height}",
            language=language,
            region=region
        )
        
        # Generate keyframes
        await self._extract_keyframes(video_path, video_id, duration)
        
        # Create low-res proxy for model processing
        await self._create_proxy_video(video_path, video_id)
        
        return video_id, metadata
    
    async def _extract_keyframes(self, video_path: Path, video_id: str, duration: float):
        """Extract keyframes at regular intervals"""
        keyframes_dir = self.temp_dir / video_id / "keyframes"
        keyframes_dir.mkdir(parents=True, exist_ok=True)
        
        cap = cv2.VideoCapture(str(video_path))
        fps = cap.get(cv2.CAP_PROP_FPS)
        
        # Extract frames every N seconds
        interval_frames = int(fps * settings.KEYFRAME_INTERVAL_SECONDS)
        frame_count = 0
        saved_count = 0
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            if frame_count % interval_frames == 0:
                timestamp = frame_count / fps
                frame_filename = f"frame_{saved_count:04d}_{timestamp:.1f}s.jpg"
                frame_path = keyframes_dir / frame_filename
                cv2.imwrite(str(frame_path), frame)
                saved_count += 1
            
            frame_count += 1
        
        cap.release()
        print(f"Extracted {saved_count} keyframes for video {video_id}")
    
    async def _create_proxy_video(self, video_path: Path, video_id: str):
        """Create low-resolution proxy for model processing"""
        proxy_dir = self.temp_dir / video_id
        proxy_dir.mkdir(exist_ok=True)
        proxy_path = proxy_dir / "proxy.mp4"
        
        try:
            # Create 480p proxy with reduced bitrate
            (
                ffmpeg
                .input(str(video_path))
                .output(
                    str(proxy_path),
                    vf='scale=480:-2',
                    vcodec='libx264',
                    acodec='aac',
                    video_bitrate='500k',
                    audio_bitrate='64k'
                )
                .overwrite_output()
                .run(quiet=True)
            )
        except ffmpeg.Error as e:
            print(f"Error creating proxy video: {e}")
            # Fallback: copy original if proxy creation fails
            shutil.copy2(video_path, proxy_path)
    
    def get_keyframes_path(self, video_id: str) -> Path:
        """Get path to keyframes directory"""
        return self.temp_dir / video_id / "keyframes"
    
    def get_proxy_path(self, video_id: str) -> Path:
        """Get path to proxy video"""
        return self.temp_dir / video_id / "proxy.mp4"
    
    def cleanup_temp_files(self, video_id: str):
        """Clean up temporary files for a video"""
        temp_path = self.temp_dir / video_id
        if temp_path.exists():
            shutil.rmtree(temp_path)