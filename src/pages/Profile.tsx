import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';

const Profile = () => {
  const { user } = useAuth();

  const submissions = [
    {
      id: 1,
      title: 'Bharatanatyam Hand Gestures',
      category: 'Tamil Classical Dance',
      status: 'verified',
      authenticity: 94,
      submittedAt: '2024-01-15',
      views: 1247
    },
    {
      id: 2,
      title: 'Traditional Siddha Medicine',
      category: 'Traditional Medicine',
      status: 'review',
      authenticity: 78,
      submittedAt: '2024-01-10',
      views: 856
    },
    {
      id: 3,
      title: 'Tamil Folk Songs',
      category: 'Musical Heritage',
      status: 'processing',
      authenticity: null,
      submittedAt: '2024-01-08',
      views: 0
    },
    {
      id: 4,
      title: 'Temple Architecture Basics',
      category: 'Architectural Styles',
      status: 'verified',
      authenticity: 91,
      submittedAt: '2024-01-05',
      views: 623
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return '✅';
      case 'review':
        return '⚠️';
      case 'processing':
        return '⏳';
      default:
        return '❓';
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

  const stats = [
    { label: 'Total Submissions', value: submissions.length, icon: '📊' },
    { label: 'Verified Content', value: submissions.filter(s => s.status === 'verified').length, icon: '✅' },
    { label: 'Total Views', value: submissions.reduce((sum, s) => sum + s.views, 0).toLocaleString(), icon: '👁️' },
    { label: 'Avg. Authenticity', value: '92%', icon: '🏆' }
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-8">
              <div className="flex items-start space-x-6">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">
                    {user?.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    {user?.name}
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    {user?.email}
                  </p>
                  <div className="flex items-center space-x-4">
                    <span className="bg-indigo-100 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-400 px-3 py-1 rounded-full text-sm font-medium capitalize">
                      {user?.role}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 text-sm">
                      Member since January 2024
                    </span>
                  </div>
                </div>
                <button className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 p-3 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                  ⚙️
                </button>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-2xl">
                    {stat.icon}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Submissions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                My Submissions
              </h2>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {submissions.map((submission) => (
                <div key={submission.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-slate-900 dark:text-white">
                          {submission.title}
                        </h3>
                        <span className="text-xl">{getStatusIcon(submission.status)}</span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        {submission.category}
                      </p>
                      <div className="flex items-center space-x-6">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                          {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                        </span>
                        {submission.authenticity && (
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-slate-200 dark:bg-slate-600 rounded-full h-2">
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
                        <div className="flex items-center space-x-1 text-sm text-slate-500 dark:text-slate-400">
                          <span>👁️</span>
                          <span>{submission.views.toLocaleString()} views</span>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {new Date(submission.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                      👁️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;