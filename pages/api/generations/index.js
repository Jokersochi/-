/**
 * Generations API
 * CRUD operations for generations
 */

import { GenerationModel } from '../../../models/generation.model';
import { UserModel } from '../../../models/user.model';
import { createErrorResponse, logError, AppError } from '../../../utils/errors';
import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  try {
    // Get user from session
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    if (req.method === 'GET') {
      // Get user's generations
      const { page = 1, limit = 10, status } = req.query;
      
      const result = await GenerationModel.getUserGenerations(user.id, {
        page: parseInt(page),
        limit: parseInt(limit),
        status,
      });

      res.status(200).json(result);
    } else if (req.method === 'POST') {
      // Create new generation
      const { originalImageUrl, style, metadata } = req.body;

      if (!originalImageUrl) {
        throw new AppError('Image URL is required', 400, 'MISSING_IMAGE_URL');
      }

      if (!style) {
        throw new AppError('Style is required', 400, 'MISSING_STYLE');
      }

      // Check if user has credits
      const hasCredits = await UserModel.hasCredits(user.id);
      if (!hasCredits) {
        throw new AppError('Insufficient credits', 402, 'INSUFFICIENT_CREDITS');
      }

      // Create generation record
      const generation = await GenerationModel.create({
        userId: user.id,
        originalImageUrl,
        style,
        metadata,
      });

      // Deduct credit
      await UserModel.deductCredits(user.id, 1);

      res.status(201).json(generation);
    } else {
      throw new AppError('Method not allowed', 405, 'METHOD_NOT_ALLOWED');
    }
  } catch (error) {
    logError(error, 'generations API');
    const errorResponse = createErrorResponse(error);
    res.status(errorResponse.statusCode).json({
      error: errorResponse.error,
      code: errorResponse.code,
    });
  }
}
