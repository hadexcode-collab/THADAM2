import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const LandingPage = () => {
  const { loginAsDemo } = useAuth();

  const categories = [
    {
      id: 'kalakitchen',
      title: 'KalaKitchen',
      subtitle: 'Culinary Arts & Cooking',
      description: 'Master the art of cooking with AI-verified recipes and traditional techniques',
      icon: '👨‍🍳',
      gradient: 'from-orange-500 to-red-600',
      courses: '2,847',
      students: '45,000+'
    },
    {
      id: 'medical',
      title: 'Medical Sciences',
      subtitle: 'Healthcare & Medicine',
      description: 'Learn medical procedures, anatomy, and healthcare practices from experts',
      icon: '🏥',
      gradient: 'from-blue-500 to-cyan-600',
      courses: '1,234',
      students: '28,000+'
    },
    {
      id: 'culture',
      title: 'Cultural Heritage',
      subtitle: 'Arts & Traditions',
      description: 'Explore world cultures, traditional arts, and historical practices',
      icon: '🎭',
      gradient: 'from-purple-500 to-pink-600',
      courses: '892',
      students: '15,000+'
    },
    {
      id: 'technology',
      title: 'Technology',
      subtitle: 'Programming & IT',
      description: 'Master programming languages, web development, and emerging technologies',
      icon: '💻',
      gradient: 'from-green-500 to-teal-600',
      courses: '3,456',
      students: '78,000+'
    },
    {
      id: 'business',
      title: 'Business',
      subtitle: 'Entrepreneurship & Finance',
      description: 'Learn business strategies, finance, marketing, and leadership skills',
      icon: '📊',
      gradient: 'from-indigo-500 to-purple-600',
      courses: '1,567',
      students: '32,000+'
    },
    {
      id: 'arts',
      title: 'Creative Arts',
      subtitle: 'Design & Creativity',
      description: 'Unleash your creativity with design, photography, and artistic techniques',
      icon: '🎨',
      gradient: 'from-pink-500 to-rose-600',
      courses: '987',
      students: '22,000+'
    }
  ];

  const stats = [
    { label: 'Total Courses', value: '10,000+', icon: '📚' },
    { label: 'Expert Instructors', value: '2,500+', icon: '👨‍🏫' },
    { label: 'Active Students', value: '250,000+', icon: '🎓' },
    { label: 'Success Rate', value: '96%', icon: '🏆' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Engineer',
      content: 'The technology courses here transformed my career. The quality is unmatched!',
      avatar: '👩‍💻',
      rating: 5
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Medical Professional',
      content: 'Excellent medical courses with practical applications. Highly recommended!',
      avatar: '👨‍⚕️',
      rating: 5
    },
    {
      name: 'Chef Maria Rodriguez',
      role: 'Culinary Expert',
      content: 'KalaKitchen courses are authentic and professionally crafted. Amazing!',
      avatar: '👩‍🍳',
      rating: 5
    }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900" />
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 text-indigo-700 dark:text-indigo-300 px-6 py-3 rounded-full text-sm font-medium border border-indigo-200 dark:border-indigo-800"
              >
                <span>🚀</span>
                <span>Join 250,000+ learners worldwide</span>
              </motion.div>
              
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Learn Without
                </span>
                <br />
                <span className="text-slate-900 dark:text-white">
                  Limits
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
                Master new skills with our premium courses in cooking, medicine, culture, technology, and more. 
                Learn from world-class experts at your own pace.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => loginAsDemo('learner')}
                className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span>Start Learning Today</span>
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Button>
              <Button
                onClick={() => loginAsDemo('contributor')}
                className="group bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-8 py-4 rounded-xl text-lg font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300"
              >
                <span>Become an Instructor</span>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Explore Our Categories
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Discover world-class courses across multiple disciplines, taught by industry experts and verified professionals.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link to={`/category/${category.id}`}>
                  <Card hover className="group relative overflow-hidden h-full">
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                    <div className="relative p-8">
                      <div className="text-6xl mb-6">{category.icon}</div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-4">
                        {category.subtitle}
                      </p>
                      <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <span>📚</span>
                            <span>{category.courses} courses</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>👥</span>
                            <span>{category.students} students</span>
                          </div>
                        </div>
                        <div className="text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                          →
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              What Our Students Say
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Join thousands of successful learners who have transformed their careers and lives through our courses.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-8 h-full">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">⭐</span>
                    ))}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{testimonial.avatar}</div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Ready to Transform Your Future?
            </h2>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Join our community of learners and start your journey towards mastering new skills today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => loginAsDemo('learner')}
                className="bg-white text-indigo-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-slate-50 transition-all duration-300 transform hover:scale-105"
              >
                Start Learning Now
              </Button>
              <Button
                onClick={() => loginAsDemo('contributor')}
                className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-indigo-600 transition-all duration-300"
              >
                Become an Instructor
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;