/**
 * LoadingSpinner Component
 * Displays loading state with optional progress
 */

import React from 'react';

export default function LoadingSpinner({ progress = null, message = 'Загрузка...' }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        
        {/* Progress indicator */}
        {progress !== null && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-white">
              {Math.round(progress)}%
            </span>
          </div>
        )}
      </div>
      
      <p className="text-white text-sm font-medium animate-pulse">
        {message}
      </p>
      
      {/* Progress bar */}
      {progress !== null && (
        <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}
