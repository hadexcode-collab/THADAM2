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
  const baseClasses = `rounded-xl border transition-all duration-300 ${
    gradient 
      ? 'bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-slate-800/80 dark:to-slate-900/80 backdrop-blur-sm border-white/20 dark:border-slate-700/50' 
      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
  }`;

  const hoverClasses = hover ? 'hover:shadow-xl hover:-translate-y-1 hover:border-indigo-200 dark:hover:border-indigo-800' : '';

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