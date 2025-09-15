import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
  ClockIcon,
  UsersIcon,
  ShieldCheckIcon,
  PlayIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

interface Pack {
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
  tags: string[];
}

const PackCatalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  const categories = [
    'Tamil Classical Dance',
    'Traditional Medicine',
    'Religious Rituals',
    'Folk Arts',
    'Culinary Traditions',
    'Musical Heritage',
    'Architectural Styles',
    'Literary Works',
    'Martial Arts',
    'Textile Arts'
  ];

  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  const packs: Pack[] = [
    {
      id: '1',
      title: 'Bharatanatyam Fundamentals',
      category: 'Tamil Classical Dance',
      description: 'Master the basic positions, hand gestures, and movements of this classical dance form.',
      authenticity: 96,
      difficulty: 'Beginner',
      duration: '4.5 hours',
      learners: 1247,
      rating: 4.9,
      instructor: 'Guru Meera Krishnan',
      thumbnail: '🩰',
      tags: ['dance', 'classical', 'positions', 'mudras']
    },
    {
      id: '2',
      title: 'Traditional Siddha Medicine',
      category: 'Traditional Medicine',
      description: 'Learn about ancient Tamil medical practices, herbs, and healing techniques.',
      authenticity: 89,
      difficulty: 'Intermediate',
      duration: '6.2 hours',
      learners: 856,
      rating: 4.7,
      instructor: 'Dr. Rajesh Vaidyar',
      thumbnail: '🌿',
      tags: ['medicine', 'herbs', 'healing', 'traditional']
    },
    {
      id: '3',
      title: 'Tamil Temple Architecture',
      category: 'Architectural Styles',
      description: 'Explore the intricate designs and spiritual significance of Tamil temple construction.',
      authenticity: 94,
      difficulty: 'Advanced',
      duration: '8.1 hours',
      learners: 623,
      rating: 4.8,
      instructor: 'Prof. Anand Kumar',
      thumbnail: '🏛️',
      tags: ['architecture', 'temples', 'design', 'spirituality']
    },
    {
      id: '4',
      title: 'Carnatic Music Basics',
      category: 'Musical Heritage',
      description: 'Introduction to Tamil classical music, ragas, and traditional compositions.',
      authenticity: 92,
      difficulty: 'Beginner',
      duration: '5.3 hours',
      learners: 934,
      rating: 4.6,
      instructor: 'Vidwan Suresh Iyer',
      thumbnail: '🎵',
      tags: ['music', 'carnatic', 'ragas', 'classical']
    },
    {
      id: '5',
      title: 'Traditional Tamil Cuisine',
      category: 'Culinary Traditions',
      description: 'Authentic recipes and cooking techniques passed down through generations.',
      authenticity: 91,
      difficulty: 'Intermediate',
      duration: '3.8 hours',
      learners: 1156,
      rating: 4.8,
      instructor: 'Chef Lakshmi Devi',
      thumbnail: '🍛',
      tags: ['cooking', 'recipes', 'traditional', 'spices']
    },
    {
      id: '6',
      title: 'Silambam Martial Arts',
      category: 'Martial Arts',
      description: 'Learn the ancient Tamil martial art of stick fighting and self-defense.',
      authenticity: 88,
      difficulty: 'Advanced',
      duration: '7.2 hours',
      learners: 445,
      rating: 4.7,
      instructor: 'Master Vel Murugan',
      thumbnail: '🥋',
      tags: ['martial arts', 'silambam', 'self-defense', 'traditional']
    }
  ];

  const filteredPacks = packs.filter(pack => {
    const matchesSearch = pack.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pack.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pack.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategory || pack.category === selectedCategory;
    const matchesDifficulty = !selectedDifficulty || pack.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const sortedPacks = [...filteredPacks].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.learners - a.learners;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return 0; // Would sort by creation date
      case 'authenticity':
        return b.authenticity - a.authenticity;
      default:
        return 0;
    }
  });

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
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Cultural Learning Catalog
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Discover verified Tamil cultural knowledge through expertly crafted learning experiences
            </p>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search learning packs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All Levels</option>
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
              <option value="authenticity">Most Authentic</option>
            </select>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-600 dark:text-slate-400">
            Showing {sortedPacks.length} of {packs.length} learning packs
          </p>
          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-5 h-5 text-slate-400" />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {(selectedCategory || selectedDifficulty || searchTerm) ? 'Filtered' : 'All packs'}
            </span>
          </div>
        </div>

        {/* Pack Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedPacks.map((pack, index) => (
            <motion.div
              key={pack.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Thumbnail */}
              <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 h-48 flex items-center justify-center">
                <div className="text-6xl">{pack.thumbnail}</div>
                <div className="absolute top-4 left-4 flex items-center space-x-2">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                    <ShieldCheckIcon className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-medium">{pack.authenticity}%</span>
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(pack.difficulty)}`}>
                    {pack.difficulty}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                    <PlayIcon className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-3">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {pack.title}
                  </h3>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                    {pack.category}
                  </p>
                </div>

                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">
                  {pack.description}
                </p>

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

                <div className="mb-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Instructor: <span className="text-slate-700 dark:text-slate-300">{pack.instructor}</span>
                  </p>
                </div>

                <Link
                  to={`/pack/${pack.id}`}
                  className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <BookOpenIcon className="w-5 h-5" />
                  <span>Start Learning</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {sortedPacks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <BookOpenIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-2">
              No learning packs found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Try adjusting your search criteria or browse all categories
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSelectedDifficulty('');
              }}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PackCatalog;