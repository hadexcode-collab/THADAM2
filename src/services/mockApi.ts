// Mock API service for web-only demo
export interface Submission {
  id: string;
  title: string;
  category: string;
  description: string;
  attribution: string;
  status: 'processing' | 'verified' | 'rejected' | 'review';
  authenticity_score: number | null;
  uploaded_at: string;
  verified_at: string | null;
  pack_id: string | null;
  file_name: string;
  file_size: number;
}

export interface CulturalPack {
  id: string;
  title: string;
  category: string;
  description: string;
  authenticity_score: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  learners_count: number;
  created_at: string;
  uploader_attribution: string;
  learning_objectives: Array<{
    id: string;
    title: string;
    description: string;
  }>;
  learning_steps: Array<{
    id: string;
    title: string;
    content: string;
    type: 'text' | 'video' | 'image' | 'activity';
    duration: string;
  }>;
  quiz_questions: Array<{
    id: string;
    question: string;
    options: string[];
    correct_answer: number;
  }>;
  references: Array<{
    id: string;
    title: string;
    source: string;
    url?: string;
    reliability_score: number;
  }>;
  medical_disclaimer?: boolean;
}

// Mock data storage
let submissions: Submission[] = [];
let packs: CulturalPack[] = [
  {
    id: '1',
    title: 'Bharatanatyam: Basic Adavus',
    category: 'Tamil Classical Dance',
    description: 'Learn the fundamental steps and movements of Bharatanatyam, starting with basic adavus (dance units).',
    authenticity_score: 95,
    difficulty: 'Beginner',
    duration: '2 hours',
    learners_count: 324,
    created_at: '2024-01-15',
    uploader_attribution: 'Guru Meera Krishnan, Kalakshetra',
    learning_objectives: [
      {
        id: '1',
        title: 'Master Basic Posture',
        description: 'Learn the fundamental standing position (Araimandi) and hand positions'
      },
      {
        id: '2',
        title: 'Execute First Adavu',
        description: 'Practice the basic Ta-Tha-Jhi-Mi pattern with proper timing'
      },
      {
        id: '3',
        title: 'Coordinate Movement',
        description: 'Synchronize hand and foot movements with rhythmic precision'
      }
    ],
    learning_steps: [
      {
        id: '1',
        title: 'Introduction to Bharatanatyam',
        content: 'Bharatanatyam is a classical dance form that originated in Tamil Nadu. It combines rhythm, expression, melody, and dance to tell stories and express devotion.',
        type: 'text',
        duration: '10 minutes'
      },
      {
        id: '2',
        title: 'Basic Posture: Araimandi',
        content: 'The fundamental position involves bending the knees outward while keeping the spine straight. This creates stability and grace.',
        type: 'video',
        duration: '15 minutes'
      },
      {
        id: '3',
        title: 'Hand Positions (Hastas)',
        content: 'Learn the basic hand gestures that form the vocabulary of Bharatanatyam expression.',
        type: 'image',
        duration: '20 minutes'
      },
      {
        id: '4',
        title: 'First Adavu Practice',
        content: 'Practice the Ta-Tha-Jhi-Mi rhythm pattern while maintaining proper posture.',
        type: 'activity',
        duration: '30 minutes'
      }
    ],
    quiz_questions: [
      {
        id: '1',
        question: 'What is the fundamental standing position in Bharatanatyam called?',
        options: ['Araimandi', 'Muzhumandi', 'Nattu', 'Mandal'],
        correct_answer: 0
      },
      {
        id: '2',
        question: 'Which state is the origin of Bharatanatyam?',
        options: ['Kerala', 'Karnataka', 'Tamil Nadu', 'Andhra Pradesh'],
        correct_answer: 2
      }
    ],
    references: [
      {
        id: '1',
        title: 'Classical Indian Dance Forms',
        source: 'Wikipedia',
        url: 'https://en.wikipedia.org/wiki/Bharatanatyam',
        reliability_score: 85
      },
      {
        id: '2',
        title: 'Bharatanatyam Techniques',
        source: 'Kalakshetra Foundation',
        reliability_score: 95
      }
    ]
  },
  {
    id: '2',
    title: 'Traditional Siddha Medicine Basics',
    category: 'Traditional Medicine',
    description: 'Introduction to Siddha medicine principles, herbal preparations, and traditional diagnostic methods.',
    authenticity_score: 87,
    difficulty: 'Intermediate',
    duration: '3.5 hours',
    learners_count: 156,
    created_at: '2024-01-10',
    uploader_attribution: 'Dr. Rajesh Vaidyar, Siddha College',
    medical_disclaimer: true,
    learning_objectives: [
      {
        id: '1',
        title: 'Understand Five Elements',
        description: 'Learn about earth, water, fire, air, and space in Siddha medicine'
      },
      {
        id: '2',
        title: 'Identify Three Principles',
        description: 'Master Vatham, Pitham, and Kapham concepts'
      },
      {
        id: '3',
        title: 'Safety Practices',
        description: 'Understand proper consultation and safety requirements'
      }
    ],
    learning_steps: [
      {
        id: '1',
        title: 'Introduction to Siddha Medicine',
        content: 'Siddha medicine is an ancient Tamil medical system based on five elements and three principles.',
        type: 'text',
        duration: '15 minutes'
      },
      {
        id: '2',
        title: 'Five Elements Theory',
        content: 'Understanding how earth, water, fire, air, and space influence health and disease.',
        type: 'text',
        duration: '25 minutes'
      },
      {
        id: '3',
        title: 'Three Principles (Tridosha)',
        content: 'Learn about Vatham (air), Pitham (fire), and Kapham (earth/water) principles.',
        type: 'text',
        duration: '30 minutes'
      },
      {
        id: '4',
        title: 'Safety and Consultation',
        content: 'Always consult qualified Siddha practitioners before using traditional medicines.',
        type: 'text',
        duration: '20 minutes'
      }
    ],
    quiz_questions: [
      {
        id: '1',
        question: 'How many basic elements are there in Siddha medicine?',
        options: ['3', '5', '7', '9'],
        correct_answer: 1
      },
      {
        id: '2',
        question: 'What should you do before using traditional medicine?',
        options: ['Use immediately', 'Consult a qualified practitioner', 'Mix with modern medicine', 'Share with others'],
        correct_answer: 1
      }
    ],
    references: [
      {
        id: '1',
        title: 'Siddha Medicine Principles',
        source: 'Government of Tamil Nadu',
        reliability_score: 95
      },
      {
        id: '2',
        title: 'Traditional Medicine Systems',
        source: 'Academic Research',
        reliability_score: 90
      }
    ]
  }
];

