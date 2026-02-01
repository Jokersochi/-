import React, { forwardRef } from 'react';
import { cn } from '../../utils/helpers';

export const Input = forwardRef(({
  label,
  error,
  icon: Icon,
  className,
  type = 'text',
  ...props
}, ref) => {
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-white mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            'w-full p-3 bg-gray-900 border rounded-xl',
            'text-white placeholder-gray-500 transition-all duration-200',
            'focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            Icon && 'pl-10',
            error ? 'border-red-500' : 'border-white/20 hover:border-white/40'
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-red-400 text-sm">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
