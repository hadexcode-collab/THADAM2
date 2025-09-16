import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePack } from '../hooks/useApi';
import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import AuthenticityBadge from '../components/features/AuthenticityBadge';
import {
  ArrowLeftIcon,
  PlayIcon,
  CheckCircleIcon,
  ClockIcon,
  UsersIcon,
  StarIcon,
  ShieldCheckIcon,
  BookOpenIcon,
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';

const PackViewer = () => {
  const { id } = useParams();
  const { pack, loading, error } = usePack(id || '');
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading pack..." />
      </div>
    );
  }

  if (error || !pack) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">Pack not found</p>
          <Link to="/catalog">
            <Button>Back to Catalog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return VideoCameraIcon;
      case 'interactive':
        return PhotoIcon;
      case 'practice':
        return CheckCircleIcon;
      default:
        return DocumentTextIcon;
    }
  };

  const markLessonComplete = (lessonIndex: number) => {
    if (!completedLessons.includes(lessonIndex)) {
      setCompletedLessons([...completedLessons, lessonIndex]);
    }
  };

  const progress = pack.lessons?.length ? (completedLessons.length / pack.lessons.length) * 100 : 0;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/catalog"
            className="inline-flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Back to Catalog</span>
          </Link>
          
          <Card className="p-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="text-6xl">{pack.thumbnail}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        {pack.title}
                      </h1>
                      <AuthenticityBadge score={pack.authenticity_score} />
                    </div>
                    <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-3">
                      {pack.category}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {pack.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {pack.difficulty}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {pack.duration}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {pack.learners_count.toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Learners</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white flex items-center justify-center space-x-1">
                      <StarIcon className="w-6 h-6 text-yellow-400 fill-current" />
                      <span>{pack.rating}</span>
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Rating</div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {pack.instructor.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">
                        {pack.instructor}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Instructor
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Renowned expert with 25+ years of experience in Tamil cultural preservation.
                  </p>
                </div>
              </div>

              <div>
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Your Progress
                    </h3>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <ProgressBar value={progress} showLabel color="indigo" className="mb-4" />
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {completedLessons.length} of {pack.lessons?.length || 0} lessons completed
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Lesson List */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                Course Content
              </h3>
              <div className="space-y-2">
                {pack.lessons?.map((lesson, index) => {
                  const LessonIcon = getLessonIcon(lesson.type);
                  const isCompleted = completedLessons.includes(index);
                  const isCurrent = currentLesson === index;
                  
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setCurrentLesson(index)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                        isCurrent
                          ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-1 rounded ${
                          isCurrent ? 'bg-indigo-200 dark:bg-indigo-800' : 'bg-slate-200 dark:bg-slate-600'
                        }`}>
                          <LessonIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{lesson.title}</div>
                          <div className="text-xs opacity-75">{lesson.duration}</div>
                        </div>
                        {isCompleted && (
                          <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setShowQuiz(true)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    showQuiz
                      ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-1 rounded ${
                      showQuiz ? 'bg-purple-200 dark:bg-purple-800' : 'bg-slate-200 dark:bg-slate-600'
                    }`}>
                      <CheckCircleIcon className="w-4 h-4" />
                    </div>
                    <div className="font-medium text-sm">Final Quiz</div>
                  </div>
                </button>
              </div>
            </Card>
          </div>

          {/* Lesson Content */}
          <div className="lg:col-span-3">
            <Card className="overflow-hidden">
              {!showQuiz ? (
                <div className="p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      {pack.lessons?.[currentLesson]?.title}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                      {pack.lessons?.[currentLesson]?.description}
                    </p>
                  </div>

                  {/* Video Player Placeholder */}
                  {pack.lessons?.[currentLesson]?.type === 'video' && (
                    <div className="bg-slate-900 rounded-lg aspect-video flex items-center justify-center mb-6">
                      <div className="text-center">
                        <PlayIcon className="w-16 h-16 text-white mx-auto mb-4" />
                        <p className="text-white">Video Player</p>
                        <p className="text-slate-400 text-sm">
                          {pack.lessons?.[currentLesson]?.duration}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Interactive Content */}
                  {pack.lessons?.[currentLesson]?.type === 'interactive' && (
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-8 mb-6">
                      <div className="text-center">
                        <PhotoIcon className="w-16 h-16 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
                        <p className="text-slate-900 dark:text-white font-medium">Interactive Learning Module</p>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                          Practice hand gestures with visual feedback
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Practice Session */}
                  {pack.lessons?.[currentLesson]?.type === 'practice' && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-8 mb-6">
                      <div className="text-center">
                        <CheckCircleIcon className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
                        <p className="text-slate-900 dark:text-white font-medium">Practice Session</p>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                          Follow along and practice the movements
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="prose prose-slate dark:prose-invert max-w-none mb-8">
                    <p>{pack.lessons?.[currentLesson]?.content}</p>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      variant="secondary"
                      onClick={() => setCurrentLesson(Math.max(0, currentLesson - 1))}
                      disabled={currentLesson === 0}
                    >
                      Previous
                    </Button>
                    
                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        onClick={() => markLessonComplete(currentLesson)}
                      >
                        Mark Complete
                      </Button>
                      
                      {currentLesson < (pack.lessons?.length || 0) - 1 ? (
                        <Button
                          onClick={() => setCurrentLesson(currentLesson + 1)}
                        >
                          Next Lesson
                        </Button>
                      ) : (
                        <Button
                          onClick={() => setShowQuiz(true)}
                        >
                          Take Quiz
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                    Final Quiz
                  </h2>
                  <div className="space-y-6">
                    {pack.quiz_questions?.map((question, index) => (
                      <div key={index} className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6">
                        <h3 className="font-medium text-slate-900 dark:text-white mb-4">
                          {index + 1}. {question.question}
                        </h3>
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <label key={optionIndex} className="flex items-center space-x-3 cursor-pointer">
                              <input
                                type="radio"
                                name={`question-${index}`}
                                value={optionIndex}
                                className="text-indigo-600 focus:ring-indigo-500"
                              />
                              <span className="text-slate-700 dark:text-slate-300">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    <Button className="w-full">
                      Submit Quiz
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackViewer;