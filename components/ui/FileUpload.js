import React, { useCallback, useState, useRef } from 'react';
import { cn } from '../../utils/helpers';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

export function FileUpload({
  onFileSelect,
  accept = 'image/*',
  maxSize = 10 * 1024 * 1024,
  className,
  disabled = false,
  preview = true,
}) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const validateFile = (file) => {
    if (!file) return 'Файл не выбран';
    if (file.size > maxSize) {
      return `Файл слишком большой. Максимум: ${Math.round(maxSize / 1024 / 1024)}MB`;
    }
    if (!file.type.startsWith('image/')) {
      return 'Пожалуйста, выберите изображение';
    }
    return null;
  };

  const handleFile = useCallback((file) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setFile(file);
    
    if (preview) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
    
    onFileSelect?.(file);
  }, [maxSize, preview, onFileSelect]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [disabled, handleFile]);

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreviewUrl(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onFileSelect?.(null);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'relative border-2 border-dashed rounded-xl transition-all duration-200',
          'flex flex-col items-center justify-center',
          'min-h-[200px] cursor-pointer',
          dragActive 
            ? 'border-blue-500 bg-blue-500/10' 
            : 'border-white/30 hover:border-white/50 hover:bg-white/5',
          disabled && 'opacity-50 cursor-not-allowed',
          error && 'border-red-500/50'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!disabled ? handleClick : undefined}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />

        {previewUrl ? (
          <div className="relative w-full h-full p-4">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-48 object-contain rounded-lg"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="absolute top-2 right-2 p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            <p className="text-center text-sm text-gray-400 mt-2 truncate">
              {file?.name}
            </p>
          </div>
        ) : (
          <div className="text-center p-6">
            <div className="mb-4 p-4 bg-white/10 rounded-full inline-block">
              {dragActive ? (
                <ImageIcon className="w-8 h-8 text-blue-400" />
              ) : (
                <Upload className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <p className="text-white font-medium mb-1">
              {dragActive ? 'Отпустите файл здесь' : 'Перетащите изображение сюда'}
            </p>
            <p className="text-gray-400 text-sm">
              или нажмите для выбора
            </p>
            <p className="text-gray-500 text-xs mt-2">
              PNG, JPG, WebP до {Math.round(maxSize / 1024 / 1024)}MB
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-red-400 text-sm flex items-center gap-2">
          <X className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}

export default FileUpload;
