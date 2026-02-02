import { withApiAuth } from '../../../middleware/withAuth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get date range for stats
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Fetch stats in parallel
    const [
      { count: totalUsers },
      { count: usersThisWeek },
      { count: usersLastWeek },
      { count: totalGenerations },
      { count: generationsThisWeek },
      { count: generationsLastWeek },
      { data: paymentsThisWeek },
      { data: paymentsLastWeek },
      { data: recentUsers },
      { data: revenueByDay },
    ] = await Promise.all([
      // Total users
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      // Users this week
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString()),
      // Users last week
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', twoWeeksAgo.toISOString())
        .lt('created_at', weekAgo.toISOString()),
      // Total generations
      supabase.from('generations').select('*', { count: 'exact', head: true }),
      // Generations this week
      supabase
        .from('generations')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString()),
      // Generations last week
      supabase
        .from('generations')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', twoWeeksAgo.toISOString())
        .lt('created_at', weekAgo.toISOString()),
      // Payments this week
      supabase
        .from('payments')
        .select('amount')
        .eq('status', 'succeeded')
        .gte('created_at', weekAgo.toISOString()),
      // Payments last week
      supabase
        .from('payments')
        .select('amount')
        .eq('status', 'succeeded')
        .gte('created_at', twoWeeksAgo.toISOString())
        .lt('created_at', weekAgo.toISOString()),
      // Recent users
      supabase
        .from('profiles')
        .select('id, email:id, credits, admin_level, created_at')
        .order('created_at', { ascending: false })
        .limit(50),
      // Revenue by day (last 7 days)
      supabase
        .from('payments')
        .select('amount, created_at')
        .eq('status', 'succeeded')
        .gte('created_at', weekAgo.toISOString()),
    ]);

    // Calculate revenue
    const revenueThisWeek = (paymentsThisWeek || []).reduce((sum, p) => sum + (p.amount || 0), 0);
    const revenueLastWeek = (paymentsLastWeek || []).reduce((sum, p) => sum + (p.amount || 0), 0);

    // Calculate changes
    const usersChange = usersLastWeek > 0 
      ? Math.round(((usersThisWeek - usersLastWeek) / usersLastWeek) * 100) 
      : 100;
    const generationsChange = generationsLastWeek > 0 
      ? Math.round(((generationsThisWeek - generationsLastWeek) / generationsLastWeek) * 100) 
      : 100;
    const revenueChange = revenueLastWeek > 0 
      ? Math.round(((revenueThisWeek - revenueLastWeek) / revenueLastWeek) * 100) 
      : 100;

    // Calculate conversion rate
    const conversionRate = totalUsers > 0 
      ? Math.round(((paymentsThisWeek?.length || 0) / totalUsers) * 100) 
      : 0;

    // Process revenue by day
    const revenueByDayMap = {};
    const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = date.toISOString().split('T')[0];
      revenueByDayMap[key] = { label: days[date.getDay()], value: 0 };
    }

    (revenueByDay || []).forEach((payment) => {
      const key = payment.created_at.split('T')[0];
      if (revenueByDayMap[key]) {
        revenueByDayMap[key].value += payment.amount || 0;
      }
    });

    // Get user emails from auth (simplified - in production use proper join)
    const usersWithEmail = (recentUsers || []).map(user => ({
      ...user,
      email: `user_${user.id.slice(0, 8)}@example.com`, // Placeholder
      generation_count: 0,
      is_banned: false,
    }));

    return res.status(200).json({
      stats: {
        totalUsers: totalUsers || 0,
        usersChange,
        totalGenerations: totalGenerations || 0,
        generationsChange,
        totalRevenue: revenueThisWeek,
        revenueChange,
        conversionRate,
        conversionChange: 0,
      },
      users: usersWithEmail,
      revenue: Object.values(revenueByDayMap),
    });
  } catch (error) {
    console.error('[Admin Dashboard] Error:', error);
    return res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
}

export default withApiAuth(handler, { requireAdmin: true, adminLevel: 50 });
