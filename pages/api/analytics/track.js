/**
 * Analytics Tracking API
 * Track user events
 */

import { supabase } from '../../../lib/supabase';
import { createErrorResponse, logError, AppError } from '../../../utils/errors';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { eventType, metadata = {} } = req.body;

    if (!eventType) {
      throw new AppError('Event type is required', 400, 'MISSING_EVENT_TYPE');
    }

    // Get user ID if authenticated (optional)
    let userId = null;
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    // Insert analytics event
    const { error } = await supabase
      .from('analytics')
      .insert({
        event_type: eventType,
        user_id: userId,
        metadata: {
          ...metadata,
          userAgent: req.headers['user-agent'],
          ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        },
      });

    if (error) throw error;

    res.status(200).json({ success: true });
  } catch (error) {
    logError(error, 'analytics track API');
    const errorResponse = createErrorResponse(error);
    res.status(errorResponse.statusCode).json({
      error: errorResponse.error,
      code: errorResponse.code,
    });
  }
}
