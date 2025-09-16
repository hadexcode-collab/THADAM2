import json
import os
from datetime import datetime
from typing import Dict, List, Any, Optional
import uuid

class Database:
    """Simple file-based database for demo purposes"""
    
    def __init__(self):
        self.data_dir = "data"
        self.submissions_file = os.path.join(self.data_dir, "submissions.json")
        self.packs_file = os.path.join(self.data_dir, "packs.json")
        self.users_file = os.path.join(self.data_dir, "users.json")
    
    async def initialize(self):
        """Initialize database files"""
        os.makedirs(self.data_dir, exist_ok=True)
        
        # Initialize files if they don't exist
        for file_path in [self.submissions_file, self.packs_file, self.users_file]:
            if not os.path.exists(file_path):
                with open(file_path, 'w') as f:
                    json.dump({}, f)
    
    async def create_submission(self, submission_data: Dict[str, Any]) -> str:
        """Create a new content submission"""
        submissions = await self._load_json(self.submissions_file)
        
        submission_id = submission_data["id"]
        submissions[submission_id] = {
            **submission_data,
            "created_at": datetime.utcnow().isoformat()
        }
        
        await self._save_json(self.submissions_file, submissions)
        return submission_id
    
    async def get_submission(self, submission_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific submission by ID"""
        submissions = await self._load_json(self.submissions_file)
        return submissions.get(submission_id)
    
    async def update_submission_status(
        self, 
        submission_id: str, 
        status: str, 
        metadata: Optional[Dict[str, Any]] = None
    ):
        """Update submission status"""
        submissions = await self._load_json(self.submissions_file)
        
        if submission_id in submissions:
            submissions[submission_id]["status"] = status
            submissions[submission_id]["updated_at"] = datetime.utcnow().isoformat()
            
            if status == "verified":
                submissions[submission_id]["verified_at"] = datetime.utcnow().isoformat()
            
            if metadata:
                submissions[submission_id].update(metadata)
            
            await self._save_json(self.submissions_file, submissions)
    
    async def update_submission_authenticity(
        self, 
        submission_id: str, 
        score: float, 
        claims: List[Dict[str, Any]], 
        sources: List[Dict[str, Any]]
    ):
        """Update submission with authenticity results"""
        submissions = await self._load_json(self.submissions_file)
        
        if submission_id in submissions:
            submissions[submission_id].update({
                "authenticity_score": score,
                "claims": claims,
                "sources": sources,
                "authenticity_updated_at": datetime.utcnow().isoformat()
            })
            
            await self._save_json(self.submissions_file, submissions)
    
    async def update_submission_pack_id(self, submission_id: str, pack_id: str):
        """Link a pack to a submission"""
        submissions = await self._load_json(self.submissions_file)
        
        if submission_id in submissions:
            submissions[submission_id]["pack_id"] = pack_id
            submissions[submission_id]["pack_created_at"] = datetime.utcnow().isoformat()
            
            await self._save_json(self.submissions_file, submissions)
    
    async def get_user_submissions(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all submissions for a user"""
        submissions = await self._load_json(self.submissions_file)
        
        # For demo, return all submissions
        # In production, you'd filter by user_id
        return [
            {
                "id": sub_id,
                "title": sub_data.get("title"),
                "category": sub_data.get("category"),
                "status": sub_data.get("status"),
                "authenticity_score": sub_data.get("authenticity_score"),
                "uploaded_at": sub_data.get("uploaded_at"),
                "verified_at": sub_data.get("verified_at"),
                "pack_id": sub_data.get("pack_id")
            }
            for sub_id, sub_data in submissions.items()
        ]
    
    async def create_learning_pack(self, submission_id: str, pack_data: Dict[str, Any]) -> str:
        """Create a new learning pack from verified content"""
        packs = await self._load_json(self.packs_file)
        
        pack_id = str(uuid.uuid4())
        
        # Generate comprehensive pack structure
        pack = {
            "id": pack_id,
            "submission_id": submission_id,
            "title": pack_data.get("title", "Cultural Learning Pack"),
            "category": pack_data.get("category", "General"),
            "description": pack_data.get("description", "Learn about Tamil culture"),
            "authenticity_score": pack_data.get("authenticity_score", 80),
            "difficulty": self._determine_difficulty(pack_data.get("category", "")),
            "duration": "2-3 hours",
            "learners_count": 0,
            "uploader_attribution": pack_data.get("uploader_attribution", "Anonymous"),
            "created_at": datetime.utcnow().isoformat(),
            
            # Generated learning structure
            "learning_objectives": self._generate_learning_objectives(pack_data),
            "learning_steps": self._generate_learning_steps(pack_data),
            "quiz_questions": self._generate_quiz_questions(pack_data),
            "references": self._generate_references(pack_data),
            
            # Medical disclaimer for traditional medicine
            "medical_disclaimer": pack_data.get("category") == "Traditional Medicine"
        }
        
        packs[pack_id] = pack
        await self._save_json(self.packs_file, packs)
        
        return pack_id
    
    async def get_pack(self, pack_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific learning pack"""
        packs = await self._load_json(self.packs_file)
        return packs.get(pack_id)
    
    async def get_all_packs(self) -> List[Dict[str, Any]]:
        """Get all available learning packs"""
        packs = await self._load_json(self.packs_file)
        
        return [
            {
                "id": pack_id,
                "title": pack_data.get("title"),
                "category": pack_data.get("category"),
                "description": pack_data.get("description"),
                "authenticity_score": pack_data.get("authenticity_score"),
                "difficulty": pack_data.get("difficulty"),
                "duration": pack_data.get("duration"),
                "learners_count": pack_data.get("learners_count", 0),
                "created_at": pack_data.get("created_at"),
                "uploader_attribution": pack_data.get("uploader_attribution")
            }
            for pack_id, pack_data in packs.items()
        ]
    
    def _determine_difficulty(self, category: str) -> str:
        """Determine difficulty level based on category"""
        advanced_categories = ["Traditional Medicine", "Religious Rituals"]
        intermediate_categories = ["Tamil Classical Dance", "Musical Heritage"]
        
        if category in advanced_categories:
            return "Advanced"
        elif category in intermediate_categories:
            return "Intermediate"
        else:
            return "Beginner"
    
    def _generate_learning_objectives(self, pack_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate learning objectives based on content"""
        category = pack_data.get("category", "")
        
        objectives_map = {
            "Tamil Classical Dance": [
                {"id": "1", "title": "Master Basic Postures", "description": "Learn fundamental standing and sitting positions"},
                {"id": "2", "title": "Understand Hand Gestures", "description": "Practice essential mudras and hastas"},
                {"id": "3", "title": "Coordinate Movement", "description": "Synchronize hand, foot, and eye movements"}
            ],
            "Traditional Medicine": [
                {"id": "1", "title": "Understand Principles", "description": "Learn the foundational concepts of traditional medicine"},
                {"id": "2", "title": "Identify Herbs", "description": "Recognize common medicinal plants and their properties"},
                {"id": "3", "title": "Safety Practices", "description": "Understand proper dosages and contraindications"}
            ]
        }
        
        return objectives_map.get(category, [
            {"id": "1", "title": "Understand Context", "description": "Learn the cultural significance"},
            {"id": "2", "title": "Practice Application", "description": "Apply knowledge in real scenarios"},
            {"id": "3", "title": "Preserve Tradition", "description": "Contribute to cultural preservation"}
        ])
    
    def _generate_learning_steps(self, pack_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate structured learning steps"""
        category = pack_data.get("category", "")
        title = pack_data.get("title", "")
        
        steps = [
            {
                "id": "1",
                "title": f"Introduction to {title}",
                "content": f"Learn about the cultural significance and history of {title.lower()}.",
                "type": "text",
                "duration": "15 minutes"
            },
            {
                "id": "2",
                "title": "Historical Context",
                "content": "Understand the origins and evolution of this cultural practice through the ages.",
                "type": "video",
                "duration": "20 minutes"
            },
            {
                "id": "3",
                "title": "Practical Application",
                "content": "Learn the practical aspects and techniques involved.",
                "type": "activity",
                "duration": "30 minutes"
            },
            {
                "id": "4",
                "title": "Modern Relevance",
                "content": "Explore how this tradition remains relevant in contemporary times.",
                "type": "text",
                "duration": "10 minutes"
            }
        ]
        
        return steps
    
    def _generate_quiz_questions(self, pack_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate quiz questions based on content"""
        category = pack_data.get("category", "")
        
        questions_map = {
            "Tamil Classical Dance": [
                {
                    "id": "1",
                    "question": "What is the fundamental standing position in Bharatanatyam called?",
                    "options": ["Araimandi", "Muzhumandi", "Nattu", "Mandal"],
                    "correct_answer": 0
                },
                {
                    "id": "2",
                    "question": "Which temple is considered the birthplace of Bharatanatyam?",
                    "options": ["Meenakshi Temple", "Brihadeeswarar Temple", "Nataraja Temple", "Kapaleeshwarar Temple"],
                    "correct_answer": 2
                }
            ],
            "Traditional Medicine": [
                {
                    "id": "1",
                    "question": "How many basic elements are there in Siddha medicine?",
                    "options": ["3", "5", "7", "9"],
                    "correct_answer": 1
                },
                {
                    "id": "2",
                    "question": "What should you do before using any traditional medicine?",
                    "options": ["Use immediately", "Consult a qualified practitioner", "Mix with modern medicine", "Share with others"],
                    "correct_answer": 1
                }
            ]
        }
        
        return questions_map.get(category, [
            {
                "id": "1",
                "question": f"What is the cultural significance of this {category.lower()}?",
                "options": ["Religious", "Educational", "Entertainment", "All of the above"],
                "correct_answer": 3
            },
            {
                "id": "2",
                "question": "Why is it important to preserve traditional knowledge?",
                "options": ["Historical value", "Cultural identity", "Educational benefit", "All of the above"],
                "correct_answer": 3
            }
        ])
    
    def _generate_references(self, pack_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate reference sources"""
        category = pack_data.get("category", "")
        
        return [
            {
                "id": "1",
                "title": f"{category} - Wikipedia",
                "source": "Wikipedia",
                "url": f"https://en.wikipedia.org/wiki/{category.replace(' ', '_')}",
                "reliability_score": 85
            },
            {
                "id": "2",
                "title": f"Tamil Cultural Heritage",
                "source": "Government of Tamil Nadu",
                "reliability_score": 95
            },
            {
                "id": "3",
                "title": f"Academic Research on {category}",
                "source": "Academic Journal",
                "reliability_score": 90
            }
        ]
    
    async def _load_json(self, file_path: str) -> Dict[str, Any]:
        """Load JSON data from file"""
        try:
            with open(file_path, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return {}
    
    async def _save_json(self, file_path: str, data: Dict[str, Any]):
        """Save JSON data to file"""
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=2, default=str)