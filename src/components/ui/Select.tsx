import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, label, id, options, ...props }, ref) => {
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
        <select
          id={id}
          className={cn(
            'input-field w-full px-4 py-3 rounded-lg text-sm cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-teal-500/30',
            error && 'border-red-500 focus:ring-red-500/30',
            className
          )}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={`${id}-error`} className="text-red-400 text-xs mt-1 flex items-center gap-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
