/**
 * Image generation service for handling AI design generation
 */

import { API_ROUTES } from '../config/constants';
import { AppError, logError } from '../utils/errors';

/**
 * Generates a design using AI
 * @param {string} imageUrl - URL of the uploaded room image
 * @param {string} style - Design style to apply
 * @returns {Promise<string>} URL of generated design
 */
export async function generateDesign(imageUrl, style) {
  try {
    const response = await fetch(API_ROUTES.GENERATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl, style }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new AppError(
        errorData.error || 'Не удалось сгенерировать дизайн',
        response.status,
        'GENERATION_FAILED'
      );
    }

    const data = await response.json();
    
    if (!data.output) {
      throw new AppError(
        'Не получен результат генерации',
        500,
        'NO_OUTPUT'
      );
    }

    return data.output;
  } catch (error) {
    if (error instanceof AppError) throw error;
    
    logError(error, 'generateDesign');
    throw new AppError(
      'Не удалось сгенерировать дизайн',
      500,
      'GENERATION_FAILED'
    );
  }
}

/**
 * Checks generation status (for async operations)
 * @param {string} generationId - ID of the generation job
 * @returns {Promise<Object>} Status and result
 */
export async function checkGenerationStatus(generationId) {
  try {
    const response = await fetch(`${API_ROUTES.GENERATE}/${generationId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new AppError(
        'Не удалось проверить статус генерации',
        response.status,
        'STATUS_CHECK_FAILED'
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof AppError) throw error;
    
    logError(error, 'checkGenerationStatus');
    throw new AppError(
      'Не удалось проверить статус генерации',
      500,
      'STATUS_CHECK_FAILED'
    );
  }
}
