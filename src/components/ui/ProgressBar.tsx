import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  color?: 'indigo' | 'green' | 'yellow' | 'red';
  size?: 'sm' | 'md' | 'lg';
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  className = '',
  showLabel = false,
  color = 'indigo',
  size = 'md'
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colors = {
    indigo: 'bg-gradient-to-r from-indigo-500 to-purple-600',
    green: 'bg-gradient-to-r from-green-500 to-emerald-600',
    yellow: 'bg-gradient-to-r from-yellow-500 to-orange-600',
    red: 'bg-gradient-to-r from-red-500 to-pink-600'
  };

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-1">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-200 dark:bg-slate-700 rounded-full ${sizes[size]}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`${sizes[size]} ${colors[color]} rounded-full`}
        />
      </div>
    </div>
  );
};

export default ProgressBar;