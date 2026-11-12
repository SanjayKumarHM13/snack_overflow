'use client';

import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'coral' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, icon, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-bold rounded-2xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

    const variants = {
      primary:
        'bg-navy-900 text-white hover:bg-navy-800 dark:bg-coral dark:hover:bg-coral-hover focus:ring-navy-700 shadow-sm active:scale-[0.98]',
      secondary:
        'bg-pantry-subtle text-pantry-text hover:bg-pantry-border dark:hover:bg-pantry-border focus:ring-coral active:scale-[0.98]',
      coral:
        'bg-coral text-white hover:bg-coral-hover focus:ring-coral shadow-sm shadow-coral/20 active:scale-[0.98]',
      danger:
        'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500 shadow-sm active:scale-[0.98]',
      outline:
        'border border-pantry-border bg-pantry-surface text-pantry-text hover:bg-pantry-subtle focus:ring-coral active:scale-[0.98]',
      ghost:
        'text-gray-600 dark:text-gray-300 hover:text-pantry-text hover:bg-pantry-subtle focus:ring-coral',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-xs sm:text-sm px-4 py-2.5 gap-2',
      lg: 'text-sm sm:text-base px-6 py-3 gap-2.5',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
