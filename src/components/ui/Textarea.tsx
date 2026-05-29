import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="text-xs text-teal-400/60 uppercase tracking-widest mb-1.5 block"
          >
            {label}
          </label>
        )}
        <textarea
          id={id}
          className={cn(
            'input-field w-full px-4 py-3 rounded-lg text-sm resize-none',
            'focus:outline-none focus:ring-2 focus:ring-teal-500/30',
            error && 'border-red-500 focus:ring-red-500/30',
            className
          )}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${id}-error`} className="text-red-400 text-xs mt-1 flex items-center gap-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
