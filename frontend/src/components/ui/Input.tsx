import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-[#9AA7B5] tracking-wide">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[#9AA7B5]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full rounded-lg bg-[#090D14] border px-4 py-2.5 text-sm text-[#F2F0EA] placeholder-[#9AA7B5]/50 transition-all duration-200 outline-none ${
              icon ? 'pl-10' : ''
            } ${
              error
                ? 'border-[#E47979] focus:border-[#E47979] focus:ring-1 focus:ring-[#E47979]'
                : 'border-[#2B3544] hover:border-[#3E4C60] focus:border-[#C6B99A] focus:ring-1 focus:ring-[#C6B99A]/50'
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-[#E47979] font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-[#9AA7B5]">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
