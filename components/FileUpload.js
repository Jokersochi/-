/**
 * FileUpload Component
 * Handles file selection with validation feedback
 */

import React from 'react';
import { FILE_UPLOAD } from '../config/constants';

export default function FileUpload({ onFileSelect, error, disabled = false }) {
  const handleChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const acceptedTypes = FILE_UPLOAD.ACCEPTED_EXTENSIONS.join(',');

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2 text-white">
        Загрузите фото комнаты
      </label>
      
      <input
        type="file"
        accept={acceptedTypes}
        onChange={handleChange}
        disabled={disabled}
        className="block w-full text-sm text-white
          file:mr-4 file:py-2 file:px-4 
          file:rounded-full file:border-0 
          file:text-sm file:font-semibold 
          file:bg-blue-600 file:text-white 
          hover:file:bg-blue-700 
          file:cursor-pointer
          disabled:opacity-50 disabled:cursor-not-allowed
          cursor-pointer"
      />
      
      {error && (
        <p className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}
      
      <p className="mt-2 text-xs text-gray-400">
        Поддерживаемые форматы: JPG, PNG, WEBP. Максимальный размер: 10MB
      </p>
    </div>
  );
}
