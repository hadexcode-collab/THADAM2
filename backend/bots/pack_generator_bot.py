import json
from typing import Dict, Any, List
from datetime import datetime
import re

class PackGeneratorBot:
    """Bot responsible for generating structured learning packs from verified content"""
    
    def __init__(self):
        # Learning pack templates by category
        self.pack_templates = {
            "Tamil Classical Dance": {
                "default_duration": "2-3 hours",
                "difficulty_mapping": {
                    "basic": "Beginner",
                    "intermediate": "Intermediate", 
                    "advanced": "Advanced"
                },
                "typical_objectives": [
                    "Master fundamental positions and postures",
                    "Learn basic hand gestures and expressions",
                    "Understand rhythmic patterns and timing",
                    "Coordinate movement with music"
                ],
                "step_types": ["introduction", "theory", "demonstration", "practice", "application"],
                "common_terms": ["adavu", "mudra", "bhava", "raga", "tala"]
            },
            "Traditional Medicine": {
                "default_duration": "3-4 hours",
                "difficulty_mapping": {
                    "basic": "Intermediate",  # Medical content starts at intermediate
                    "intermediate": "Intermediate",
                    "advanced": "Advanced"
                },
                "typical_objectives": [
                    "Understand traditional medical principles",
                    "Identify key medicinal herbs and preparations",
                    "Learn proper dosages and contraindications",
                    "Understand safety and consultation requirements"
                ],
                "step_types": ["principles", "identification", "preparation", "application", "safety"],
                "common_terms": ["dosham", "vaidya", "kashayam", "choornam", "tailam"]
            },
            "Religious Rituals": {
                "default_duration": "2-3 hours", 
                "difficulty_mapping": {
                    "basic": "Beginner",
                    "intermediate": "Intermediate",
                    "advanced": "Advanced"
                },
                "typical_objectives": [
                    "Understand ritual significance and context",
                    "Learn proper sequence and procedures",
                    "Master essential prayers and chants",
                    "Appreciate cultural and spiritual meaning"
                ],
                "step_types": ["context", "preparation", "procedure", "significance", "variations"],
                "common_terms": ["puja", "mantra", "yantra", "prasadam", "aarti"]
            }
        }
    
    async def process(self, extracted_text: str, metadata: Dict[str, Any], auth_result: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate a structured learning pack from verified cultural content
        
        Args:
            extracted_text: Verified text content
            metadata: Original submission metadata
            auth_result: Results from authenticity verification
            
        Returns:
            Dictionary containing generated learning pack structure
        """
        try:
            category = metadata.get('category', 'General')
            
            # Generate pack metadata
            pack_metadata = self._generate_pack_metadata(metadata, auth_result)
            
            # Generate learning objectives
            objectives = await self._generate_learning_objectives(extracted_text, category, metadata)
            
            # Generate structured learning steps
            learning_steps = await self._generate_learning_steps(extracted_text, category, metadata)
            
            # Generate assessment quiz
            quiz_questions = await self._generate_quiz_questions(extracted_text, category, objectives)
            
            # Compile references from auth result
            references = self._compile_references(auth_result.get('sources', []))
            
            # Create comprehensive pack data
            pack_data = {
                **pack_metadata,
                "learning_objectives": objectives,
                "learning_steps": learning_steps,
                "quiz_questions": quiz_questions,
                "references": references,
                "generated_at": datetime.utcnow().isoformat(),
                "generator_version": "1.0.0"
            }
            
            return {
                "success": True,
                "pack_data": pack_data,
                "generation_quality": self._assess_generation_quality(pack_data),
                "message": "Learning pack generated successfully"
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Pack generation failed: {str(e)}",
                "pack_data": {},
                "message": "Failed to generate learning pack"
            }
    
    def _generate_pack_metadata(self, metadata: Dict[str, Any], auth_result: Dict[str, Any]) -> Dict[str, Any]:
        """Generate basic pack metadata"""
        category = metadata.get('category', 'General')
        template = self.pack_templates.get(category, self.pack_templates['Tamil Classical Dance'])
        
        # Determine difficulty based on content complexity
        difficulty = self._determine_difficulty(metadata.get('description', ''), category)
        
        return {
            "title": metadata.get('title', 'Cultural Learning Pack'),
            "category": category,
            "description": self._enhance_description(metadata.get('description', ''), category),
            "authenticity_score": auth_result.get('authenticity_score', 0),
            "difficulty": difficulty,
            "duration": self._estimate_duration(metadata.get('description', ''), category),
            "learners_count": 0,
            "uploader_attribution": metadata.get('attribution', 'Anonymous Contributor'),
            "medical_disclaimer": category == "Traditional Medicine",
            "cultural_context": self._generate_cultural_context(category)
        }
    
    async def _generate_learning_objectives(self, content: str, category: str, metadata: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate specific learning objectives based on content"""
        objectives = []
        template = self.pack_templates.get(category, {})
        typical_objectives = template.get('typical_objectives', [])
        
        # Extract key concepts from content
        key_concepts = self._extract_key_concepts(content, category)
        
        # Generate 3-5 specific objectives
        objective_count = min(5, max(3, len(key_concepts)))
        
        for i in range(objective_count):
            if i < len(typical_objectives):
                # Use template objectives as base
                base_objective = typical_objectives[i]
                specific_objective = self._customize_objective(base_objective, key_concepts, metadata)
            else:
                # Generate additional objectives from content
                specific_objective = self._generate_content_specific_objective(content, key_concepts, i)
            
            objectives.append({
                "id": str(i + 1),
                "title": specific_objective["title"],
                "description": specific_objective["description"],
                "estimated_time": specific_objective.get("time", "20-30 minutes")
            })
        
        return objectives
    
    async def _generate_learning_steps(self, content: str, category: str, metadata: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate structured learning steps"""
        steps = []
        template = self.pack_templates.get(category, {})
        step_types = template.get('step_types', ['introduction', 'theory', 'practice', 'application'])
        
        # Split content into logical sections
        content_sections = self._segment_content(content)
        
        step_id = 1
        
        # Introduction step
        steps.append({
            "id": str(step_id),
            "title": f"Introduction to {metadata.get('title', 'This Topic')}",
            "content": self._generate_introduction_content(metadata, category),
            "type": "text",
            "duration": "10-15 minutes",
            "order": step_id
        })
        step_id += 1
        
        # Content-based steps
        for i, section in enumerate(content_sections[:3]):  # Limit to 3 main content sections
            step_type = self._determine_step_type(section, category)
            step_content = self._format_step_content(section, step_type, category)
            
            steps.append({
                "id": str(step_id),
                "title": step_content["title"],
                "content": step_content["content"],
                "type": step_type,
                "duration": step_content["duration"],
                "order": step_id,
                "key_points": step_content.get("key_points", [])
            })
            step_id += 1
        
        # Practice/Application step
        if category in ["Tamil Classical Dance", "Religious Rituals"]:
            steps.append({
                "id": str(step_id),
                "title": "Practical Application",
                "content": self._generate_practice_content(content, category),
                "type": "activity",
                "duration": "30-45 minutes",
                "order": step_id,
                "interactive": True
            })
            step_id += 1
        
        # Summary/Reflection step
        steps.append({
            "id": str(step_id),
            "title": "Cultural Significance & Modern Context",
            "content": self._generate_reflection_content(metadata, category),
            "type": "text",
            "duration": "10-15 minutes",
            "order": step_id
        })
        
        return steps
    
    async def _generate_quiz_questions(self, content: str, category: str, objectives: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Generate assessment questions based on content and objectives"""
        questions = []
        
        # Extract key facts and concepts for questions
        key_facts = self._extract_key_facts(content, category)
        
        # Generate questions for each objective
        question_id = 1
        
        for objective in objectives[:3]:  # Focus on first 3 objectives
            question = self._generate_objective_question(objective, key_facts, category, question_id)
            if question:
                questions.append(question)
                question_id += 1
        
        # Add category-specific questions
        category_questions = self._generate_category_specific_questions(category, key_facts, question_id)
        questions.extend(category_questions)
        
        return questions[:5]  # Limit to 5 questions
    
    def _extract_key_concepts(self, content: str, category: str) -> List[str]:
        """Extract key concepts from content"""
        concepts = []
        template = self.pack_templates.get(category, {})
        common_terms = template.get('common_terms', [])
        
        # Find common terms in content
        content_lower = content.lower()
        for term in common_terms:
            if term.lower() in content_lower:
                concepts.append(term)
        
        # Extract other key terms (simplified approach)
        # In production, use NLP techniques
        words = content.split()
        
        # Look for capitalized words (likely proper nouns/important terms)
        for word in words:
            if word[0].isupper() and len(word) > 3 and word not in ['The', 'This', 'That']:
                concepts.append(word.strip('.,!?'))
        
        return list(set(concepts))[:10]  # Return unique concepts, limit to 10
    
    def _customize_objective(self, base_objective: str, key_concepts: List[str], metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Customize generic objective with specific content details"""
        title = base_objective
        description = f"Learn and apply {base_objective.lower()} in the context of {metadata.get('title', 'this cultural practice')}"
        
        # Add specific concepts if available
        if key_concepts:
            concept_list = ', '.join(key_concepts[:3])
            description += f". Focus areas include: {concept_list}."
        
        return {
            "title": title,
            "description": description,
            "time": "20-30 minutes"
        }
    
    def _generate_content_specific_objective(self, content: str, key_concepts: List[str], index: int) -> Dict[str, Any]:
        """Generate objective specific to the content"""
        objectives = [
            {
                "title": "Understand Cultural Context",
                "description": "Appreciate the historical and cultural significance of this practice in Tamil heritage."
            },
            {
                "title": "Practice Application", 
                "description": "Apply learned concepts in practical scenarios with proper attention to traditional methods."
            }
        ]
        
        base_obj = objectives[min(index, len(objectives) - 1)]
        
        if key_concepts:
            base_obj["description"] += f" Key focus: {', '.join(key_concepts[:2])}."
        
        return base_obj
    
    def _segment_content(self, content: str) -> List[str]:
        """Segment content into logical learning sections"""
        # Simple segmentation by paragraphs/sections
        sections = []
        
        # Split by double newlines (paragraph breaks)
        paragraphs = content.split('\n\n')
        
        current_section = ""
        section_length = 0
        
        for paragraph in paragraphs:
            if section_length + len(paragraph) > 500 or not current_section:
                if current_section:
                    sections.append(current_section.strip())
                current_section = paragraph
                section_length = len(paragraph)
            else:
                current_section += "\n\n" + paragraph
                section_length += len(paragraph)
        
        if current_section:
            sections.append(current_section.strip())
        
        return sections[:4]  # Limit to 4 sections
    
    def _determine_step_type(self, section_content: str, category: str) -> str:
        """Determine the appropriate step type based on content"""
        content_lower = section_content.lower()
        
        # Video content indicators
        if any(word in content_lower for word in ['demonstration', 'watch', 'observe', 'movement', 'technique']):
            return 'video'
        
        # Activity content indicators
        if any(word in content_lower for word in ['practice', 'try', 'exercise', 'apply', 'perform']):
            return 'activity'
        
        # Image content indicators
        if any(word in content_lower for word in ['diagram', 'position', 'posture', 'illustration', 'figure']):
            return 'image'
        
        # Default to text
        return 'text'
    
    def _format_step_content(self, section: str, step_type: str, category: str) -> Dict[str, Any]:
        """Format section content for learning step"""
        # Extract first sentence as potential title
        sentences = section.split('.')
        title_candidate = sentences[0].strip() if sentences else "Learning Content"
        
        # Clean up title
        if len(title_candidate) > 60:
            title_candidate = title_candidate[:60] + "..."
        
        # Generate content based on type
        if step_type == 'video':
            content = f"This section covers important visual demonstrations. {section[:200]}..."
            duration = "15-25 minutes"
        elif step_type == 'activity':
            content = f"Interactive learning activity. {section[:200]}..."
            duration = "20-30 minutes"
        elif step_type == 'image':
            content = f"Visual guide and reference materials. {section[:200]}..."
            duration = "10-15 minutes"
        else:
            content = section
            duration = "15-20 minutes"
        
        return {
            "title": title_candidate,
            "content": content,
            "duration": duration,
            "key_points": self._extract_key_points(section)
        }
    
    def _extract_key_points(self, content: str) -> List[str]:
        """Extract key points from content section"""
        points = []
        sentences = content.split('.')
        
        for sentence in sentences[:3]:  # First 3 sentences
            sentence = sentence.strip()
            if len(sentence) > 10:
                points.append(sentence + ".")
        
        return points
    
    def _generate_introduction_content(self, metadata: Dict[str, Any], category: str) -> str:
        """Generate introduction content for the pack"""
        title = metadata.get('title', 'this cultural practice')
        attribution = metadata.get('attribution', 'traditional sources')
        
        intro = f"Welcome to learning about {title}. This cultural practice is an integral part of Tamil heritage, "
        intro += f"representing centuries of traditional knowledge and wisdom. "
        intro += f"This content has been contributed by {attribution} and verified for authenticity. "
        
        if category == "Traditional Medicine":
            intro += "Please note that this content is for educational purposes only and should not replace professional medical advice."
        elif category == "Tamil Classical Dance":
            intro += "Prepare to explore the beauty and discipline of classical Tamil dance traditions."
        elif category == "Religious Rituals":
            intro += "Learn about the sacred traditions and their deeper spiritual significance."
        
        return intro
    
    def _generate_practice_content(self, content: str, category: str) -> str:
        """Generate practice/activity content"""
        if category == "Tamil Classical Dance":
            return "Now it's time to practice what you've learned. Start with basic positions and gradually incorporate the movements. Pay attention to posture, hand positions, and rhythm. Practice in front of a mirror if possible, and don't rush—precision is more important than speed."
        elif category == "Religious Rituals":
            return "Practice the ritual sequence step by step. Begin with the preparatory elements, then move through each phase mindfully. Focus on understanding the meaning behind each action rather than just memorizing the steps."
        else:
            return "Apply the knowledge you've gained through practical exercises. Take time to internalize the concepts and consider how they connect to broader Tamil cultural traditions."
    
    def _generate_reflection_content(self, metadata: Dict[str, Any], category: str) -> str:
        """Generate reflection/summary content"""
        title = metadata.get('title', 'this cultural practice')
        
        reflection = f"As you complete your study of {title}, take a moment to reflect on its significance in Tamil culture. "
        reflection += "This practice represents not just a skill or ritual, but a connection to generations of Tamil heritage. "
        reflection += "Consider how you might respectfully share this knowledge or continue your learning journey. "
        reflection += "Remember that cultural preservation is a collective responsibility, and your understanding contributes to keeping these traditions alive."
        
        return reflection
    
    def _extract_key_facts(self, content: str, category: str) -> List[Dict[str, Any]]:
        """Extract verifiable facts for quiz generation"""
        facts = []
        
        # Simple fact extraction (in production, use more sophisticated NLP)
        sentences = content.split('.')
        
        for sentence in sentences:
            sentence = sentence.strip()
            if len(sentence) > 20 and any(indicator in sentence.lower() for indicator in ['is', 'are', 'was', 'were', 'called', 'known']):
                facts.append({
                    "statement": sentence,
                    "type": "factual",
                    "confidence": 0.8
                })
        
        return facts[:10]  # Limit to 10 facts
    
    def _generate_objective_question(self, objective: Dict[str, Any], key_facts: List[Dict[str, Any]], category: str, question_id: int) -> Dict[str, Any]:
        """Generate question based on learning objective"""
        objective_title = objective['title'].lower()
        
        # Generate different question types based on objective
        if 'understand' in objective_title:
            return {
                "id": str(question_id),
                "question": f"What is the primary significance of {objective['title'].lower()} in Tamil culture?",
                "options": [
                    "Cultural preservation and identity",
                    "Entertainment purposes only", 
                    "Commercial applications",
                    "Historical documentation"
                ],
                "correct_answer": 0,
                "explanation": "Understanding cultural practices helps preserve Tamil identity and heritage."
            }
        elif 'master' in objective_title or 'learn' in objective_title:
            return {
                "id": str(question_id),
                "question": f"Which approach is most important when {objective['title'].lower()}?",
                "options": [
                    "Speed and efficiency",
                    "Precision and respect for tradition",
                    "Personal interpretation", 
                    "Modern modifications"
                ],
                "correct_answer": 1,
                "explanation": "Traditional practices require precision and respect for established methods."
            }
        
        return None
    
    def _generate_category_specific_questions(self, category: str, key_facts: List[Dict[str, Any]], start_id: int) -> List[Dict[str, Any]]:
        """Generate questions specific to the category"""
        questions = []
        
        if category == "Tamil Classical Dance":
            questions.append({
                "id": str(start_id),
                "question": "What is the traditional training approach for Tamil classical dance?",
                "options": [
                    "Self-taught through videos",
                    "Guru-disciple tradition with structured learning",
                    "Informal practice groups",
                    "Academic classroom setting only"
                ],
                "correct_answer": 1,
                "explanation": "Traditional Tamil dance follows the ancient guru-disciple teaching tradition."
            })
        elif category == "Traditional Medicine":
            questions.append({
                "id": str(start_id),
                "question": "What should you always do before using traditional medicine?",
                "options": [
                    "Try it immediately if symptoms match",
                    "Consult with a qualified traditional medicine practitioner", 
                    "Mix it with modern medicines",
                    "Share with family members"
                ],
                "correct_answer": 1,
                "explanation": "Traditional medicine requires proper guidance from qualified practitioners for safety and effectiveness."
            })
        
        return questions
    
    def _compile_references(self, auth_sources: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Compile and format references from authentication results"""
        references = []
        
        for i, source in enumerate(auth_sources[:8]):  # Limit to 8 references
            ref = {
                "id": str(i + 1),
                "title": source.get('title', f"Reference {i + 1}"),
                "source": source.get('source', 'Unknown Source'),
                "url": source.get('url', ''),
                "reliability_score": source.get('reliability_score', 80),
                "relevance": "High",
                "access_date": datetime.utcnow().strftime("%Y-%m-%d")
            }
            references.append(ref)
        
        return references
    
    def _determine_difficulty(self, description: str, category: str) -> str:
        """Determine difficulty level based on content analysis"""
        description_lower = description.lower()
        template = self.pack_templates.get(category, {})
        
        # Check for difficulty indicators
        if any(word in description_lower for word in ['advanced', 'expert', 'master', 'complex']):
            return "Advanced"
        elif any(word in description_lower for word in ['intermediate', 'moderate', 'developing']):
            return "Intermediate"
        elif any(word in description_lower for word in ['basic', 'beginner', 'introduction', 'fundamental']):
            return "Beginner"
        else:
            # Use category default
            return template.get('difficulty_mapping', {}).get('basic', 'Intermediate')
    
    def _estimate_duration(self, description: str, category: str) -> str:
        """Estimate learning duration based on content complexity"""
        word_count = len(description.split())
        template = self.pack_templates.get(category, {})
        
        # Base duration from template
        base_duration = template.get('default_duration', '2-3 hours')
        
        # Adjust based on content length
        if word_count > 500:
            return "4-5 hours"
        elif word_count > 200:
            return "3-4 hours"
        else:
            return base_duration
    
    def _enhance_description(self, original_description: str, category: str) -> str:
        """Enhance the original description for the learning pack"""
        enhanced = f"This verified cultural learning pack covers {original_description.lower()}"
        enhanced += f" The content has been authenticated through AI-powered verification "
        enhanced += f"against reliable sources and structured into a comprehensive learning experience. "
        
        if category == "Traditional Medicine":
            enhanced += "This educational content should not replace professional medical consultation."
        
        return enhanced
    
    def _generate_cultural_context(self, category: str) -> str:
        """Generate cultural context information"""
        contexts = {
            "Tamil Classical Dance": "Tamil classical dance forms represent over 2,000 years of cultural evolution, deeply rooted in temple traditions and spiritual expression.",
            "Traditional Medicine": "Tamil traditional medicine systems like Siddha have been practiced for millennia, emphasizing holistic health and natural healing.",
            "Religious Rituals": "Tamil religious practices blend ancient Vedic traditions with Dravidian customs, creating unique spiritual expressions.",
            "Folk Arts": "Tamil folk arts preserve rural traditions and community storytelling, connecting generations through shared cultural memory.",
            "Culinary Traditions": "Tamil cuisine reflects the region's agricultural heritage, seasonal cycles, and cultural interactions over centuries.",
            "Musical Heritage": "Tamil music traditions encompass both classical Carnatic music and rich folk traditions that vary by region.",
            "Architectural Styles": "Tamil architecture showcases sophisticated temple designs and urban planning principles developed over centuries.",
            "Literary Works": "Tamil literature includes some of the world's oldest literary works, preserving philosophical and cultural wisdom."
        }
        
        return contexts.get(category, "This cultural practice is an important part of Tamil heritage, representing traditional knowledge and community values.")
    
    def _assess_generation_quality(self, pack_data: Dict[str, Any]) -> float:
        """Assess the quality of the generated pack"""
        quality_score = 0.0
        
        # Check completeness
        required_sections = ['learning_objectives', 'learning_steps', 'quiz_questions', 'references']
        completeness = sum(1 for section in required_sections if pack_data.get(section)) / len(required_sections)
        quality_score += completeness * 0.3
        
        # Check content depth
        objectives_count = len(pack_data.get('learning_objectives', []))
        steps_count = len(pack_data.get('learning_steps', []))
        questions_count = len(pack_data.get('quiz_questions', []))
        
        content_depth = min(1.0, (objectives_count + steps_count + questions_count) / 12)
        quality_score += content_depth * 0.4
        
        # Check authenticity integration
        auth_score = pack_data.get('authenticity_score', 0) / 100
        quality_score += auth_score * 0.3
        
        return min(quality_score, 1.0)