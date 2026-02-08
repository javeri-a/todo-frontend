// frontend/src/components/Input.tsx
import React, { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils'; // Assuming you have a cn utility function

// Define TypeScript interface for input props
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  as?: 'input' | 'textarea';
  rows?: number;
}

// Input component
const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  helperText, 
  className, 
  as = 'input',
  rows = 3,
  ...props 
}) => {
  const Component = as;
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      {as === 'textarea' ? (
        <textarea
          className={cn(
            `
              flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm
              ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium
              placeholder:text-muted-foreground focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
              disabled:cursor-not-allowed disabled:opacity-50
            `,
            error ? 'border-red-500 focus-visible:ring-red-500' : '',
            className
          )}
          rows={rows}
          {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          className={cn(
            `
              flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm
              ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium
              placeholder:text-muted-foreground focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
              disabled:cursor-not-allowed disabled:opacity-50
            `,
            error ? 'border-red-500 focus-visible:ring-red-500' : '',
            className
          )}
          {...props}
        />
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export { Input };