import React from 'react';
import { cn } from '../../utils/helpers';
import { ChevronDown } from 'lucide-react';

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Выберите...',
  label,
  error,
  disabled = false,
  className,
  ...props
}) {
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-white mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={cn(
            'w-full p-3 pr-10 bg-gray-900 border rounded-xl appearance-none',
            'text-white transition-all duration-200',
            'focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error ? 'border-red-500' : 'border-white/20 hover:border-white/40'
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option 
              key={option.id || option.value} 
              value={option.id || option.value}
            >
              {option.label || option.name}
            </option>
          ))}
        </select>
        <ChevronDown 
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" 
        />
      </div>
      {error && (
        <p className="mt-1 text-red-400 text-sm">{error}</p>
      )}
    </div>
  );
}

export default Select;
