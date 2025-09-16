import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const footerLinks = {
    'Company': [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Blog', href: '/blog' },
    ],
    'Support': [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
    ],
    'Community': [
      { name: 'Become a Chef', href: '/teach' },
      { name: 'Recipe Guidelines', href: '/guidelines' },
      { name: 'Affiliate Program', href: '/affiliate' },
      { name: 'Referrals', href: '/referrals' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: '📘', href: '#' },
    { name: 'Twitter', icon: '🐦', href: '#' },
    { name: 'Instagram', icon: '📷', href: '#' },
    { name: 'YouTube', icon: '📺', href: '#' },
  ];

  return (
    <footer className="bg-dark-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <span className="text-white">🍳</span>
              </div>
              <div>
                <h1 className="text-xl font-display font-bold">RecipeHub</h1>
                <p className="text-xs text-dark-400">Premium Recipes</p>
              </div>
            </Link>
            <p className="text-dark-300 mb-6 max-w-md">
              Discover and master the world's finest recipes from professional chefs. 
              Transform your cooking with our premium recipe marketplace.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-dark-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-white mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-dark-300 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-dark-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-dark-400 text-sm">
            © 2024 RecipeHub. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <Link to="/terms" className="text-dark-400 hover:text-white text-sm transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="text-dark-400 hover:text-white text-sm transition-colors">
              Privacy
            </Link>
            <Link to="/cookies" className="text-dark-400 hover:text-white text-sm transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;