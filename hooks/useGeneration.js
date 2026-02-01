import { useState, useCallback } from 'react';
import { storageService, generationsService } from '../services/supabase';
import { generationApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export function useGeneration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const { user, refreshProfile } = useAuth();

  const generate = useCallback(async (file, style, options = {}) => {
    if (!file) {
      setError('Пожалуйста, загрузите фото');
      return null;
    }

    setLoading(true);
    setError(null);
    setProgress(10);

    try {
      // Step 1: Upload image to storage
      setProgress(20);
      const { publicUrl, fileName } = await storageService.uploadImage(file);
      
      // Step 2: Call generation API
      setProgress(40);
      const { data, error: apiError } = await generationApi.generate(publicUrl, style, options);
      
      if (apiError) {
        throw new Error(apiError);
      }

      setProgress(80);

      // Step 3: Save to history (if user is authenticated)
      if (user && data.output) {
        try {
          await generationsService.saveGeneration(user.id, {
            originalImageUrl: publicUrl,
            generatedImageUrl: data.output,
            style,
            prompt: options.customPrompt || '',
          });
          await refreshProfile?.();
        } catch (historyError) {
          console.error('Error saving to history:', historyError);
          // Don't fail the generation if history save fails
        }
      }

      setProgress(100);
      setResult(data.output);
      return data.output;
    } catch (err) {
      const errorMessage = err.message || 'Произошла ошибка при генерации';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, refreshProfile]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setResult(null);
    setProgress(0);
  }, []);

  return {
    generate,
    reset,
    loading,
    error,
    result,
    progress,
  };
}

export default useGeneration;
