import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ClockIcon,
  UsersIcon,
  StarIcon,
  PlayIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';
import AuthenticityBadge from './AuthenticityBadge';
import Card from '../ui/Card';

interface PackCardProps {
  pack: {
    id: string;
    title: string;
    category: string;
    description: string;
    authenticity: number;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    duration: string;
    learners: number;
    rating: number;
    instructor: string;
    thumbnail: string;
  };
  index?: number;
}

const PackCard: React.FC<PackCardProps> = ({ pack, index = 0 }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card hover className="group overflow-hidden h-full">
        {/* Thumbnail */}
        <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 h-48 flex items-center justify-center">
          <div className="text-6xl">{pack.thumbnail}</div>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="bg-white/20 backdrop-blur-sm rounded-full p-3"
            >
              <PlayIcon className="w-8 h-8 text-white" />
            </motion.div>
          </div>
          
          {/* Badges */}
          <div className="absolute top-4 left-4">
            <AuthenticityBadge score={pack.authenticity} size="sm" showLabel={false} />
          </div>
          <div className="absolute top-4 right-4">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(pack.difficulty)}`}>
              {pack.difficulty}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          <div className="mb-3">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
              {pack.title}
            </h3>
            <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
              {pack.category}
            </p>
          </div>

          <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2 flex-1">
            {pack.description}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <ClockIcon className="w-4 h-4" />
                <span>{pack.duration}</span>
              </div>
              <div className="flex items-center space-x-1">
                <UsersIcon className="w-4 h-4" />
                <span>{pack.learners.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                {pack.rating}
              </span>
            </div>
          </div>

          {/* Instructor */}
          <div className="mb-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Instructor: <span className="text-slate-700 dark:text-slate-300">{pack.instructor}</span>
            </p>
          </div>

          {/* CTA Button */}
          <Link
            to={`/course/${pack.id}`}
            className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2 group-hover:shadow-lg"
          >
            <BookOpenIcon className="w-5 h-5" />
            <span>Start Learning</span>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
};

export default PackCard;