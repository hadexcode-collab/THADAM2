"""
ASRBot - Handles audio transcription using Whisper or Gemini
"""
import whisper
import ffmpeg
from pathlib import Path
from typing import List
import google.generativeai as genai
from ..models import TranscriptSegment
from ..config import settings

class ASRBot:
    def __init__(self):
        # Initialize Whisper model
        self.whisper_model = whisper.load_model(settings.WHISPER_MODEL)
        
        # Configure Gemini
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.gemini_model = genai.GenerativeModel(settings.GEMINI_MODEL)
    
    async def transcribe_video(self, video_path: Path, use_gemini: bool = False) -> List[TranscriptSegment]:
        """
        Transcribe video audio to timestamped text
        """
        # Extract audio from video
        audio_path = video_path.parent / f"{video_path.stem}_audio.wav"
        
        try:
            # Extract audio using ffmpeg
            (
                ffmpeg
                .input(str(video_path))
                .output(str(audio_path), acodec='pcm_s16le', ac=1, ar='16000')
                .overwrite_output()
                .run(quiet=True)
            )
            
            if use_gemini:
                return await self._transcribe_with_gemini(audio_path)
            else:
                return await self._transcribe_with_whisper(audio_path)
                
        finally:
            # Clean up audio file
            if audio_path.exists():
                audio_path.unlink()
    
    async def _transcribe_with_whisper(self, audio_path: Path) -> List[TranscriptSegment]:
        """Transcribe using Whisper model"""
        result = self.whisper_model.transcribe(
            str(audio_path),
            word_timestamps=True,
            verbose=False
        )
        
        segments = []
        for segment in result["segments"]:
            segments.append(TranscriptSegment(
                start=segment["start"],
                end=segment["end"],
                text=segment["text"].strip(),
                confidence=segment.get("avg_logprob", 0.0) * 100  # Convert to 0-100 scale
            ))
        
        return segments
    
    async def _transcribe_with_gemini(self, audio_path: Path) -> List[TranscriptSegment]:
        """Transcribe using Gemini model"""
        try:
            # Upload audio file to Gemini
            audio_file = genai.upload_file(str(audio_path))
            
            prompt = """
            Transcribe this audio file and provide timestamped segments.
            Return the result as a JSON array with objects containing:
            - start: start time in seconds
            - end: end time in seconds  
            - text: transcribed text
            - confidence: confidence score 0-100
            
            Focus on cooking-related terminology and preserve any non-English food terms.
            """
            
            response = self.gemini_model.generate_content([prompt, audio_file])
            
            # Parse Gemini response (would need proper JSON parsing)
            # For now, return a placeholder - in production, parse the JSON response
            segments = [
                TranscriptSegment(
                    start=0.0,
                    end=10.0,
                    text="Gemini transcription placeholder",
                    confidence=85.0
                )
            ]
            
            return segments
            
        except Exception as e:
            print(f"Gemini transcription failed: {e}")
            # Fallback to Whisper
            return await self._transcribe_with_whisper(audio_path)
    
    def merge_segments(self, segments: List[TranscriptSegment], 
                      max_gap: float = 2.0) -> List[TranscriptSegment]:
        """
        Merge nearby segments to create more coherent text blocks
        """
        if not segments:
            return []
        
        merged = [segments[0]]
        
        for segment in segments[1:]:
            last_segment = merged[-1]
            
            # If gap is small, merge segments
            if segment.start - last_segment.end <= max_gap:
                merged[-1] = TranscriptSegment(
                    start=last_segment.start,
                    end=segment.end,
                    text=f"{last_segment.text} {segment.text}",
                    confidence=min(last_segment.confidence, segment.confidence)
                )
            else:
                merged.append(segment)
        
        return merged