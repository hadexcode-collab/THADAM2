import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    instructor: string;
    rating: number;
    students: number;
    price: number;
    originalPrice?: number;
    image: string;
    level: string;
    duration: string;
    bestseller?: boolean;
    featured?: boolean;
  };
  index?: number;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, index = 0 }) => {
  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'advanced':
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
        <Link to={`/course/${course.id}`}>
          {/* Image */}
          <div className="relative aspect-video overflow-hidden">
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Overlay badges */}
            <div className="absolute top-4 left-4 flex flex-col space-y-2">
              {course.bestseller && (
                <Badge variant="gold" size="sm">Bestseller</Badge>
              )}
              {course.featured && (
                <Badge variant="primary" size="sm">Featured</Badge>
              )}
            </div>

            {/* Favorite button */}
            <button className="absolute top-4 right-4 w-8 h-8 bg-white/90 dark:bg-slate-800/90 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-colors">
              <span className="text-red-500">❤️</span>
            </button>

            {/* Level badge */}
            <div className="absolute bottom-4 left-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                {course.level}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Instructor info */}
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">👨‍🏫</span>
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-400">{course.instructor}</span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
              {course.title}
            </h3>

            {/* Meta info */}
            <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <span>⏰</span>
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>👥</span>
                  <span>{course.students.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-yellow-400">⭐</span>
                <span className="font-medium">{course.rating}</span>
              </div>
            </div>

            {/* Price and action */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  ${course.price}
                </span>
                {course.originalPrice && (
                  <span className="text-sm text-slate-500 dark:text-slate-400 line-through">
                    ${course.originalPrice}
                  </span>
                )}
              </div>
              
              <Button size="sm">
                Enroll Now
              </Button>
            </div>
          </div>
        </Link>
      </Card>
    </motion.div>
  );
};

export default CourseCard;