import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheckIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface AuthenticityBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

const AuthenticityBadge: React.FC<AuthenticityBadgeProps> = ({
  score,
  size = 'md',
  showLabel = true,
  animated = true
}) => {
  const getStatus = (score: number) => {
    if (score >= 80) return 'verified';
    if (score >= 70) return 'review';
    return 'rejected';
  };

  const status = getStatus(score);

  const statusConfig = {
    verified: {
      icon: ShieldCheckIcon,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-100 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      label: 'Verified'
    },
    review: {
      icon: ExclamationTriangleIcon,
      color: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-100 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      label: 'Under Review'
    },
    rejected: {
      icon: XCircleIcon,
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-100 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      label: 'Needs Improvement'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  const sizes = {
    sm: { icon: 'w-4 h-4', text: 'text-xs', padding: 'px-2 py-1' },
    md: { icon: 'w-5 h-5', text: 'text-sm', padding: 'px-3 py-1.5' },
    lg: { icon: 'w-6 h-6', text: 'text-base', padding: 'px-4 py-2' }
  };

  const sizeConfig = sizes[size];

  const BadgeContent = (
    <div className={`inline-flex items-center space-x-2 ${sizeConfig.padding} ${config.bg} ${config.border} border rounded-full font-medium ${config.color}`}>
      <Icon className={sizeConfig.icon} />
      <span className={sizeConfig.text}>
        {showLabel ? `${config.label} ${score}%` : `${score}%`}
      </span>
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        whileHover={{ scale: 1.05 }}
      >
        {BadgeContent}
      </motion.div>
    );
  }

  return BadgeContent;
};

export default AuthenticityBadge;