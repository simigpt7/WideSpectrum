import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  variant?: 'default' | 'filled';
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      options,
      placeholder = 'Select an option',
      variant = 'default',
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    const baseStyles = 'w-full rounded-lg transition-all duration-200 appearance-none cursor-pointer';

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
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              baseStyles,
              variants[variant],
              errorStyles,
              'px-4 py-3 pr-10 text-white focus:outline-none',
              !props.value && 'text-gray-500',
              className
            )}
            {...props}
          >
            <option value="" disabled className="text-gray-500 bg-dark-800">
              {placeholder}
            </option>
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="text-white bg-dark-800"
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <ChevronDown className="h-5 w-5" />
          </div>
        </div>
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

Select.displayName = 'Select';

export default Select;
