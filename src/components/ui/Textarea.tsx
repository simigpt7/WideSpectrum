import React from 'react';
import { cn } from '../../utils/cn';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled';
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      variant = 'default',
      id,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    const baseStyles = 'w-full rounded-lg transition-all duration-200 resize-none';

    const variants = {
      default: 'bg-dark-800/50 border border-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
      filled: 'bg-dark-800 border border-transparent focus:border-primary-500 focus:bg-dark-700',
    };

    const errorStyles = error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
      : '';

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            baseStyles,
            variants[variant],
            errorStyles,
            'px-4 py-3 text-white placeholder-gray-500 focus:outline-none',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
