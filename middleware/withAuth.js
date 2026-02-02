// Higher-order component for protected routes
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

export function withAuth(WrappedComponent, options = {}) {
  const { 
    redirectTo = '/login',
    requireAuth = true,
    requireAdmin = false,
    adminLevel = 0,
  } = options;

  return function AuthenticatedComponent(props) {
    const router = useRouter();
    const { user, profile, loading, isAuthenticated } = useAuth();

    useEffect(() => {
      if (loading) return;

      if (requireAuth && !isAuthenticated) {
        router.replace(`${redirectTo}?redirect=${encodeURIComponent(router.asPath)}`);
        return;
      }

      if (requireAdmin) {
        const userAdminLevel = profile?.admin_level || 0;
        if (userAdminLevel < adminLevel) {
          router.replace('/');
          return;
        }
      }
    }, [loading, isAuthenticated, profile, router]);

    if (loading) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
      );
    }

    if (requireAuth && !isAuthenticated) {
      return null;
    }

    if (requireAdmin && (profile?.admin_level || 0) < adminLevel) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

// Server-side auth check for API routes
export function withApiAuth(handler, options = {}) {
  const { requireAdmin = false, adminLevel = 0 } = options;

  return async (req, res) => {
    const { createClient } = await import('@supabase/supabase-js');
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Get token from header
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      // Check admin level if required
      if (requireAdmin) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('admin_level')
          .eq('id', user.id)
          .single();

        if ((profile?.admin_level || 0) < adminLevel) {
          return res.status(403).json({ error: 'Forbidden' });
        }

        req.adminLevel = profile?.admin_level || 0;
      }

      req.user = user;
      return handler(req, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

export default withAuth;
