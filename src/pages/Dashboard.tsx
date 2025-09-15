import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  PlusCircleIcon,
  BookOpenIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Total Submissions', value: '12', icon: ChartBarIcon, color: 'from-blue-500 to-indigo-600' },
    { label: 'Verified Content', value: '8', icon: CheckCircleIcon, color: 'from-green-500 to-emerald-600' },
    { label: 'Under Review', value: '3', icon: ClockIcon, color: 'from-yellow-500 to-orange-600' },
    { label: 'Learning Packs', value: '5', icon: BookOpenIcon, color: 'from-purple-500 to-pink-600' }
  ];

  const recentSubmissions = [
    {
      id: 1,
      title: 'Bharatanatyam Hand Gestures',
      category: 'Tamil Classical Dance',
      status: 'verified',
      authenticity: 94,
      submittedAt: '2 days ago'
    },
    {
      id: 2,
      title: 'Traditional Siddha Medicine',
      category: 'Traditional Medicine',
      status: 'review',
      authenticity: 78,
      submittedAt: '5 days ago'
    },
    {
      id: 3,
      title: 'Tamil Folk Songs',
      category: 'Musical Heritage',
      status: 'processing',
      authenticity: null,
      submittedAt: '1 week ago'
    }
  ];

  const achievements = [
    { title: 'Cultural Contributor', description: 'Uploaded 10+ verified content pieces', earned: true },
    { title: 'Heritage Guardian', description: 'Maintained 90%+ authenticity rate', earned: true },
    { title: 'Community Leader', description: 'Content viewed by 1000+ learners', earned: false }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'review':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'processing':
        return <ClockIcon className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'review':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">
                Track your cultural contributions and learning progress
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <Link
                to="/upload"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2"
              >
                <PlusCircleIcon className="w-5 h-5" />
                <span>Upload Content</span>
              </Link>
              <Link
                to="/catalog"
                className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-6 py-3 rounded-lg font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center space-x-2"
              >
                <BookOpenIcon className="w-5 h-5" />
                <span>Browse Catalog</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Submissions */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Recent Submissions
                  </h2>
                  <Link
                    to="/profile"
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm font-medium"
                  >
                    View All
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {recentSubmissions.map((submission) => (
                  <div key={submission.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium text-slate-900 dark:text-white">
                            {submission.title}
                          </h3>
                          {getStatusIcon(submission.status)}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                          {submission.category}
                        </p>
                        <div className="flex items-center space-x-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                            {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                          </span>
                          {submission.authenticity && (
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    submission.authenticity >= 80 ? 'bg-green-500' : 'bg-yellow-500'
                                  }`}
                                  style={{ width: `${submission.authenticity}%` }}
                                />
                              </div>
                              <span className="text-sm text-slate-600 dark:text-slate-400">
                                {submission.authenticity}%
                              </span>
                            </div>
                          )}
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {submission.submittedAt}
                          </span>
                        </div>
                      </div>
                      <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                        <EyeIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Achievements */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6"
            >
              <div className="flex items-center space-x-2 mb-6">
                <TrophyIcon className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Achievements
                </h2>
              </div>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      achievement.earned
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                        : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        achievement.earned ? 'bg-yellow-500' : 'bg-slate-400'
                      }`}>
                        <TrophyIcon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-medium ${
                          achievement.earned
                            ? 'text-yellow-800 dark:text-yellow-200'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}>
                          {achievement.title}
                        </h3>
                        <p className={`text-sm ${
                          achievement.earned
                            ? 'text-yellow-700 dark:text-yellow-300'
                            : 'text-slate-500 dark:text-slate-500'
                        }`}>
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white mt-6"
            >
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/upload"
                  className="block w-full bg-white/20 hover:bg-white/30 rounded-lg p-3 text-center font-medium transition-colors"
                >
                  Upload New Content
                </Link>
                <Link
                  to="/catalog"
                  className="block w-full bg-white/20 hover:bg-white/30 rounded-lg p-3 text-center font-medium transition-colors"
                >
                  Explore Learning Packs
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;