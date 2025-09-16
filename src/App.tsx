import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/layout/Navbar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import UploadContent from './pages/UploadContent';
import PackCatalog from './pages/PackCatalog';
import Profile from './pages/Profile';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/upload" element={<UploadContent />} />
                <Route path="/catalog" element={<PackCatalog />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;