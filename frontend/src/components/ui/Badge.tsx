import { type ReactNode } from 'react';

export interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'champagne' | 'teal';
  size?: 'sm' | 'md';
  className?: string;
  icon?: ReactNode;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon,
}: BadgeProps) {
  const variants = {
    default: 'bg-[#1D2735] text-[#9AA7B5] border-[#2B3544]',
    success: 'bg-[#49B994]/15 text-[#49B994] border-[#49B994]/30',
    warning: 'bg-[#D5A86B]/15 text-[#D5A86B] border-[#D5A86B]/30',
    error: 'bg-[#E47979]/15 text-[#E47979] border-[#E47979]/30',
    info: 'bg-[#54C7BE]/15 text-[#54C7BE] border-[#54C7BE]/30',
    champagne: 'bg-[#C6B99A]/15 text-[#C6B99A] border-[#C6B99A]/30',
    teal: 'bg-[#54C7BE]/15 text-[#54C7BE] border-[#54C7BE]/30',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  return (
    <span
      className={`inline-flex items-center font-mono font-medium rounded-full border ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
