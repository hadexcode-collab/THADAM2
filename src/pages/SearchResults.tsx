import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CourseCard from '../components/features/CourseCard';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<any[]>([]);

  // Mock search results
  const mockResults = [
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
      title: 'Medical Anatomy Fundamentals',
      instructor: 'Dr. Sarah Johnson',
      rating: 4.7,
      students: 6789,
      price: 99.99,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=225&fit=crop',
      level: 'Beginner',
      duration: '15.5 hours'
    }
  ];

  useEffect(() => {
    // Simulate search API call
    const searchCourses = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter mock results based on query
      const filteredResults = mockResults.filter(course =>
        course.title.toLowerCase().includes(query.toLowerCase()) ||
        course.instructor.toLowerCase().includes(query.toLowerCase())
      );
      
      setResults(filteredResults);
      setLoading(false);
    };

    if (query) {
      searchCourses();
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-slate-600 dark:text-slate-400">Searching courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Search Results
            </h1>
            {query && (
              <p className="text-slate-600 dark:text-slate-400">
                Showing results for "<span className="font-medium">{query}</span>"
              </p>
            )}
          </motion.div>
        </div>

        {/* Results */}
        {!query ? (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Start Your Search
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Enter a search term to find courses across all categories
            </p>
            <Link to="/">
              <Button>Browse All Categories</Button>
            </Link>
          </Card>
        ) : results.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              No Results Found
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              We couldn't find any courses matching "{query}". Try different keywords or browse our categories.
            </p>
            <Link to="/">
              <Button>Browse All Categories</Button>
            </Link>
          </Card>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-slate-600 dark:text-slate-400">
                Found {results.length} course{results.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {results.map((course, index) => (
                <CourseCard key={course.id} course={course} index={index} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;