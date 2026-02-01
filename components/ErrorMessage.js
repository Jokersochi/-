/**
 * ErrorMessage Component
 * Displays error messages with dismiss functionality
 */

import React from 'react';

export default function ErrorMessage({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl backdrop-blur-sm animate-slideDown">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          {/* Error Icon */}
          <svg 
            className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
              clipRule="evenodd" 
            />
          </svg>
          
          {/* Error Message */}
          <p className="text-sm text-red-300 font-medium">
            {message}
          </p>
        </div>
        
        {/* Dismiss Button */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-400 hover:text-red-300 transition-colors"
            aria-label="Dismiss"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path 
                fillRule="evenodd" 
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                clipRule="evenodd" 
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
