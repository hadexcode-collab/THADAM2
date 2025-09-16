import pytest
import asyncio
import json
import os
from unittest.mock import AsyncMock, MagicMock
import sys
sys.path.append('backend')

from bots.recognizer_bot import RecognizerBot
from bots.authenticator_bot import AuthenticatorBot
from bots.pack_generator_bot import PackGeneratorBot
from bots.moderation_bot import ModerationBot
from models.database import Database

class TestThadamPlatform:
    """Unit tests for Thadam cultural knowledge platform"""
    
    @pytest.fixture
    def setup_test_data(self):
        """Setup test data for cultural content"""
        return {
            "bharatanatyam_content": {
                "title": "Bharatanatyam Basic Adavus",
                "category": "Tamil Classical Dance",
                "description": "Learn the fundamental steps and movements of Bharatanatyam, starting with basic adavus (dance units).",
                "attribution": "Guru Meera Krishnan, Kalakshetra",
                "consent": True,
                "text_content": """
                Bharatanatyam is a classical dance form that originated in Tamil Nadu. 
                The basic position is called Araimandi, where the dancer bends the knees outward while keeping the spine straight.
                The first adavu follows the Ta-Tha-Jhi-Mi rhythm pattern.
                This dance form combines rhythm, expression, melody, and storytelling.
                Traditional training follows the guru-disciple lineage system.
                """
            },
            "siddha_medicine_content": {
                "title": "Traditional Siddha Medicine Principles",
                "category": "Traditional Medicine", 
                "description": "Introduction to Siddha medicine principles and herbal preparations.",
                "attribution": "Dr. Rajesh Vaidyar, Siddha College",
                "consent": True,
                "text_content": """
                Siddha medicine is an ancient Tamil medical system based on five elements: earth, water, fire, air, and space.
                The three basic principles are Vatham, Pitham, and Kapham.
                Herbal preparations should always be prepared under qualified supervision.
                Consult a qualified Siddha practitioner before using any traditional medicines.
                This system emphasizes holistic health and natural healing methods.
                """
            }
        }

class TestContentUpload:
    """Test content upload functionality"""
    
    @pytest.mark.asyncio
    async def test_valid_content_upload(self, setup_test_data):
        """Test uploading valid cultural content"""
        test_data = setup_test_data["bharatanatyam_content"]
        
        # Simulate file upload
        file_path = "test_bharatanatyam.txt"
        with open(file_path, 'w') as f:
            f.write(test_data["text_content"])
        
        try:
            # Test basic validation
            assert test_data["consent"] == True
            assert test_data["title"] != ""
            assert test_data["category"] in ["Tamil Classical Dance", "Traditional Medicine", "Religious Rituals"]
            assert test_data["attribution"] != ""
            
            # Test file creation
            assert os.path.exists(file_path)
            
            # Test file content
            with open(file_path, 'r') as f:
                content = f.read()
            assert "Bharatanatyam" in content
            assert "Tamil Nadu" in content
            
        finally:
            # Cleanup
            if os.path.exists(file_path):
                os.remove(file_path)
    
    @pytest.mark.asyncio
    async def test_medical_content_consent(self, setup_test_data):
        """Test medical content requires additional consent"""
        medical_data = setup_test_data["siddha_medicine_content"]
        
        # Test medical disclaimer requirement
        assert medical_data["category"] == "Traditional Medicine"
        assert "qualified" in medical_data["text_content"].lower()
        assert "consult" in medical_data["text_content"].lower()

class TestAuthenticity:
    """Test authenticity verification system"""
    
    @pytest.mark.asyncio
    async def test_authenticity_scoring_thresholds(self, setup_test_data):
        """Test authenticity scoring meets threshold requirements"""
        authenticator = AuthenticatorBot()
        bharatanatyam_data = setup_test_data["bharatanatyam_content"]
        
        # Test authenticity verification
        result = await authenticator.process(
            bharatanatyam_data["text_content"], 
            bharatanatyam_data
        )
        
        # Verify result structure
        assert "authenticity_score" in result
        assert "claims" in result
        assert "sources" in result
        assert result["success"] == True
        
        # Test score is within valid range
        score = result["authenticity_score"]
        assert 0 <= score <= 100
        
        # Test threshold decisions
        if score >= 80:
            decision = "verified"
        elif score >= 70:
            decision = "review" 
        else:
            decision = "rejected"
        
        assert decision in ["verified", "review", "rejected"]
        
        # Test that cultural content should score reasonably well
        assert len(result["claims"]) > 0
        assert len(result["sources"]) > 0
    
    @pytest.mark.asyncio
    async def test_medical_authenticity_requirements(self, setup_test_data):
        """Test medical content has stricter authenticity requirements"""
        authenticator = AuthenticatorBot()
        medical_data = setup_test_data["siddha_medicine_content"]
        
        result = await authenticator.process(
            medical_data["text_content"],
            medical_data
        )
        
        # Medical content should have proper disclaimers in claims
        claims_text = " ".join([claim["text"] for claim in result["claims"]])
        assert any(keyword in claims_text.lower() for keyword in ["qualified", "supervision", "consult"])
        
        # Should have medical-related sources
        sources = result.get("sources", [])
        medical_source_found = any("medical" in source.get("title", "").lower() or 
                                 "siddha" in source.get("title", "").lower() 
                                 for source in sources)
        assert medical_source_found or len(sources) > 0

