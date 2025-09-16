import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import UploadContent from './pages/UploadContent';
import PackCatalog from './pages/PackCatalog';
import PackViewer from './pages/PackViewer';
import Profile from './pages/Profile';
import { Toaster } from './components/ui/Toaster';

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 transition-all duration-300">
      <Navbar />
      <main className="relative">
        <Routes>
          <Route path="/" element={isAuthenticated ? <Dashboard /> : <LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadContent />} />
          <Route path="/catalog" element={<PackCatalog />} />
          <Route path="/pack/:id" element={<PackViewer />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      <Toaster />
    </div>
  );
};
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;