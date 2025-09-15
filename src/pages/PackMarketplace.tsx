import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Users, Star, Shield, Search } from 'lucide-react';
import { mockApi, CulturalPack } from '../services/mockApi';

interface PackMarketplaceProps {
  onPackSelect: (packId: string) => void;
}

const PackMarketplace: React.FC<PackMarketplaceProps> = ({ onPackSelect }) => {
  const [packs, setPacks] = useState<CulturalPack[]>([]);
  const [loading, setLoading] = useState(true);
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
    'Literary Works'
  ];

  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    fetchPacks();
  }, []);

  const fetchPacks = async () => {
    try {
      const data = await mockApi.getPacks();
      setPacks(data);
    } catch (error) {
      console.error('Failed to fetch packs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPacks = packs.filter(pack => {
    const matchesSearch = pack.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pack.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || pack.category === selectedCategory;
    const matchesDifficulty = !selectedDifficulty || pack.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'text-green-400 bg-green-400/10';
      case 'Intermediate':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'Advanced':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-white">Cultural Learning Packs</h1>
        <p className="text-gray-400 text-lg">
          Explore verified Tamil cultural knowledge through structured learning experiences
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search packs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          >
            <option value="">All Difficulties</option>
            {difficulties.map(difficulty => (
              <option key={difficulty} value={difficulty}>{difficulty}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Packs Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPacks.map((pack) => (
          <div
            key={pack.id}
            className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-orange-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 cursor-pointer"
            onClick={() => onPackSelect(pack.id)}
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">
                    Verified {pack.authenticity_score}%
                  </span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(pack.difficulty)}`}>
                  {pack.difficulty}
                </span>
              </div>

              {/* Title and Category */}
              <div>
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                  {pack.title}
                </h3>
                <span className="text-orange-400 text-sm">{pack.category}</span>
              </div>

              {/* Description */}
              <p className="text-gray-400 text-sm line-clamp-3">
                {pack.description}
              </p>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{pack.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{pack.learners_count}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-yellow-400">4.8</span>
                </div>
              </div>

              {/* Attribution */}
              <div className="pt-3 border-t border-gray-700">
                <p className="text-xs text-gray-500">
                  Contributed by: <span className="text-gray-400">{pack.uploader_attribution}</span>
                </p>
              </div>

              {/* Action Button */}
              <button className="w-full bg-orange-600 hover:bg-orange-500 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>Start Learning</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPacks.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-400 mb-2">No packs found</h3>
          <p className="text-gray-500">Try adjusting your search filters</p>
        </div>
      )}
    </div>
  );
};

export default PackMarketplace;