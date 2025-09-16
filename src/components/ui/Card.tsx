import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false,
  gradient = false 
}) => {
  const baseClasses = `rounded-2xl border transition-all duration-300 ${
    gradient 
      ? 'bg-gradient-to-br from-white/90 to-white/70 dark:from-dark-800/90 dark:to-dark-900/70 backdrop-blur-sm border-white/20 dark:border-dark-700/50' 
      : 'bg-white dark:bg-dark-800 border-dark-200 dark:border-dark-700'
  }`;

  const hoverClasses = hover ? 'hover:shadow-2xl hover:-translate-y-1 hover:border-primary-200 dark:hover:border-primary-800' : '';

  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className={`${baseClasses} ${hoverClasses} ${className}`}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseClasses} ${className}`}>
      {children}
    </div>
  );
};

export default Card;