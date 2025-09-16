import React, { useState } from 'react';
import { BookOpen, Upload, User, Home, Shield, Star } from 'lucide-react';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import MySubmissions from './pages/MySubmissions';
import PackMarketplace from './pages/PackMarketplace';
import PackViewer from './pages/PackViewer';

type Page = 'home' | 'upload' | 'submissions' | 'marketplace' | 'viewer';
type UserRole = 'uploader' | 'learner' | null;

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [selectedPack, setSelectedPack] = useState<string | null>(null);

  const navigation = [
    { id: 'home', label: 'Home', icon: Home, show: true },
    { id: 'upload', label: 'Upload Content', icon: Upload, show: userRole === 'uploader' },
    { id: 'submissions', label: 'My Submissions', icon: User, show: userRole === 'uploader' },
    { id: 'marketplace', label: 'Cultural Packs', icon: BookOpen, show: userRole === 'learner' || userRole === 'uploader' },
  ];

  const handlePackSelect = (packId: string) => {
    setSelectedPack(packId);
    setCurrentPage('viewer');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onRoleSelect={setUserRole} />;
      case 'upload':
        return <UploadPage />;
      case 'submissions':
        return <MySubmissions />;
      case 'marketplace':
        return <PackMarketplace onPackSelect={handlePackSelect} />;
      case 'viewer':
        return <PackViewer packId={selectedPack} onBack={() => setCurrentPage('marketplace')} />;
      default:
        return <HomePage onRoleSelect={setUserRole} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-orange-500" />
              <h1 className="text-2xl font-bold text-orange-500">Thadam</h1>
              <span className="text-sm text-gray-400">தடம்</span>
            </div>
            
            {userRole && (
              <nav className="flex space-x-8">
                {navigation.filter(item => item.show).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id as Page)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentPage === item.id
                        ? 'bg-orange-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            )}

            {userRole && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-gray-700 px-3 py-1 rounded-full">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm capitalize">{userRole}</span>
                </div>
                <button
                  onClick={() => {
                    setUserRole(null);
                    setCurrentPage('home');
                  }}
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Switch Role
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-400">
            <p className="text-sm">
              Preserving Tamil heritage through technology • 
              <span className="text-orange-500 ml-1">🕉️</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;