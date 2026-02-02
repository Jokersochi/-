/**
 * Collections API
 * CRUD operations for collections
 */

import { CollectionModel } from '../../../models/collection.model';
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
      // Get user's collections
      const collections = await CollectionModel.getUserCollections(user.id);
      res.status(200).json(collections);
    } else if (req.method === 'POST') {
      // Create new collection
      const { name, description, isPublic } = req.body;

      if (!name) {
        throw new AppError('Name is required', 400, 'MISSING_NAME');
      }

      const collection = await CollectionModel.create({
        userId: user.id,
        name,
        description,
        isPublic,
      });

      res.status(201).json(collection);
    } else {
      throw new AppError('Method not allowed', 405, 'METHOD_NOT_ALLOWED');
    }
  } catch (error) {
    logError(error, 'collections API');
    const errorResponse = createErrorResponse(error);
    res.status(errorResponse.statusCode).json({
      error: errorResponse.error,
      code: errorResponse.code,
    });
  }
}
