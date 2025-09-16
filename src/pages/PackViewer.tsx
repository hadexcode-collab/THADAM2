import React, { useState, useEffect } from 'react';
import { ArrowLeft, Shield, Clock, Users, Star, CheckCircle, Play, BookOpen, ExternalLink } from 'lucide-react';

interface LearningObjective {
  id: string;
  title: string;
  description: string;
  completed?: boolean;
}

interface LearningStep {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'video' | 'image' | 'activity';
  duration?: string;
  completed?: boolean;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
}

interface Reference {
  id: string;
  title: string;
  source: string;
  url?: string;
  reliability_score: number;
}

interface CulturalPack {
  id: string;
  title: string;
  category: string;
  description: string;
  authenticity_score: number;
  difficulty: string;
  duration: string;
  learners_count: number;
  uploader_attribution: string;
  learning_objectives: LearningObjective[];
  learning_steps: LearningStep[];
  quiz_questions: QuizQuestion[];
  references: Reference[];
  medical_disclaimer?: string;
}

interface PackViewerProps {
  packId: string | null;
  onBack: () => void;
}

const PackViewer: React.FC<PackViewerProps> = ({ packId, onBack }) => {
  const [pack, setPack] = useState<CulturalPack | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    if (packId) {
      fetchPack(packId);
    }
  }, [packId]);

  const fetchPack = async (id: string) => {
    try {
      const response = await fetch(`/api/pack/${id}`);
      if (response.ok) {
        const data = await response.json();
        setPack(data);
      }
    } catch (error) {
      console.error('Failed to fetch pack:', error);
      // Mock data for demo
      setPack({
        id: '1',
        title: 'Bharatanatyam: Basic Adavus',
        category: 'Tamil Classical Dance',
        description: 'Learn the fundamental steps and movements of Bharatanatyam, starting with basic adavus (dance units).',
        authenticity_score: 95,
        difficulty: 'Beginner',
        duration: '2 hours',
        learners_count: 324,
        uploader_attribution: 'Guru Meera Krishnan, Kalakshetra',
        learning_objectives: [
          {
            id: '1',
            title: 'Understand Basic Posture',
            description: 'Learn the fundamental standing position (Araimandi) and hand positions'
          },
          {
            id: '2',
            title: 'Master First Adavu',
            description: 'Execute the basic Ta-Tha-Jhi-Mi pattern with proper timing'
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
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
  };

  const calculateQuizScore = () => {
    if (!pack) return 0;
    
    let correct = 0;
    pack.quiz_questions.forEach(question => {
      if (quizAnswers[question.id] === question.correct_answer) {
        correct++;
      }
    });
    
    return Math.round((correct / pack.quiz_questions.length) * 100);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="h-4 w-4" />;
      case 'activity':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!pack) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Pack not found</p>
        <button
          onClick={onBack}
          className="mt-4 bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="h-5 w-5 text-green-400" />
            <span className="text-green-400 text-sm font-medium">
              Verified {pack.authenticity_score}%
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white">{pack.title}</h1>
          <p className="text-orange-400">{pack.category}</p>
        </div>
      </div>

      {/* Pack Info */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <p className="text-gray-300">{pack.description}</p>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{pack.duration}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{pack.learners_count} learners</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-yellow-400">4.8</span>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              Contributed by: <span className="text-gray-400">{pack.uploader_attribution}</span>
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-white mb-3">Learning Objectives</h3>
            <div className="space-y-2">
              {pack.learning_objectives.map((objective) => (
                <div key={objective.id} className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-orange-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white text-sm font-medium">{objective.title}</p>
                    <p className="text-gray-400 text-xs">{objective.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {pack.medical_disclaimer && (
          <div className="mt-6 bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-100 text-sm">
              <strong>Medical Disclaimer:</strong> This content is for educational purposes only and should not replace professional medical advice. Always consult healthcare professionals before applying traditional medicine practices.
            </p>
          </div>
        )}
      </div>

      {/* Learning Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Steps Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 sticky top-4">
            <h3 className="text-lg font-medium text-white mb-4">Learning Steps</h3>
            <div className="space-y-2">
              {pack.learning_steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(index)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    currentStep === index
                      ? 'bg-orange-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-1 rounded ${
                      currentStep === index ? 'bg-orange-500' : 'bg-gray-600'
                    }`}>
                      {getTypeIcon(step.type)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{step.title}</div>
                      <div className="text-xs opacity-75">{step.duration}</div>
                    </div>
                  </div>
                </button>
              ))}
              
              <button
                onClick={() => setShowQuiz(true)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  showQuiz
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-1 rounded ${
                    showQuiz ? 'bg-blue-500' : 'bg-gray-600'
                  }`}>
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div className="font-medium text-sm">Final Quiz</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            {!showQuiz ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {pack.learning_steps[currentStep]?.title}
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                    <span>Step {currentStep + 1} of {pack.learning_steps.length}</span>
                    <span>•</span>
                    <span>{pack.learning_steps[currentStep]?.duration}</span>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed">
                    {pack.learning_steps[currentStep]?.content}
                  </p>
                </div>

                {pack.learning_steps[currentStep]?.type === 'video' && (
                  <div className="bg-gray-900 rounded-lg p-8 text-center">
                    <Play className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Video content would be displayed here</p>
                  </div>
                )}

                {pack.learning_steps[currentStep]?.type === 'activity' && (
                  <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-6">
                    <h3 className="text-orange-400 font-medium mb-2">Practice Activity</h3>
                    <p className="text-orange-100 text-sm">
                      Follow along with the instructions and practice the movements. 
                      Take your time to master each position before moving to the next step.
                    </p>
                  </div>
                )}

                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Previous
                  </button>
                  
                  {currentStep < pack.learning_steps.length - 1 ? (
                    <button
                      onClick={() => setCurrentStep(currentStep + 1)}
                      className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowQuiz(true)}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Take Quiz
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Final Quiz</h2>
                  <p className="text-gray-400">Test your understanding of the material</p>
                </div>

                {!quizSubmitted ? (
                  <div className="space-y-6">
                    {pack.quiz_questions.map((question, index) => (
                      <div key={question.id} className="space-y-3">
                        <h3 className="text-lg font-medium text-white">
                          {index + 1}. {question.question}
                        </h3>
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <label key={optionIndex} className="flex items-center space-x-3">
                              <input
                                type="radio"
                                name={question.id}
                                value={optionIndex}
                                onChange={() => setQuizAnswers({
                                  ...quizAnswers,
                                  [question.id]: optionIndex
                                })}
                                className="text-orange-500 focus:ring-orange-500"
                              />
                              <span className="text-gray-300">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={handleQuizSubmit}
                      disabled={Object.keys(quizAnswers).length < pack.quiz_questions.length}
                      className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                    >
                      Submit Quiz
                    </button>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="text-4xl font-bold text-green-400">
                      {calculateQuizScore()}%
                    </div>
                    <p className="text-gray-300">
                      You scored {Object.entries(quizAnswers).filter(([questionId, answer]) => {
                        const question = pack.quiz_questions.find(q => q.id === questionId);
                        return question && answer === question.correct_answer;
                      }).length} out of {pack.quiz_questions.length} questions correctly!
                    </p>
                    
                    {calculateQuizScore() >= 80 && (
                      <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                        <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                        <p className="text-green-100 font-medium">Congratulations! You've mastered this content.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* References */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-medium text-white mb-4">References & Sources</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {pack.references.map((reference) => (
            <div key={reference.id} className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-white text-sm">{reference.title}</h4>
                <div className="flex items-center space-x-1 text-xs">
                  <Shield className="h-3 w-3 text-green-400" />
                  <span className="text-green-400">{reference.reliability_score}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">{reference.source}</span>
                {reference.url && (
                  <a
                    href={reference.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-400 hover:text-orange-300 text-sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PackViewer;