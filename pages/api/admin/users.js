import { withApiAuth } from '../../../middleware/withAuth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function handler(req, res) {
  // PUT - Update user
  if (req.method === 'PUT') {
    const { userId, credits_add, admin_level, is_banned } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    try {
      const updates = {};

      // Add credits
      if (credits_add) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('credits')
          .eq('id', userId)
          .single();

        updates.credits = (profile?.credits || 0) + credits_add;
      }

      // Set admin level
      if (admin_level !== undefined) {
        // Check if current user has permission
        if (req.adminLevel < 100 && admin_level >= req.adminLevel) {
          return res.status(403).json({ error: 'Cannot set admin level higher than or equal to your own' });
        }
        updates.admin_level = admin_level;
      }

      // Ban/unban user
      if (is_banned !== undefined) {
        updates.is_banned = is_banned;
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No updates provided' });
      }

      updates.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;

      console.log(`[Admin] User ${userId} updated:`, updates);

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('[Admin Users] Error:', error);
      return res.status(500).json({ error: 'Failed to update user' });
    }
  }

  // DELETE - Delete user
  if (req.method === 'DELETE') {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Only superadmins can delete users
    if (req.adminLevel < 100) {
      return res.status(403).json({ error: 'Only superadmins can delete users' });
    }

    try {
      // Delete from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      if (authError) throw authError;

      console.log(`[Admin] User ${userId} deleted`);

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('[Admin Users] Delete error:', error);
      return res.status(500).json({ error: 'Failed to delete user' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default withApiAuth(handler, { requireAdmin: true, adminLevel: 50 });
