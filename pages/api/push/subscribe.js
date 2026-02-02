/**
 * Push Subscription API
 * Save push subscription to database
 */

import { supabase } from '../../../lib/supabase';
import { createErrorResponse, logError } from '../../../utils/errors';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const subscription = req.body;
    
    // Get user from session
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Save subscription to database
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert({
        user_id: user.id,
        subscription: subscription,
        endpoint: subscription.endpoint,
      }, {
        onConflict: 'endpoint',
      });

    if (error) throw error;

    res.status(200).json({ success: true });
  } catch (error) {
    logError(error, 'push subscribe');
    const errorResponse = createErrorResponse(error);
    res.status(errorResponse.statusCode).json(errorResponse);
  }
}
