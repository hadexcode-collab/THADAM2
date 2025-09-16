import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const PackCatalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

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

  const mockPacks = [
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
      thumbnail: '🩰'
    },
    {
      id: '2',
      title: 'Traditional Siddha Medicine',
      category: 'Traditional Medicine',
      description: 'Learn about ancient medical practices and healing techniques.',
      authenticity: 89,
      difficulty: 'Intermediate',
      duration: '6.2 hours',
      learners: 856,
      rating: 4.7,
      instructor: 'Dr. Rajesh Vaidyar',
      thumbnail: '🌿'
    },
    {
      id: '3',
      title: 'Tamil Temple Architecture',
      category: 'Architectural Styles',
      description: 'Explore the intricate designs and spiritual significance of Tamil temples.',
      authenticity: 94,
      difficulty: 'Advanced',
      duration: '8.1 hours',
      learners: 623,
      rating: 4.8,
      instructor: 'Prof. Anand Kumar',
      thumbnail: '🏛️'
    },
    {
      id: '4',
      title: 'Folk Music Traditions',
      category: 'Musical Heritage',
      description: 'Discover the rich tradition of Tamil folk music and instruments.',
      authenticity: 91,
      difficulty: 'Beginner',
      duration: '3.8 hours',
      learners: 934,
      rating: 4.6,
      instructor: 'Maestro Ravi Shankar',
      thumbnail: '🎵'
    },
    {
      id: '5',
      title: 'Traditional Cooking Methods',
      category: 'Culinary Traditions',
      description: 'Learn authentic Tamil cooking techniques passed down through generations.',
      authenticity: 88,
      difficulty: 'Intermediate',
      duration: '5.3 hours',
      learners: 1156,
      rating: 4.5,
      instructor: 'Chef Lakshmi Devi',
      thumbnail: '🍛'
    },
    {
      id: '6',
      title: 'Textile Weaving Arts',
      category: 'Textile Arts',
      description: 'Master the traditional art of Tamil textile weaving and patterns.',
      authenticity: 93,
      difficulty: 'Advanced',
      duration: '7.2 hours',
      learners: 445,
      rating: 4.8,
      instructor: 'Master Weaver Kamala',
      thumbnail: '🧵'
    }
  ];

  const filteredPacks = mockPacks.filter(pack => {
    const matchesSearch = pack.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pack.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || pack.category === selectedCategory;
    const matchesDifficulty = !selectedDifficulty || pack.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
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
              Discover verified cultural knowledge through expertly crafted learning experiences
            </p>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2 relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">🔍</span>
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
              <select className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
                <option value="authenticity">Most Authentic</option>
              </select>
            </div>
          </Card>
        </motion.div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-600 dark:text-slate-400">
            Showing {filteredPacks.length} of {mockPacks.length} learning packs
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">🔽</span>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {(selectedCategory || selectedDifficulty || searchTerm) ? 'Filtered' : 'All packs'}
            </span>
          </div>
        </div>

        {/* Pack Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPacks.map((pack, index) => (
            <motion.div
              key={pack.id}
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
                      <span className="text-white text-2xl">▶️</span>
                    </motion.div>
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <span>🛡️</span>
                      <span>{pack.authenticity}%</span>
                    </div>
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
                        <span>⏰</span>
                        <span>{pack.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>👥</span>
                        <span>{pack.learners.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">⭐</span>
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
                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2 group-hover:shadow-lg">
                    <span>📚</span>
                    <span>Start Learning</span>
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPacks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">📚</div>
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