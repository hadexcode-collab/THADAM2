import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  ShieldCheckIcon, 
  BookOpenIcon, 
  UsersIcon, 
  GlobeAltIcon,
  PlayIcon,
  StarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const LandingPage = () => {
  const { loginAsDemo } = useAuth();

  const features = [
    {
      icon: ShieldCheckIcon,
      title: 'AI-Powered Verification',
      description: 'Advanced machine learning algorithms verify the authenticity of cultural content with 95% accuracy.',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: BookOpenIcon,
      title: 'Structured Learning',
      description: 'Transform verified content into comprehensive learning packs with interactive elements.',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: UsersIcon,
      title: 'Community Driven',
      description: 'Connect with cultural experts and enthusiasts to preserve and share traditional knowledge.',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: GlobeAltIcon,
      title: 'Global Preservation',
      description: 'Help preserve Tamil heritage and traditional practices for future generations worldwide.',
      color: 'from-orange-500 to-red-600'
    }
  ];

  const stats = [
    { label: 'Cultural Artifacts', value: '2,847', suffix: '+' },
    { label: 'Verified Packs', value: '156', suffix: '+' },
    { label: 'Active Contributors', value: '1,200', suffix: '+' },
    { label: 'Authenticity Rate', value: '95', suffix: '%' }
  ];

  const testimonials = [
    {
      name: 'Dr. Meera Krishnan',
      role: 'Cultural Historian',
      content: 'Thadam has revolutionized how we preserve and share traditional Tamil knowledge. The AI verification gives us confidence in authenticity.',
      avatar: '👩‍🏫'
    },
    {
      name: 'Rajesh Kumar',
      role: 'Dance Instructor',
      content: 'As a Bharatanatyam teacher, I love how the platform transforms my knowledge into structured learning experiences.',
      avatar: '🕺'
    },
    {
      name: 'Priya Sharma',
      role: 'Medical Researcher',
      content: 'The traditional medicine verification process is incredibly thorough. It helps separate authentic practices from myths.',
      avatar: '👩‍⚕️'
    }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
        
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Preserve
                </span>
                <br />
                <span className="text-slate-900 dark:text-white">
                  Tamil Heritage
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
                AI-powered platform to authenticate, preserve, and share traditional Tamil culture, 
                medicines, dances, and ancient wisdom for future generations.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => loginAsDemo('contributor')}
                className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <span>Start Contributing</span>
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => loginAsDemo('learner')}
                className="group bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-8 py-4 rounded-xl text-lg font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 flex items-center space-x-2"
              >
                <PlayIcon className="w-5 h-5" />
                <span>Explore Catalog</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.value}{stat.suffix}
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

      {/* Features Section */}
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
              Powered by Advanced AI
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Our cutting-edge technology ensures authentic cultural preservation while making knowledge accessible to everyone.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {feature.description}
                </p>
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
              Trusted by Cultural Experts
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Join thousands of cultural preservationists who trust Thadam to maintain the authenticity of traditional knowledge.
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
                className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
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
              Ready to Preserve Cultural Heritage?
            </h2>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Join our community of cultural preservationists and help ensure traditional Tamil knowledge lives on for future generations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => loginAsDemo('contributor')}
                className="bg-white text-indigo-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-slate-50 transition-all duration-300 transform hover:scale-105"
              >
                Start Contributing Today
              </button>
              <button
                onClick={() => loginAsDemo('learner')}
                className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-indigo-600 transition-all duration-300"
              >
                Explore Learning Packs
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;