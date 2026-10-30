import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'champagne' | 'teal' | 'none';
  padding?: 'sm' | 'md' | 'lg' | 'none';
  onClick?: () => void;
}

export function Card({ children, className = '', hover = false, glow = 'none', padding = 'md', onClick }: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const glows = {
    none: '',
    champagne: 'glow-champagne',
    teal: 'glow-teal',
  };

  return (
    <motion.div
      whileHover={hover ? { y: -2, scale: 1.01 } : undefined}
      className={`
        bg-midnight-slate border border-border rounded-xl
        ${paddings[padding]}
        ${glows[glow]}
        ${hover ? 'cursor-pointer transition-shadow hover:border-border/80' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
