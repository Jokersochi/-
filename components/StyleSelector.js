/**
 * StyleSelector Component
 * Dropdown for selecting interior design style
 */

import React from 'react';
import { DESIGN_STYLES, STYLE_LABELS } from '../config/constants';

export default function StyleSelector({ value, onChange, disabled = false }) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2 text-white">
        Выберите стиль
      </label>
      
      <select
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="block w-full p-3 
          bg-gray-900 border border-white/20 rounded-xl 
          text-white
          focus:ring-2 focus:ring-blue-500 focus:border-transparent
          outline-none
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all"
      >
        {Object.entries(DESIGN_STYLES).map(([key, styleValue]) => (
          <option key={styleValue} value={styleValue}>
            {STYLE_LABELS[styleValue]}
          </option>
        ))}
      </select>
      
      <p className="mt-2 text-xs text-gray-400">
        Выберите стиль интерьера для генерации дизайна
      </p>
    </div>
  );
}
