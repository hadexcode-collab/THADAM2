import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', hover = false }) => {
  const Component = hover ? motion.div : 'div';
  const hoverProps = hover ? {
    whileHover: { y: -4, scale: 1.02 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <Component
      className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 transition-all duration-300 ${hover ? 'hover:shadow-2xl hover:border-indigo-200 dark:hover:border-indigo-800' : ''} ${className}`}
      {...hoverProps}
    >
      {children}
    </Component>
  );
};

export default Card;