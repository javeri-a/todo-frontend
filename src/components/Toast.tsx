// frontend/src/components/Toast.tsx
import React, { useEffect, useState } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number; // Duration in milliseconds before auto-dismissing
  onDismiss?: () => void;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'info', 
  duration = 3000, 
  onDismiss 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  // Auto dismiss after duration
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        dismissToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const dismissToast = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  // Determine styles based on toast type
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-gray-800';
      case 'info':
      default:
        return 'bg-blue-500 text-white';
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed bottom-4 right-4 px-6 py-4 rounded-md shadow-lg z-50 transform transition-all duration-300 ease-in-out ${getTypeStyles()}`}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium">{message}</span>
        <button 
          onClick={dismissToast}
          className="ml-4 text-current hover:opacity-70 focus:outline-none"
          aria-label="Dismiss toast"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toast;