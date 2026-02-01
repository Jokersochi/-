import React from 'react';
import { cn } from '../../utils/helpers';
import { Loader2 } from 'lucide-react';

const steps = [
  { progress: 10, label: 'Загрузка изображения...' },
  { progress: 30, label: 'Анализ комнаты...' },
  { progress: 50, label: 'Применение стиля...' },
  { progress: 70, label: 'Генерация дизайна...' },
  { progress: 90, label: 'Финальная обработка...' },
  { progress: 100, label: 'Готово!' },
];

export function ProgressIndicator({ progress = 0, className }) {
  const currentStep = steps.find((s) => progress <= s.progress) || steps[steps.length - 1];

  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      {/* Progress Bar */}
      <div className="relative h-2 bg-white/10 rounded-full overflow-hidden mb-4">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
        {/* Shimmer effect */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
          style={{ 
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s infinite',
          }}
        />
      </div>

      {/* Status */}
      <div className="flex items-center justify-center gap-3">
        {progress < 100 && (
          <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
        )}
        <span className="text-white font-medium">{currentStep.label}</span>
      </div>

      {/* Progress percentage */}
      <p className="text-center text-gray-400 text-sm mt-2">
        {Math.round(progress)}%
      </p>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
}

export default ProgressIndicator;
