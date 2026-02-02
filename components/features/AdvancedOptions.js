import React, { useState } from 'react';
import { cn } from '../../utils/helpers';
import { ROOM_TYPES } from '../../config';
import { Card, Input } from '../ui';
import { 
  ChevronDown, 
  ChevronUp, 
  Sofa, 
  Bed, 
  UtensilsCrossed, 
  Bath, 
  Briefcase, 
  Baby, 
  ChefHat, 
  DoorOpen,
  Sliders
} from 'lucide-react';

const roomIcons = {
  living: Sofa,
  bedroom: Bed,
  kitchen: ChefHat,
  bathroom: Bath,
  office: Briefcase,
  kids: Baby,
  dining: UtensilsCrossed,
  hallway: DoorOpen,
};

export function AdvancedOptions({ 
  roomType, 
  onRoomTypeChange,
  customPrompt,
  onCustomPromptChange,
  strength = 0.8,
  onStrengthChange,
  disabled = false,
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full">
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        disabled={disabled}
        className={cn(
          'w-full flex items-center justify-between p-4 rounded-xl border transition-all',
          'border-white/20 hover:border-white/40',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <div className="flex items-center gap-3">
          <Sliders className="w-5 h-5 text-gray-400" />
          <span className="text-white font-medium">Расширенные настройки</span>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="mt-4 space-y-6 animate-fade-in">
          {/* Room Type */}
          <div>
            <label className="block text-sm font-medium text-white mb-3">
              Тип комнаты
            </label>
            <div className="grid grid-cols-4 gap-2">
              {ROOM_TYPES.map((room) => {
                const Icon = roomIcons[room.id] || Sofa;
                const isSelected = roomType === room.id;
                
                return (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => onRoomTypeChange?.(room.id)}
                    disabled={disabled}
                    className={cn(
                      'p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2',
                      'hover:scale-[1.02] active:scale-[0.98]',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      isSelected
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    )}
                  >
                    <Icon className={cn(
                      'w-5 h-5',
                      isSelected ? 'text-blue-400' : 'text-gray-400'
                    )} />
                    <span className="text-xs text-white">{room.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Prompt */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Дополнительные пожелания
            </label>
            <textarea
              value={customPrompt}
              onChange={(e) => onCustomPromptChange?.(e.target.value)}
              disabled={disabled}
              placeholder="Например: больше зелени, теплые тона, мраморный пол..."
              className="w-full p-4 bg-gray-800 border border-white/20 rounded-xl text-white placeholder-gray-500 resize-none h-24 focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
            />
            <p className="text-xs text-gray-500 mt-2">
              Опишите дополнительные детали для более точного результата
            </p>
          </div>

          {/* Transformation Strength */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-white">
                Сила трансформации
              </label>
              <span className="text-sm text-blue-400">{Math.round(strength * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.3"
              max="1"
              step="0.1"
              value={strength}
              onChange={(e) => onStrengthChange?.(parseFloat(e.target.value))}
              disabled={disabled}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Мягкая</span>
              <span>Средняя</span>
              <span>Сильная</span>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 50%;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}

export default AdvancedOptions;