class TestPackGeneration:
    """Test learning pack generation"""
    
    @pytest.mark.asyncio
    async def test_pack_generation_structure(self, setup_test_data):
        """Test generated packs have required structure"""
        pack_generator = PackGeneratorBot()
        bharatanatyam_data = setup_test_data["bharatanatyam_content"]
        
        # Mock authentication result
        auth_result = {
            "authenticity_score": 85,
            "sources": [
                {
                    "title": "Bharatanatyam Wikipedia",
                    "source": "Wikipedia",
                    "url": "https://en.wikipedia.org/wiki/Bharatanatyam",
                    "reliability_score": 85
                }
            ]
        }
        
        result = await pack_generator.process(
            bharatanatyam_data["text_content"],
            bharatanatyam_data,
            auth_result
        )
        
        assert result["success"] == True
        pack_data = result["pack_data"]
        
        # Test required pack structure
        assert "title" in pack_data
        assert "category" in pack_data
        assert "learning_objectives" in pack_data
        assert "learning_steps" in pack_data
        assert "quiz_questions" in pack_data
        assert "references" in pack_data
        
        # Test learning objectives
        objectives = pack_data["learning_objectives"]
        assert len(objectives) >= 3
        assert len(objectives) <= 5
        for obj in objectives:
            assert "id" in obj
            assert "title" in obj
            assert "description" in obj
        
        # Test learning steps
        steps = pack_data["learning_steps"]
        assert len(steps) >= 3
        for step in steps:
            assert "id" in step
            assert "title" in step
            assert "content" in step
            assert "type" in step
            assert "duration" in step
        
        # Test quiz questions
        questions = pack_data["quiz_questions"]
        assert len(questions) >= 2
        assert len(questions) <= 5
        for question in questions:
            assert "id" in question
            assert "question" in question
            assert "options" in question
            assert "correct_answer" in question
            assert len(question["options"]) >= 3
            assert 0 <= question["correct_answer"] < len(question["options"])
    
    @pytest.mark.asyncio
    async def test_medical_pack_disclaimer(self, setup_test_data):
        """Test medical packs include proper disclaimers"""
        pack_generator = PackGeneratorBot()
        medical_data = setup_test_data["siddha_medicine_content"]
        
        auth_result = {"authenticity_score": 80, "sources": []}
        
        result = await pack_generator.process(
            medical_data["text_content"],
            medical_data,
            auth_result
        )
        
        pack_data = result["pack_data"]
        
        # Test medical disclaimer is present
        assert pack_data.get("medical_disclaimer") == True
        
        # Test learning content includes safety guidance
        steps_content = " ".join([step["content"] for step in pack_data["learning_steps"]])
        assert any(keyword in steps_content.lower() for keyword in 
                  ["professional", "qualified", "practitioner", "supervision"])

