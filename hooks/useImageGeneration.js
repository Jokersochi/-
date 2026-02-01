/**
 * Custom hook for handling image generation workflow
 */

import { useState, useCallback } from 'react';
import { uploadFile } from '../services/storage.service';
import { generateDesign } from '../services/generation.service';
import { formatErrorMessage, logError } from '../utils/errors';

/**
 * Hook for managing image generation state and operations
 * @returns {Object} State and functions for image generation
 */
export function useImageGeneration() {
  const [file, setFile] = useState(null);
  const [style, setStyle] = useState('modern');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Handles file selection
   */
  const handleFileSelect = useCallback((selectedFile) => {
    setFile(selectedFile);
    setError(null);
    setResult(null);
  }, []);

  /**
   * Handles style change
   */
  const handleStyleChange = useCallback((newStyle) => {
    setStyle(newStyle);
  }, []);

  /**
   * Clears error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Resets all state
   */
  const reset = useCallback(() => {
    setFile(null);
    setStyle('modern');
    setLoading(false);
    setUploadProgress(0);
    setResult(null);
    setError(null);
  }, []);

  /**
   * Generates design from uploaded image
   */
  const generate = useCallback(async () => {
    if (!file) {
      setError('Пожалуйста, загрузите фото комнаты');
      return;
    }

    setLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Upload image
      setUploadProgress(30);
      const imageUrl = await uploadFile(file);
      
      // Generate design
      setUploadProgress(60);
      const generatedImageUrl = await generateDesign(imageUrl, style);
      
      setUploadProgress(100);
      setResult(generatedImageUrl);
    } catch (err) {
      logError(err, 'useImageGeneration.generate');
      setError(formatErrorMessage(err));
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  }, [file, style]);

  return {
    // State
    file,
    style,
    loading,
    uploadProgress,
    result,
    error,
    
    // Actions
    handleFileSelect,
    handleStyleChange,
    generate,
    clearError,
    reset,
  };
}
