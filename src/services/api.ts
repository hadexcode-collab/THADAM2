// API service for backend communication
const API_BASE_URL = 'https://api.example.com'; // Mock API endpoint

export interface UploadResponse {
  success: boolean;
  submission_id: string;
  message?: string;
}

export interface VerificationStatus {
  id: string;
  status: 'processing' | 'verified' | 'rejected' | 'review';
  authenticity_score: number | null;
  created_at: string;
  updated_at: string;
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
  rating: number;
  instructor: string;
  thumbnail: string;
  created_at: string;
  lessons: Lesson[];
  quiz_questions: QuizQuestion[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  type: 'video' | 'text' | 'interactive' | 'practice';
  duration: string;
  order: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Upload content
  async uploadContent(file: File, metadata: any): Promise<UploadResponse> {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return mock response for demo
    return {
      success: true,
      submission_id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  // Get verification status
  async getVerificationStatus(submissionId: string): Promise<VerificationStatus> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock data for demo
    return {
      id: submissionId,
      status: 'processing',
      authenticity_score: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  // Get cultural packs
  async getCulturalPacks(filters?: {
    category?: string;
    difficulty?: string;
    search?: string;
  }): Promise<CulturalPack[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data for demo
    return this.getMockPacks();
  }

  // Get single pack
  async getPack(packId: string): Promise<CulturalPack> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return mock data for demo
    const packs = this.getMockPacks();
    return packs.find(p => p.id === packId) || packs[0];
  }

  // Mock data for demo purposes
  private getMockPacks(): CulturalPack[] {
    return [
      {
        id: '1',
        title: 'Bharatanatyam Fundamentals',
        category: 'Tamil Classical Dance',
        description: 'Master the basic positions, hand gestures, and movements of this classical dance form.',
        authenticity_score: 96,
        difficulty: 'Beginner',
        duration: '4.5 hours',
        learners_count: 1247,
        rating: 4.9,
        instructor: 'Guru Meera Krishnan',
        thumbnail: '🩰',
        created_at: '2024-01-15T00:00:00Z',
        lessons: [
          {
            id: '1',
            title: 'Introduction to Bharatanatyam',
            description: 'Learn about the history and significance of this classical dance form.',
            content: 'Bharatanatyam is one of the oldest classical dance forms of India...',
            type: 'video',
            duration: '15 min',
            order: 1
          },
          {
            id: '2',
            title: 'Basic Standing Position (Araimandi)',
            description: 'Master the fundamental standing position.',
            content: 'The Araimandi position is crucial for all movements...',
            type: 'video',
            duration: '20 min',
            order: 2
          }
        ],
        quiz_questions: [
          {
            id: '1',
            question: 'What is the basic standing position in Bharatanatyam called?',
            options: ['Araimandi', 'Muzhumandi', 'Nattu', 'Mandal'],
            correct_answer: 0,
            explanation: 'Araimandi is the fundamental half-sitting position in Bharatanatyam.'
          }
        ]
      },
      {
        id: '2',
        title: 'Traditional Siddha Medicine',
        category: 'Traditional Medicine',
        description: 'Learn about ancient Tamil medical practices and healing techniques.',
        authenticity_score: 89,
        difficulty: 'Intermediate',
        duration: '6.2 hours',
        learners_count: 856,
        rating: 4.7,
        instructor: 'Dr. Rajesh Vaidyar',
        thumbnail: '🌿',
        created_at: '2024-01-10T00:00:00Z',
        lessons: [],
        quiz_questions: []
      },
      {
        id: '3',
        title: 'Tamil Temple Architecture',
        category: 'Architectural Styles',
        description: 'Explore the intricate designs and spiritual significance of Tamil temples.',
        authenticity_score: 94,
        difficulty: 'Advanced',
        duration: '8.1 hours',
        learners_count: 623,
        rating: 4.8,
        instructor: 'Prof. Anand Kumar',
        thumbnail: '🏛️',
        created_at: '2024-01-05T00:00:00Z',
        lessons: [],
        quiz_questions: []
      }
    ];
  }
}

export const apiService = new ApiService();