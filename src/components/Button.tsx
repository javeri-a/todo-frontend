// frontend/src/components/Button.tsx
import React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils'; // Assuming you have a cn utility function

// Define button variants using class-variance-authority
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background shadow-sm',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-[0.98]',
        secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 hover:shadow-sm active:scale-[0.98]',
        ghost: 'hover:bg-slate-100 hover:text-slate-700 active:scale-[0.98]',
        destructive: 'bg-red-500 text-white hover:bg-red-600 hover:shadow-md active:scale-[0.98]',
        outline: 'border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-50 hover:border-slate-400 active:scale-[0.98]',
      },
      size: {
        sm: 'h-9 px-3 rounded-md text-xs',
        md: 'h-10 px-4 rounded-md',
        lg: 'h-12 px-6 rounded-lg text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

// Define TypeScript interface for button props
interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  isLoading?: boolean;
}

// Button component
const Button: React.FC<ButtonProps> = ({
  className,
  variant,
  size,
  isLoading = false,
  children,
  ...props
}) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export { Button, buttonVariants };