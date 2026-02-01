import React from 'react';
import { cn } from '../../utils/helpers';
import { DESIGN_STYLES } from '../../utils/constants';
import { 
  Sparkles, 
  Minus, 
  Mountain, 
  Factory, 
  Flower2, 
  Crown, 
  Leaf, 
  Building 
} from 'lucide-react';

const styleIcons = {
  modern: Sparkles,
  minimalist: Minus,
  scandi: Mountain,
  industrial: Factory,
  bohemian: Flower2,
  classic: Crown,
  japandi: Leaf,
  loft: Building,
};

const styleColors = {
  modern: 'from-blue-500 to-blue-700',
  minimalist: 'from-gray-500 to-gray-700',
  scandi: 'from-sky-400 to-sky-600',
  industrial: 'from-orange-500 to-orange-700',
  bohemian: 'from-pink-500 to-purple-600',
  classic: 'from-yellow-500 to-amber-600',
  japandi: 'from-green-500 to-emerald-600',
  loft: 'from-stone-500 to-stone-700',
};

export function StyleSelector({ value, onChange, disabled = false }) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-white mb-3">
        Выберите стиль дизайна
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {DESIGN_STYLES.map((style) => {
          const Icon = styleIcons[style.id] || Sparkles;
          const isSelected = value === style.id;
          
          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onChange?.(style.id)}
              disabled={disabled}
              className={cn(
                'relative p-4 rounded-xl border-2 transition-all duration-200',
                'flex flex-col items-center gap-2 text-center',
                'hover:scale-[1.02] active:scale-[0.98]',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
                isSelected
                  ? 'border-blue-500 bg-blue-500/20'
                  : 'border-white/20 bg-white/5 hover:border-white/40'
              )}
            >
              <div 
                className={cn(
                  'p-3 rounded-xl bg-gradient-to-br',
                  styleColors[style.id] || 'from-gray-500 to-gray-700'
                )}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-white">
                {style.label}
              </span>
              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default StyleSelector;
