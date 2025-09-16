import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import CourseCard from '../components/features/CourseCard';

const CategoryPage = () => {
  const { category } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  const categoryData = {
    kalakitchen: {
      title: 'KalaKitchen',
      subtitle: 'Culinary Arts & Cooking',
      description: 'Master the art of cooking with AI-verified recipes and traditional techniques from world-renowned chefs.',
      icon: '👨‍🍳',
      gradient: 'from-orange-500 to-red-600',
      totalCourses: 2847,
      totalStudents: 45000
    },
    medical: {
      title: 'Medical Sciences',
      subtitle: 'Healthcare & Medicine',
      description: 'Learn medical procedures, anatomy, and healthcare practices from certified medical professionals.',
      icon: '🏥',
      gradient: 'from-blue-500 to-cyan-600',
      totalCourses: 1234,
      totalStudents: 28000
    },
    culture: {
      title: 'Cultural Heritage',
      subtitle: 'Arts & Traditions',
      description: 'Explore world cultures, traditional arts, and historical practices with expert cultural historians.',
      icon: '🎭',
      gradient: 'from-purple-500 to-pink-600',
      totalCourses: 892,
      totalStudents: 15000
    },
    technology: {
      title: 'Technology',
      subtitle: 'Programming & IT',
      description: 'Master programming languages, web development, and emerging technologies with industry experts.',
      icon: '💻',
      gradient: 'from-green-500 to-teal-600',
      totalCourses: 3456,
      totalStudents: 78000
    },
    business: {
      title: 'Business',
      subtitle: 'Entrepreneurship & Finance',
      description: 'Learn business strategies, finance, marketing, and leadership skills from successful entrepreneurs.',
      icon: '📊',
      gradient: 'from-indigo-500 to-purple-600',
      totalCourses: 1567,
      totalStudents: 32000
    },
    arts: {
      title: 'Creative Arts',
      subtitle: 'Design & Creativity',
      description: 'Unleash your creativity with design, photography, and artistic techniques from professional artists.',
      icon: '🎨',
      gradient: 'from-pink-500 to-rose-600',
      totalCourses: 987,
      totalStudents: 22000
    }
  };

  const currentCategory = categoryData[category as keyof typeof categoryData];

  const mockCourses = [
    {
      id: '1',
      title: 'Complete Italian Cooking Masterclass',
      instructor: 'Chef Marco Rossi',
      rating: 4.9,
      students: 12547,
      price: 89.99,
      originalPrice: 129.99,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=225&fit=crop',
      level: 'Intermediate',
      duration: '12.5 hours',
      bestseller: true
    },
    {
      id: '2',
      title: 'Traditional Japanese Cuisine',
      instructor: 'Chef Sakura Tanaka',
      rating: 4.8,
      students: 8934,
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=225&fit=crop',
      level: 'Beginner',
      duration: '8.5 hours',
      featured: true
    },
    {
      id: '3',
      title: 'French Pastry & Desserts',
      instructor: 'Chef Pierre Dubois',
      rating: 4.9,
      students: 15623,
      price: 99.99,
      originalPrice: 149.99,
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=225&fit=crop',
      level: 'Advanced',
      duration: '15.5 hours',
      bestseller: true
    },
    {
      id: '4',
      title: 'Healthy Mediterranean Diet',
      instructor: 'Chef Elena Vasquez',
      rating: 4.7,
      students: 6789,
      price: 69.99,
      image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=225&fit=crop',
      level: 'Beginner',
      duration: '6.5 hours'
    },
    {
      id: '5',
      title: 'Indian Spice Mastery',
      instructor: 'Chef Raj Patel',
      rating: 4.8,
      students: 9876,
      price: 74.99,
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=225&fit=crop',
      level: 'Intermediate',
      duration: '10.5 hours'
    },
    {
      id: '6',
      title: 'Molecular Gastronomy Basics',
      instructor: 'Chef David Kim',
      rating: 4.6,
      students: 3456,
      price: 119.99,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=225&fit=crop',
      level: 'Advanced',
      duration: '18.5 hours'
    }
  ];

  if (!currentCategory) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Category Not Found</h1>
          <p className="text-slate-600 dark:text-slate-400">The requested category does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${currentCategory.gradient} p-12 text-white`}
          >
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-6">
                <div className="text-6xl">{currentCategory.icon}</div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">{currentCategory.title}</h1>
                  <p className="text-xl opacity-90">{currentCategory.subtitle}</p>
                </div>
              </div>
              <p className="text-lg opacity-90 max-w-3xl mb-6">
                {currentCategory.description}
              </p>
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold">{currentCategory.totalCourses.toLocaleString()}</div>
                  <div className="text-sm opacity-75">Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{currentCategory.totalStudents.toLocaleString()}+</div>
                  <div className="text-sm opacity-75">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">4.8</div>
                  <div className="text-sm opacity-75">Avg Rating</div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-black/10" />
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">🔍</span>
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            {/* Price Filter */}
            <select
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value)}
              className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All Prices</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
              <option value="under50">Under $50</option>
              <option value="50to100">$50 - $100</option>
              <option value="over100">Over $100</option>
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
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-600 dark:text-slate-400">
            Showing {mockCourses.length} of {currentCategory.totalCourses.toLocaleString()} courses
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockCourses.map((course, index) => (
            <CourseCard key={course.id} course={course} index={index} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button className="px-8 py-3">
            Load More Courses
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;