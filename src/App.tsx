import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import UploadContent from './pages/UploadContent';
import PackCatalog from './pages/PackCatalog';
import PackViewer from './pages/PackViewer';
import Profile from './pages/Profile';
import CategoryPage from './pages/CategoryPage';
import CoursePage from './pages/CoursePage';
import SearchResults from './pages/SearchResults';
import { Toaster } from './components/ui/Toaster';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/upload" element={<UploadContent />} />
                  <Route path="/catalog" element={<PackCatalog />} />
                  <Route path="/pack/:id" element={<PackViewer />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/category/:category" element={<CategoryPage />} />
                  <Route path="/course/:id" element={<CoursePage />} />
                  <Route path="/search" element={<SearchResults />} />
                </Routes>
              </main>
              <Footer />
              <Toaster />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;