import React from 'react';
import { Upload, BookOpen, Shield, CheckCircle, Users, Globe } from 'lucide-react';

interface HomePageProps {
  onRoleSelect: (role: 'uploader' | 'learner') => void;
}

const HomePage: React.FC<HomePageProps> = ({ onRoleSelect }) => {
  const features = [
    {
      icon: Shield,
      title: 'AI-Powered Authentication',
      description: 'Advanced ML pipeline verifies cultural knowledge authenticity with 80%+ accuracy threshold'
    },
    {
      icon: CheckCircle,
      title: 'Verified Cultural Packs',
      description: 'Structured learning materials from authenticated Tamil heritage content'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Uploaders contribute knowledge, learners access verified cultural wisdom'
    },
    {
      icon: Globe,
      title: 'Cultural Preservation',
      description: 'Preserving Tamil dances, medicines, rituals, and traditional practices'
    }
  ];

  const stats = [
    { label: 'Cultural Submissions', value: '1,247' },
    { label: 'Verified Packs', value: '89' },
    { label: 'Active Contributors', value: '156' },
    { label: 'Authenticity Rate', value: '94%' }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            Welcome to Thadam
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Preserve and authenticate Indian cultural knowledge through AI-powered verification. 
            From Tamil dances to traditional medicines, ensure cultural wisdom remains accurate for future generations.
          </p>
        </div>

        {/* Role Selection */}
        <div className="flex flex-col sm:flex-row justify-center gap-8 mt-12">
          <button
            onClick={() => onRoleSelect('uploader')}
            className="group relative bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white px-8 py-6 rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-orange-500/25"
          >
            <div className="flex flex-col items-center space-y-3">
              <Upload className="h-12 w-12" />
              <div>
                <div className="text-xl font-bold">I'm an Uploader</div>
                <div className="text-orange-100 text-sm">Contribute cultural content</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => onRoleSelect('learner')}
            className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-6 rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-blue-500/25"
          >
            <div className="flex flex-col items-center space-y-3">
              <BookOpen className="h-12 w-12" />
              <div>
                <div className="text-xl font-bold">I'm a Learner</div>
                <div className="text-blue-100 text-sm">Explore verified knowledge</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center space-y-2">
            <div className="text-3xl font-bold text-orange-400">{stat.value}</div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-orange-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10"
          >
            <div className="flex items-start space-x-4">
              <div className="bg-orange-500/10 p-3 rounded-lg">
                <feature.icon className="h-6 w-6 text-orange-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 p-8 rounded-xl border border-orange-500/20 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          Ready to Preserve Tamil Heritage?
        </h2>
        <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
          Join our community of cultural preservationists. Upload authentic content or learn from verified cultural packs.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => onRoleSelect('uploader')}
            className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Start Contributing
          </button>
          <button
            onClick={() => onRoleSelect('learner')}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Explore Knowledge
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;