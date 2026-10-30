import { type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

export interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'glass' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  glow?: 'none' | 'champagne' | 'teal';
  className?: string;
}

export function Card({
  children,
  variant = 'default',
  padding = 'lg',
  glow = 'none',
  className = '',
  ...props
}: CardProps) {
  const variants = {
    default: 'bg-[#151D2A] border border-[#2B3544]',
    elevated: 'bg-[#1D2735] border border-[#2B3544]',
    glass: 'glass',
    interactive:
      'bg-[#151D2A] border border-[#2B3544] hover:border-[#C6B99A]/40 hover:bg-[#151D2A]/90 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)]',
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const glows = {
    none: '',
    champagne: 'glow-champagne-subtle border-glow-champagne',
    teal: 'glow-teal-subtle border-glow-teal',
  };

  return (
    <motion.div
      className={`rounded-2xl ${variants[variant]} ${paddings[padding]} ${glows[glow]} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
