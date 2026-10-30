import { type ButtonHTMLAttributes, type ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'teal';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-[10px] transition-all duration-[180ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090D14] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none whitespace-nowrap shrink-0';

  const variants = {
    primary:
      'bg-[#C6B99A] text-[#090D14] hover:brightness-105 active:brightness-95 focus-visible:ring-[#C6B99A] shadow-sm',
    secondary:
      'bg-[#151D2A] text-[#F2F0EA] border border-[#354252] hover:border-[#4B5E75] hover:bg-[#1D2735] focus-visible:ring-[#54C7BE] shadow-sm',
    teal:
      'bg-[#54C7BE] text-[#090D14] hover:brightness-105 active:brightness-95 focus-visible:ring-[#54C7BE] shadow-sm',
    outline:
      'bg-transparent text-[#F2F0EA] border border-[#354252] hover:border-[#4B5E75] hover:bg-[#151D2A] focus-visible:ring-[#C6B99A] shadow-sm',
    ghost:
      'bg-transparent text-[#9AA7B5] hover:text-[#F2F0EA] hover:bg-[#151D2A] focus-visible:ring-[#354252]',
    danger:
      'bg-[#E47979]/15 text-[#E47979] border border-[#E47979]/30 hover:bg-[#E47979]/25 hover:border-[#E47979]/50 focus-visible:ring-[#E47979]',
  };

  const sizes = {
    sm: 'h-10 px-4 text-xs gap-2',
    md: 'h-12 px-6 text-sm gap-2.5',
    lg: 'h-12 px-7 text-base gap-2.5',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : icon && iconPosition === 'left' ? (
        <span className="shrink-0 flex items-center justify-center">{icon}</span>
      ) : null}

      <span>{children}</span>

      {!loading && icon && iconPosition === 'right' ? (
        <span className="shrink-0 flex items-center justify-center">{icon}</span>
      ) : null}
    </button>
  );
}
