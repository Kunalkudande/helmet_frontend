import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700 focus-visible:ring-accent-500',
    secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/30 focus-visible:ring-white/40',
    outline: 'bg-transparent text-white border border-white/20 hover:bg-white/10 hover:border-white/30 focus-visible:ring-white/40',
    ghost: 'bg-transparent text-brand-300 hover:bg-white/10 hover:text-white focus-visible:ring-white/40',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-600',
    accent: 'bg-accent-600 text-white hover:bg-accent-700 active:bg-accent-800 focus-visible:ring-accent-600',
  };

  const sizes = {
    sm: 'h-9 px-4 text-sm gap-1.5',
    md: 'h-11 px-5 text-sm gap-2',
    lg: 'h-12 px-6 text-base gap-2',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-150 ease-out',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:pointer-events-none select-none',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 size={size === 'sm' ? 14 : 16} className="animate-spin" />
          <span>Loading</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0 -ml-0.5">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0 -mr-0.5">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}