// Simulate AI processing with realistic delays and results
const simulateAIProcessing = async (file: File, metadata: any): Promise<{
  authenticity_score: number;
  status: 'verified' | 'review' | 'rejected';
  claims: string[];
  sources: string[];
}> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
  
  // Generate realistic authenticity score based on content
  let baseScore = 70;
  
  // Boost score for certain categories and keywords
  if (metadata.category === 'Tamil Classical Dance') baseScore += 15;
  if (metadata.category === 'Traditional Medicine') baseScore += 10;
  if (metadata.title.toLowerCase().includes('bharatanatyam')) baseScore += 10;
  if (metadata.title.toLowerCase().includes('siddha')) baseScore += 8;
  if (metadata.description.toLowerCase().includes('traditional')) baseScore += 5;
  if (metadata.attribution.toLowerCase().includes('guru') || 
      metadata.attribution.toLowerCase().includes('doctor')) baseScore += 8;
  
  // Add some randomness
  const score = Math.min(100, baseScore + Math.random() * 20 - 10);
  
  let status: 'verified' | 'review' | 'rejected';
  if (score >= 80) status = 'verified';
  else if (score >= 70) status = 'review';
  else status = 'rejected';
  
  return {
    authenticity_score: Math.round(score),
    status,
    claims: [
      'Cultural practice authenticity verified',
      'Historical context matches reliable sources',
      'Traditional methods properly documented'
    ],
    sources: [
      'Wikipedia - Tamil Culture',
      'Government of Tamil Nadu Cultural Database',
      'Academic Research Papers'
    ]
  };
};