class TestModerationSystem:
    """Test content moderation system"""
    
    @pytest.mark.asyncio
    async def test_safe_content_passes_moderation(self, setup_test_data):
        """Test that safe cultural content passes moderation"""
        moderator = ModerationBot()
        bharatanatyam_data = setup_test_data["bharatanatyam_content"]
        
        result = await moderator.process(
            bharatanatyam_data["text_content"],
            bharatanatyam_data
        )
        
        # Safe content should not be flagged
        assert result["flagged"] == False
        assert result["approved"] == True
        assert result["severity"] in ["none", "low"]
    
    @pytest.mark.asyncio  
    async def test_harmful_medical_content_flagged(self):
        """Test that harmful medical advice gets flagged"""
        moderator = ModerationBot()
        
        harmful_content = """
        Take 50 grams of this herb daily without consulting anyone.
        This will cure cancer and diabetes guaranteed.
        Stop taking your prescribed medications immediately.
        """
        
        metadata = {
            "category": "Traditional Medicine",
            "title": "Dangerous Medical Advice"
        }
        
        result = await moderator.process(harmful_content, metadata)
        
        # Harmful content should be flagged
        assert result["flagged"] == True
        assert result["approved"] == False
        assert result["severity"] == "high"
        
        # Should have specific harmful medical issues
        issue_types = [issue["type"] for issue in result["issues"]]
        assert any("medical" in issue_type for issue_type in issue_types)
    
    @pytest.mark.asyncio
    async def test_culturally_insensitive_content_flagged(self):
        """Test that culturally insensitive content gets flagged"""
        moderator = ModerationBot()
        
        insensitive_content = """
        These primitive and backward superstitious practices are meaningless.
        Tamil culture is fake and useless compared to modern ways.
        """
        
        metadata = {
            "category": "Tamil Classical Dance", 
            "title": "Insensitive Content"
        }
        
        result = await moderator.process(insensitive_content, metadata)
        
        # Insensitive content should be flagged
        assert result["flagged"] == True
        assert result["severity"] in ["medium", "high"]
        
        # Should identify cultural insensitivity
        issue_types = [issue["type"] for issue in result["issues"]]
        assert "cultural_insensitivity" in issue_types

# Test runner configuration
if __name__ == "__main__":
    # Create test data fixture
    test_data = {
        "bharatanatyam_content": {
            "title": "Bharatanatyam Basic Adavus",
            "category": "Tamil Classical Dance",
            "description": "Learn the fundamental steps and movements of Bharatanatyam, starting with basic adavus (dance units).",
            "attribution": "Guru Meera Krishnan, Kalakshetra", 
            "consent": True,
            "text_content": """
            Bharatanatyam is a classical dance form that originated in Tamil Nadu. 
            The basic position is called Araimandi, where the dancer bends the knees outward while keeping the spine straight.
            The first adavu follows the Ta-Tha-Jhi-Mi rhythm pattern.
            This dance form combines rhythm, expression, melody, and storytelling.
            Traditional training follows the guru-disciple lineage system.
            """
        },
        "siddha_medicine_content": {
            "title": "Traditional Siddha Medicine Principles",
            "category": "Traditional Medicine",
            "description": "Introduction to Siddha medicine principles and herbal preparations.",
            "attribution": "Dr. Rajesh Vaidyar, Siddha College",
            "consent": True,
            "text_content": """
            Siddha medicine is an ancient Tamil medical system based on five elements: earth, water, fire, air, and space.
            The three basic principles are Vatham, Pitham, and Kapham.
            Herbal preparations should always be prepared under qualified supervision.
            Consult a qualified Siddha practitioner before using any traditional medicines.
            This system emphasizes holistic health and natural healing methods.
            """
        }
    }
    
    # Run individual test functions
    async def run_tests():
        print("🧪 Running Thadam Platform Tests...")
        
        # Test 1: Content Upload
        print("\n📤 Testing Content Upload...")
        try:
            upload_test = TestContentUpload()
            await upload_test.test_valid_content_upload(test_data)
            await upload_test.test_medical_content_consent(test_data)
            print("✅ Content upload tests passed")
        except Exception as e:
            print(f"❌ Content upload tests failed: {e}")
        
        # Test 2: Authenticity Verification
        print("\n🔍 Testing Authenticity Verification...")
        try:
            auth_test = TestAuthenticity()
            await auth_test.test_authenticity_scoring_thresholds(test_data)
            await auth_test.test_medical_authenticity_requirements(test_data)
            print("✅ Authenticity verification tests passed")
        except Exception as e:
            print(f"❌ Authenticity verification tests failed: {e}")
        
        # Test 3: Pack Generation
        print("\n📚 Testing Pack Generation...")
        try:
            pack_test = TestPackGeneration()
            await pack_test.test_pack_generation_structure(test_data)
            await pack_test.test_medical_pack_disclaimer(test_data)
            print("✅ Pack generation tests passed")
        except Exception as e:
            print(f"❌ Pack generation tests failed: {e}")
        
        # Test 4: Moderation System
        print("\n🛡️ Testing Moderation System...")
        try:
            mod_test = TestModerationSystem()
            await mod_test.test_safe_content_passes_moderation(test_data)
            await mod_test.test_harmful_medical_content_flagged()
            await mod_test.test_culturally_insensitive_content_flagged()
            print("✅ Moderation system tests passed")
        except Exception as e:
            print(f"❌ Moderation system tests failed: {e}")
        
        print("\n🎉 Test suite completed!")
    
    # Run the tests
    asyncio.run(run_tests())