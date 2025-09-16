import json
import re
from typing import Dict, Any, List
import asyncio
from datetime import datetime

class AuthenticatorBot:
    """Bot responsible for fact-checking and authenticity verification"""
    
    def __init__(self):
        # Reliable source databases (in production, these would be APIs)
        self.reliable_sources = {
            "wikipedia": {
                "base_url": "https://en.wikipedia.org/wiki/",
                "reliability": 0.85,
                "categories": ["general", "history", "culture", "dance", "medicine"]
            },
            "gov_tn": {
                "base_url": "https://www.tn.gov.in/",
                "reliability": 0.95,
                "categories": ["official", "culture", "heritage"]
            },
            "kalakshetra": {
                "base_url": "https://kalakshetra.in/",
                "reliability": 0.92,
                "categories": ["dance", "music", "arts"]
            },
            "academic_journals": {
                "base_url": "academic_source",
                "reliability": 0.90,
                "categories": ["research", "medicine", "anthropology"]
            }
        }
        
        # Known cultural facts for verification
        self.cultural_knowledge_base = {
            "bharatanatyam": {
                "origin": "Tamil Nadu",
                "basic_positions": ["araimandi", "muzhumandi"],
                "elements": ["nritta", "nritya", "natya"],
                "temple_connection": True,
                "classical_status": True
            },
            "siddha_medicine": {
                "elements": ["earth", "water", "fire", "air", "space"],
                "principles": ["vatham", "pitham", "kapham"],
                "origin": "Tamil Nadu",
                "ancient": True,
                "requires_expertise": True
            },
            "tamil_culture": {
                "language_family": "Dravidian",
                "ancient_literature": ["tolkappiyam", "tirukkural"],
                "festivals": ["pongal", "thai_pusam"],
                "classical_arts": ["bharatanatyam", "carnatic_music"]
            }
        }
    
    async def process(self, extracted_text: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """
        Verify authenticity of cultural content through fact-checking
        
        Args:
            extracted_text: Text content to verify
            metadata: Submission metadata
            
        Returns:
            Dictionary containing authenticity score, verified claims, and sources
        """
        try:
            # Extract factual claims from content
            claims = await self._extract_claims(extracted_text, metadata)
            
            # Verify each claim against reliable sources
            verification_results = []
            for claim in claims:
                result = await self._verify_claim(claim, metadata.get('category', ''))
                verification_results.append(result)
            
            # Calculate overall authenticity score
            authenticity_score = self._calculate_authenticity_score(verification_results)
            
            # Generate source references
            sources = self._generate_source_references(verification_results, metadata)
            
            # Create detailed report
            report = self._generate_verification_report(
                claims, verification_results, authenticity_score, sources
            )
            
            return {
                "success": True,
                "authenticity_score": round(authenticity_score, 1),
                "claims": claims,
                "verification_results": verification_results,
                "sources": sources,
                "report": report,
                "verified_at": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Authenticity verification failed: {str(e)}",
                "authenticity_score": 0,
                "claims": [],
                "sources": [],
                "verified_at": datetime.utcnow().isoformat()
            }
    
    async def _extract_claims(self, text: str, metadata: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Extract verifiable factual claims from the content"""
        claims = []
        
        # Basic claim extraction based on content patterns
        category = metadata.get('category', '').lower()
        
        # Extract key statements and facts
        sentences = re.split(r'[.!?]+', text)
        
        for i, sentence in enumerate(sentences[:10]):  # Limit to first 10 sentences
            sentence = sentence.strip()
            if len(sentence) < 10:
                continue
            
            # Categorize claims based on content
            claim_type = self._categorize_claim(sentence, category)
            
            if claim_type:
                claims.append({
                    "id": f"claim_{i+1}",
                    "text": sentence,
                    "type": claim_type,
                    "category": category,
                    "confidence": 0.8
                })
        
        # Add specific claims based on title and description
        title_claims = self._extract_title_claims(metadata.get('title', ''), category)
        claims.extend(title_claims)
        
        return claims[:8]  # Return top 8 claims for verification
    
    def _categorize_claim(self, sentence: str, category: str) -> str:
        """Categorize the type of claim for targeted verification"""
        sentence_lower = sentence.lower()
        
        # Historical claims
        if any(word in sentence_lower for word in ['origin', 'ancient', 'traditional', 'century', 'period']):
            return 'historical'
        
        # Cultural practice claims
        if any(word in sentence_lower for word in ['dance', 'music', 'ritual', 'ceremony', 'festival']):
            return 'cultural_practice'
        
        # Medical claims
        if any(word in sentence_lower for word in ['medicine', 'treatment', 'cure', 'healing', 'herb']):
            return 'medical'
        
        # Technical claims
        if any(word in sentence_lower for word in ['technique', 'method', 'position', 'movement', 'step']):
            return 'technical'
        
        # Geographical claims
        if any(word in sentence_lower for word in ['tamil nadu', 'india', 'temple', 'region', 'place']):
            return 'geographical'
        
        return 'general'
    
    def _extract_title_claims(self, title: str, category: str) -> List[Dict[str, Any]]:
        """Extract implicit claims from the title"""
        claims = []
        title_lower = title.lower()
        
        # Check for specific cultural elements in title
        if 'bharatanatyam' in title_lower:
            claims.append({
                "id": "title_claim_bharatanatyam",
                "text": "Bharatanatyam is a classical dance form from Tamil Nadu",
                "type": "cultural_practice",
                "category": category,
                "confidence": 0.9
            })
        
        if 'siddha' in title_lower:
            claims.append({
                "id": "title_claim_siddha",
                "text": "Siddha medicine is a traditional Tamil medical system",
                "type": "medical",
                "category": category,
                "confidence": 0.9
            })
        
        return claims
    
    async def _verify_claim(self, claim: Dict[str, Any], category: str) -> Dict[str, Any]:
        """Verify a single claim against reliable sources"""
        claim_text = claim['text'].lower()
        claim_type = claim['type']
        
        # Simulate source checking (in production, this would make API calls)
        verification_score = 0.0
        supporting_sources = []
        contradicting_sources = []
        
        # Check against knowledge base
        kb_result = self._check_knowledge_base(claim_text, claim_type)
        if kb_result['found']:
            verification_score += kb_result['confidence'] * 0.4
            supporting_sources.extend(kb_result['sources'])
        
        # Simulate external source verification
        external_results = await self._simulate_external_verification(claim_text, claim_type, category)
        verification_score += external_results['score'] * 0.6
        supporting_sources.extend(external_results['sources'])
        
        # Cap at 1.0
        verification_score = min(verification_score, 1.0)
        
        return {
            "claim_id": claim['id'],
            "claim_text": claim['text'],
            "verification_score": round(verification_score, 2),
            "supporting_sources": supporting_sources,
            "contradicting_sources": contradicting_sources,
            "confidence": verification_score * 0.9,  # Slightly lower than verification score
            "verified_at": datetime.utcnow().isoformat()
        }
    
    def _check_knowledge_base(self, claim_text: str, claim_type: str) -> Dict[str, Any]:
        """Check claim against internal knowledge base"""
        found = False
        confidence = 0.0
        sources = []
        
        # Check for Bharatanatyam references
        if 'bharatanatyam' in claim_text:
            kb_data = self.cultural_knowledge_base['bharatanatyam']
            found = True
            confidence = 0.85
            sources.append({
                "type": "knowledge_base",
                "source": "Internal Cultural Database",
                "reliability": 0.85,
                "details": "Bharatanatyam knowledge verified"
            })
        
        # Check for Siddha medicine references
        elif 'siddha' in claim_text:
            kb_data = self.cultural_knowledge_base['siddha_medicine']
            found = True
            confidence = 0.80
            sources.append({
                "type": "knowledge_base", 
                "source": "Internal Medical Database",
                "reliability": 0.80,
                "details": "Siddha medicine knowledge verified"
            })
        
        # Check for Tamil cultural references
        elif any(term in claim_text for term in ['tamil', 'tamil nadu']):
            kb_data = self.cultural_knowledge_base['tamil_culture']
            found = True
            confidence = 0.75
            sources.append({
                "type": "knowledge_base",
                "source": "Internal Tamil Culture Database", 
                "reliability": 0.75,
                "details": "Tamil cultural knowledge verified"
            })
        
        return {
            "found": found,
            "confidence": confidence,
            "sources": sources
        }
    
    async def _simulate_external_verification(self, claim_text: str, claim_type: str, category: str) -> Dict[str, Any]:
        """Simulate verification against external sources"""
        # Simulate API delay
        await asyncio.sleep(0.1)
        
        score = 0.0
        sources = []
        
        # Simulate Wikipedia verification
        if claim_type in ['historical', 'cultural_practice', 'geographical']:
            wiki_score = self._simulate_wikipedia_check(claim_text)
            score += wiki_score * 0.3
            sources.append({
                "type": "external",
                "source": "Wikipedia",
                "url": f"https://en.wikipedia.org/wiki/{category.replace(' ', '_')}",
                "reliability": 0.85,
                "verification_score": wiki_score,
                "details": f"Wikipedia verification for {claim_type} claim"
            })
        
        # Simulate government source verification
        if 'tamil nadu' in claim_text or category in ['Traditional Medicine', 'Religious Rituals']:
            gov_score = 0.9  # High score for government sources
            score += gov_score * 0.25
            sources.append({
                "type": "external",
                "source": "Government of Tamil Nadu",
                "url": "https://www.tn.gov.in/cultural-heritage",
                "reliability": 0.95,
                "verification_score": gov_score,
                "details": "Official government cultural database"
            })
        
        # Simulate academic source verification
        if claim_type in ['medical', 'technical', 'historical']:
            academic_score = 0.85
            score += academic_score * 0.25
            sources.append({
                "type": "external",
                "source": "Academic Research",
                "url": "academic_database",
                "reliability": 0.90,
                "verification_score": academic_score,
                "details": "Peer-reviewed academic research"
            })
        
        # Simulate specialized source verification
        if 'bharatanatyam' in claim_text or 'dance' in claim_text:
            kalakshetra_score = 0.95
            score += kalakshetra_score * 0.2
            sources.append({
                "type": "external",
                "source": "Kalakshetra Foundation",
                "url": "https://kalakshetra.in/",
                "reliability": 0.92,
                "verification_score": kalakshetra_score,
                "details": "Specialized dance institution verification"
            })
        
        return {
            "score": min(score, 1.0),
            "sources": sources
        }
    
    def _simulate_wikipedia_check(self, claim_text: str) -> float:
        """Simulate Wikipedia fact-checking"""
        # Simulate different verification scores based on content
        if any(term in claim_text for term in ['bharatanatyam', 'siddha', 'tamil']):
            return 0.9  # High confidence for well-documented topics
        elif any(term in claim_text for term in ['traditional', 'ancient', 'classical']):
            return 0.8  # Good confidence for traditional topics
        else:
            return 0.7  # Moderate confidence for general claims
    
    def _calculate_authenticity_score(self, verification_results: List[Dict[str, Any]]) -> float:
        """Calculate overall authenticity score from individual claim verifications"""
        if not verification_results:
            return 0.0
        
        # Weight verification scores by confidence
        weighted_scores = []
        total_weight = 0
        
        for result in verification_results:
            score = result['verification_score']
            confidence = result['confidence']
            weight = confidence
            
            weighted_scores.append(score * weight)
            total_weight += weight
        
        if total_weight == 0:
            return 0.0
        
        # Calculate weighted average
        authenticity_score = sum(weighted_scores) / total_weight
        
        # Apply category-specific adjustments
        if len([r for r in verification_results if r['verification_score'] > 0.8]) > len(verification_results) * 0.7:
            authenticity_score *= 1.1  # Boost if most claims are highly verified
        
        # Apply penalties for contradictions
        contradictions = sum(1 for r in verification_results if r.get('contradicting_sources'))
        if contradictions > 0:
            authenticity_score *= (1 - (contradictions * 0.1))
        
        return min(authenticity_score * 100, 100.0)  # Convert to percentage and cap at 100
    
    def _generate_source_references(self, verification_results: List[Dict[str, Any]], metadata: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate consolidated list of source references"""
        sources = []
        seen_sources = set()
        
        for result in verification_results:
            for source in result.get('supporting_sources', []):
                source_key = f"{source['source']}_{source.get('url', '')}"
                if source_key not in seen_sources:
                    sources.append({
                        "id": f"source_{len(sources) + 1}",
                        "title": source['source'],
                        "url": source.get('url', ''),
                        "reliability_score": int(source['reliability'] * 100),
                        "source_type": source['type'],
                        "verification_details": source.get('details', ''),
                        "category_relevance": metadata.get('category', 'General')
                    })
                    seen_sources.add(source_key)
        
        return sources[:10]  # Limit to top 10 sources
    
    def _generate_verification_report(
        self, 
        claims: List[Dict[str, Any]], 
        verification_results: List[Dict[str, Any]], 
        authenticity_score: float, 
        sources: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Generate comprehensive verification report"""
        highly_verified = len([r for r in verification_results if r['verification_score'] > 0.8])
        moderately_verified = len([r for r in verification_results if 0.6 <= r['verification_score'] <= 0.8])
        poorly_verified = len([r for r in verification_results if r['verification_score'] < 0.6])
        
        return {
            "summary": {
                "total_claims": len(claims),
                "highly_verified": highly_verified,
                "moderately_verified": moderately_verified,
                "poorly_verified": poorly_verified,
                "overall_score": authenticity_score,
                "recommendation": self._get_recommendation(authenticity_score)
            },
            "source_analysis": {
                "total_sources": len(sources),
                "high_reliability_sources": len([s for s in sources if s['reliability_score'] > 90]),
                "average_source_reliability": sum(s['reliability_score'] for s in sources) / len(sources) if sources else 0
            },
            "verification_timestamp": datetime.utcnow().isoformat(),
            "methodology": "AI-powered cross-referencing with reliable Tamil cultural and academic sources"
        }
    
    def _get_recommendation(self, score: float) -> str:
        """Get recommendation based on authenticity score"""
        if score >= 80:
            return "APPROVED: High authenticity score. Recommend for verification and pack generation."
        elif score >= 70:
            return "REVIEW: Moderate authenticity score. Manual review recommended."
        else:
            return "REJECTED: Low authenticity score. Additional sources and verification required."