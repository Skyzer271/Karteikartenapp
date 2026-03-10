import React from 'react';
import { motion } from 'motion/react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  const Component = onClick ? motion.div : 'div';
  const props = onClick
    ? {
        whileHover: { scale: 1.02, y: -2 },
        whileTap: { scale: 0.98 },
        onClick,
        className: `bg-card rounded-xl shadow-md p-6 cursor-pointer transition-shadow hover:shadow-lg ${className}`,
      }
    : {
        className: `bg-card rounded-xl shadow-md p-6 ${className}`,
      };

  return <Component {...props}>{children}</Component>;
}