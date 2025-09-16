import re
from typing import Dict, Any, List
from datetime import datetime

class ModerationBot:
    """Bot responsible for content moderation and safety checks"""
    
    def __init__(self):
        # Content safety categories
        self.safety_categories = {
            "harmful_medical": [
                "dangerous", "poisonous", "toxic", "deadly", "fatal", "overdose", 
                "unsafe dosage", "without supervision", "instead of doctor"
            ],
            "inappropriate_content": [
                "explicit", "violent", "discriminatory", "hate speech", 
                "offensive", "inappropriate language"
            ],
            "misinformation_indicators": [
                "cure all diseases", "miracle cure", "guaranteed results", 
                "replaces all medicine", "no side effects", "instant healing"
            ],
            "cultural_insensitivity": [
                "primitive", "backward", "superstitious", "fake", "meaningless",
                "outdated", "useless", "stupid"
            ],
            "commercial_spam": [
                "buy now", "click here", "visit website", "purchase", 
                "discount", "offer", "sale", "money back"
            ]
        }
        
        # Medical content safety checks
        self.medical_safety_patterns = [
            r"take \d+ (grams?|mg|ml|cups?) of",  # Specific dosages without supervision
            r"stop taking your medication",
            r"instead of seeing a doctor",
            r"cure (cancer|diabetes|heart disease|aids|covid)",
            r"100% effective against"
        ]
        
        # Cultural sensitivity patterns
        self.sensitivity_patterns = [
            r"this is just (superstition|myth|folklore)",
            r"scientifically (proven wrong|false|incorrect)",
            r"modern medicine is better than"
        ]
    
    async def process(self, content: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """
        Moderate content for safety, appropriateness, and cultural sensitivity
        
        Args:
            content: Extracted text content to moderate
            metadata: Submission metadata
            
        Returns:
            Dictionary containing moderation results and recommendations
        """
        try:
            content_lower = content.lower()
            category = metadata.get('category', 'General')
            
            # Initialize moderation results
            moderation_result = {
                "flagged": False,
                "issues": [],
                "severity": "none",  # none, low, medium, high
                "category_specific_checks": [],
                "recommendations": [],
                "approved": True,
                "moderated_at": datetime.utcnow().isoformat()
            }
            
            # Run safety checks
            safety_issues = await self._check_content_safety(content_lower, category)
            moderation_result["issues"].extend(safety_issues)
            
            # Run cultural sensitivity checks
            sensitivity_issues = await self._check_cultural_sensitivity(content_lower, category)
            moderation_result["issues"].extend(sensitivity_issues)
            
            # Run category-specific checks
            category_issues = await self._check_category_specific(content_lower, category)
            moderation_result["category_specific_checks"] = category_issues
            moderation_result["issues"].extend(category_issues)
            
            # Check for spam/commercial content
            spam_issues = await self._check_spam_content(content_lower, metadata)
            moderation_result["issues"].extend(spam_issues)
            
            # Determine overall severity and flagging status
            moderation_result = self._assess_overall_moderation(moderation_result)
            
            # Generate recommendations
            moderation_result["recommendations"] = self._generate_recommendations(moderation_result, category)
            
            return moderation_result
            
        except Exception as e:
            return {
                "flagged": True,
                "error": f"Moderation process failed: {str(e)}",
                "issues": [{"type": "system_error", "severity": "high", "message": str(e)}],
                "severity": "high",
                "approved": False,
                "moderated_at": datetime.utcnow().isoformat()
            }
    
    async def _check_content_safety(self, content: str, category: str) -> List[Dict[str, Any]]:
        """Check for general content safety issues"""
        issues = []
        
        # Check harmful medical advice
        if category == "Traditional Medicine":
            for pattern in self.medical_safety_patterns:
                if re.search(pattern, content):
                    issues.append({
                        "type": "harmful_medical_advice",
                        "severity": "high",
                        "message": f"Potentially harmful medical advice detected: {pattern}",
                        "recommendation": "Requires medical expert review"
                    })
        
        # Check for dangerous content keywords
        for category_name, keywords in self.safety_categories.items():
            for keyword in keywords:
                if keyword in content:
                    severity = "high" if category_name == "harmful_medical" else "medium"
                    issues.append({
                        "type": category_name,
                        "severity": severity,
                        "message": f"Flagged content detected: {keyword}",
                        "keyword": keyword
                    })
        
        return issues
    
    async def _check_cultural_sensitivity(self, content: str, category: str) -> List[Dict[str, Any]]:
        """Check for cultural sensitivity issues"""
        issues = []
        
        # Check for culturally insensitive language
        insensitive_terms = self.safety_categories.get("cultural_insensitivity", [])
        for term in insensitive_terms:
            if term in content:
                issues.append({
                    "type": "cultural_insensitivity",
                    "severity": "medium",
                    "message": f"Potentially insensitive language: {term}",
                    "recommendation": "Consider more respectful terminology"
                })
        
        # Check sensitivity patterns
        for pattern in self.sensitivity_patterns:
            if re.search(pattern, content):
                issues.append({
                    "type": "cultural_sensitivity",
                    "severity": "medium", 
                    "message": f"Content may be culturally insensitive: {pattern}",
                    "recommendation": "Review for cultural respect and accuracy"
                })
        
        # Check for appropriate cultural context
        if not self._has_cultural_context(content, category):
            issues.append({
                "type": "missing_context",
                "severity": "low",
                "message": "Content lacks sufficient cultural context",
                "recommendation": "Add cultural background and significance"
            })
        
        return issues
    
    async def _check_category_specific(self, content: str, category: str) -> List[Dict[str, Any]]:
        """Run category-specific moderation checks"""
        issues = []
        
        if category == "Traditional Medicine":
            issues.extend(await self._check_medical_content(content))
        elif category == "Tamil Classical Dance":
            issues.extend(await self._check_dance_content(content))
        elif category == "Religious Rituals":
            issues.extend(await self._check_religious_content(content))
        
        return issues
    
    async def _check_medical_content(self, content: str) -> List[Dict[str, Any]]:
        """Specific checks for traditional medicine content"""
        issues = []
        
        # Check for proper medical disclaimers
        disclaimer_keywords = ["consult", "doctor", "physician", "expert", "qualified", "professional"]
        has_disclaimer = any(keyword in content for keyword in disclaimer_keywords)
        
        if not has_disclaimer:
            issues.append({
                "type": "missing_medical_disclaimer",
                "severity": "high",
                "message": "Traditional medicine content lacks proper disclaimers",
                "recommendation": "Add disclaimer about consulting qualified practitioners"
            })
        
        # Check for dangerous dosage instructions
        dosage_patterns = [
            r"\d+\s*(grams?|mg|ml|cups?|tablespoons?|teaspoons?)",
            r"take.*daily",
            r"consume.*times"
        ]
        
        for pattern in dosage_patterns:
            if re.search(pattern, content):
                issues.append({
                    "type": "specific_dosage_without_supervision", 
                    "severity": "high",
                    "message": "Specific dosages mentioned without professional supervision guidance",
                    "recommendation": "Remove specific dosages or add supervision requirements"
                })
                break
        
        # Check for overly broad medical claims
        broad_claims = [
            "cures all", "treats everything", "universal remedy", 
            "miracle medicine", "no side effects", "100% safe"
        ]
        
        for claim in broad_claims:
            if claim in content:
                issues.append({
                    "type": "exaggerated_medical_claims",
                    "severity": "medium",
                    "message": f"Exaggerated medical claim detected: {claim}",
                    "recommendation": "Use more measured language about traditional medicine benefits"
                })
        
        return issues
    
    async def _check_dance_content(self, content: str) -> List[Dict[str, Any]]:
        """Specific checks for dance-related content"""
        issues = []
        
        # Check for cultural appropriation warnings
        if "anyone can" in content and "traditional" in content:
            issues.append({
                "type": "cultural_appropriation_risk",
                "severity": "low",
                "message": "Content should emphasize respectful learning and cultural understanding",
                "recommendation": "Add guidance about respectful cultural engagement"
            })
        
        # Check for proper attribution to traditions
        if not any(term in content for term in ["traditional", "classical", "heritage", "guru", "lineage"]):
            issues.append({
                "type": "insufficient_traditional_context",
                "severity": "low",
                "message": "Dance content lacks traditional context",
                "recommendation": "Include information about traditional learning methods and cultural significance"
            })
        
        return issues
    
    async def _check_religious_content(self, content: str) -> List[Dict[str, Any]]:
        """Specific checks for religious/ritual content"""
        issues = []
        
        # Check for religious sensitivity
        insensitive_religious_terms = [
            "just ritual", "meaningless ceremony", "superstitious practice",
            "outdated belief", "primitive worship"
        ]
        
        for term in insensitive_religious_terms:
            if term in content:
                issues.append({
                    "type": "religious_insensitivity",
                    "severity": "high",
                    "message": f"Religiously insensitive language: {term}",
                    "recommendation": "Use respectful language when discussing religious practices"
                })
        
        # Check for proper context about religious significance
        if not any(term in content for term in ["sacred", "spiritual", "devotional", "faith", "belief"]):
            issues.append({
                "type": "missing_spiritual_context",
                "severity": "low",
                "message": "Religious content lacks spiritual context",
                "recommendation": "Include information about the spiritual significance of the practice"
            })
        
        return issues
    
    async def _check_spam_content(self, content: str, metadata: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Check for spam or commercial content"""
        issues = []
        
        # Check for commercial keywords
        commercial_keywords = self.safety_categories.get("commercial_spam", [])
        commercial_count = sum(1 for keyword in commercial_keywords if keyword in content)
        
        if commercial_count > 2:
            issues.append({
                "type": "commercial_spam",
                "severity": "medium",
                "message": f"Multiple commercial keywords detected ({commercial_count})",
                "recommendation": "Remove commercial content and focus on educational value"
            })
        
        # Check for suspicious links or contact information
        if re.search(r"(www\.|http|@|phone|call|contact)", content):
            issues.append({
                "type": "contact_information",
                "severity": "low",
                "message": "Contact information or links detected",
                "recommendation": "Remove personal contact information or commercial links"
            })
        
        return issues
    
    def _has_cultural_context(self, content: str, category: str) -> bool:
        """Check if content includes appropriate cultural context"""
        context_keywords = [
            "traditional", "cultural", "heritage", "tamil", "ancient",
            "significance", "meaning", "importance", "history", "origin"
        ]
        
        return sum(1 for keyword in context_keywords if keyword in content) >= 2
    
    def _assess_overall_moderation(self, moderation_result: Dict[str, Any]) -> Dict[str, Any]:
        """Assess overall moderation status based on individual issues"""
        issues = moderation_result["issues"]
        
        if not issues:
            moderation_result["severity"] = "none"
            moderation_result["flagged"] = False
            moderation_result["approved"] = True
            return moderation_result
        
        # Count issues by severity
        high_severity = len([issue for issue in issues if issue.get("severity") == "high"])
        medium_severity = len([issue for issue in issues if issue.get("severity") == "medium"])
        low_severity = len([issue for issue in issues if issue.get("severity") == "low"])
        
        # Determine overall severity and approval status
        if high_severity > 0:
            moderation_result["severity"] = "high"
            moderation_result["flagged"] = True
            moderation_result["approved"] = False
        elif medium_severity > 2:
            moderation_result["severity"] = "high"
            moderation_result["flagged"] = True
            moderation_result["approved"] = False
        elif medium_severity > 0:
            moderation_result["severity"] = "medium"
            moderation_result["flagged"] = True
            moderation_result["approved"] = False  # Manual review required
        elif low_severity > 3:
            moderation_result["severity"] = "medium"
            moderation_result["flagged"] = True
            moderation_result["approved"] = False
        else:
            moderation_result["severity"] = "low"
            moderation_result["flagged"] = False
            moderation_result["approved"] = True
        
        return moderation_result
    
    def _generate_recommendations(self, moderation_result: Dict[str, Any], category: str) -> List[str]:
        """Generate specific recommendations based on moderation results"""
        recommendations = []
        issues = moderation_result.get("issues", [])
        
        # General recommendations based on issue types
        issue_types = [issue.get("type") for issue in issues]
        
        if "harmful_medical_advice" in issue_types:
            recommendations.append("Add proper medical disclaimers and remove specific dosage instructions without professional supervision")
        
        if "cultural_insensitivity" in issue_types:
            recommendations.append("Review content for cultural sensitivity and use respectful language when discussing traditional practices")
        
        if "missing_context" in issue_types:
            recommendations.append("Add more cultural and historical context to help learners understand the significance of the practice")
        
        if "commercial_spam" in issue_types:
            recommendations.append("Remove commercial content and focus purely on educational value")
        
        # Category-specific recommendations
        if category == "Traditional Medicine":
            recommendations.append("Ensure all medical content includes appropriate disclaimers and emphasizes consultation with qualified practitioners")
        elif category == "Religious Rituals":
            recommendations.append("Maintain respectful tone when discussing religious practices and include spiritual context")
        elif category == "Tamil Classical Dance":
            recommendations.append("Emphasize the importance of proper training under qualified instructors and cultural respect")
        
        # If no issues, provide positive feedback
        if not issues:
            recommendations.append("Content meets moderation standards and demonstrates cultural sensitivity")
        
        return list(set(recommendations))  # Remove duplicates