// Mock API functions
export const mockApi = {
  async uploadContent(file: File, metadata: any): Promise<{ success: boolean; submission_id: string }> {
    const submission_id = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const submission: Submission = {
      id: submission_id,
      title: metadata.title,
      category: metadata.category,
      description: metadata.description,
      attribution: metadata.attribution,
      status: 'processing',
      authenticity_score: null,
      uploaded_at: new Date().toISOString(),
      verified_at: null,
      pack_id: null,
      file_name: file.name,
      file_size: file.size
    };
    
    submissions.push(submission);
    
    // Simulate AI processing in background
    setTimeout(async () => {
      const result = await simulateAIProcessing(file, metadata);
      
      // Update submission
      const index = submissions.findIndex(s => s.id === submission_id);
      if (index !== -1) {
        submissions[index] = {
          ...submissions[index],
          status: result.status,
          authenticity_score: result.authenticity_score,
          verified_at: result.status === 'verified' ? new Date().toISOString() : null
        };
        
        // If verified, create a pack
        if (result.status === 'verified') {
          const pack_id = `pack_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          submissions[index].pack_id = pack_id;
          
          // Create a new pack
          const newPack: CulturalPack = {
            id: pack_id,
            title: metadata.title,
            category: metadata.category,
            description: metadata.description,
            authenticity_score: result.authenticity_score,
            difficulty: 'Beginner',
            duration: '2-3 hours',
            learners_count: 0,
            created_at: new Date().toISOString(),
            uploader_attribution: metadata.attribution,
            medical_disclaimer: metadata.category === 'Traditional Medicine',
            learning_objectives: [
              {
                id: '1',
                title: 'Understand Cultural Context',
                description: `Learn the significance of ${metadata.title} in Tamil heritage`
              },
              {
                id: '2',
                title: 'Master Key Concepts',
                description: 'Grasp the fundamental principles and practices'
              },
              {
                id: '3',
                title: 'Apply Knowledge',
                description: 'Practice and apply learned concepts respectfully'
              }
            ],
            learning_steps: [
              {
                id: '1',
                title: `Introduction to ${metadata.title}`,
                content: `Welcome to learning about ${metadata.title}. ${metadata.description}`,
                type: 'text',
                duration: '15 minutes'
              },
              {
                id: '2',
                title: 'Historical Background',
                content: 'Explore the rich history and cultural significance of this practice.',
                type: 'text',
                duration: '20 minutes'
              },
              {
                id: '3',
                title: 'Practical Application',
                content: 'Learn how to respectfully practice and preserve this cultural knowledge.',
                type: 'activity',
                duration: '30 minutes'
              }
            ],
            quiz_questions: [
              {
                id: '1',
                question: `What is the cultural significance of ${metadata.title}?`,
                options: ['Entertainment only', 'Cultural preservation', 'Commercial purpose', 'Modern invention'],
                correct_answer: 1
              },
              {
                id: '2',
                question: 'Why is it important to preserve traditional knowledge?',
                options: ['Historical value', 'Cultural identity', 'Educational benefit', 'All of the above'],
                correct_answer: 3
              }
            ],
            references: [
              {
                id: '1',
                title: `${metadata.category} - Cultural Heritage`,
                source: 'Tamil Cultural Database',
                reliability_score: 90
              },
              {
                id: '2',
                title: 'Traditional Knowledge Systems',
                source: 'Academic Research',
                reliability_score: 85
              }
            ]
          };
          
          packs.push(newPack);
        }
      }
    }, 3000 + Math.random() * 5000); // 3-8 seconds processing time
    
    return { success: true, submission_id };
  },

  async getSubmissions(): Promise<Submission[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...submissions].reverse(); // Most recent first
  },

  async getVerificationStatus(submission_id: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const submission = submissions.find(s => s.id === submission_id);
    return submission || null;
  },

  async getPacks(): Promise<CulturalPack[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [...packs];
  },

  async getPack(pack_id: string): Promise<CulturalPack | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return packs.find(p => p.id === pack_id) || null;
  }
};