import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { withAuth } from '../../middleware/withAuth';
import { AdminStats, UsersTable, RevenueChart } from '../../components/admin';
import { Card, Button } from '../../components/ui';
import { 
  LayoutDashboard, 
  Users, 
  ImageIcon, 
  CreditCard, 
  Settings,
  RefreshCw,
  Download,
  Sparkles
} from 'lucide-react';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/dashboard');
      const data = await response.json();
      
      setStats(data.stats);
      setUsers(data.users || []);
      setRevenueData(data.revenue || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userId, updates) => {
    try {
      await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...updates }),
      });
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Обзор', icon: LayoutDashboard },
    { id: 'users', label: 'Пользователи', icon: Users },
    { id: 'generations', label: 'Генерации', icon: ImageIcon },
    { id: 'payments', label: 'Платежи', icon: CreditCard },
    { id: 'settings', label: 'Настройки', icon: Settings },
  ];

  return (
    <>
      <Head>
        <title>Админ панель | RoomGenius AI</title>
      </Head>

      <div className="min-h-screen bg-black">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">RoomGenius</span>
              </Link>
              <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-medium rounded-full">
                Admin
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                icon={RefreshCw}
                onClick={fetchDashboardData}
                loading={loading}
              >
                Обновить
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={Download}
              >
                Экспорт
              </Button>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <nav className="flex gap-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats */}
              <AdminStats stats={stats} />

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueChart data={revenueData} />
                
                {/* Recent Activity */}
                <Card>
                  <h3 className="text-lg font-bold text-white mb-4">Последняя активность</h3>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center gap-4 pb-4 border-b border-white/5 last:border-0 last:pb-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                          U
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm">user{i}@example.com</p>
                          <p className="text-gray-500 text-xs">Создал генерацию • 5 мин назад</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <UsersTable
              users={users}
              loading={loading}
              onUpdateUser={handleUpdateUser}
            />
          )}

          {activeTab === 'generations' && (
            <Card>
              <h3 className="text-lg font-bold text-white mb-4">Генерации</h3>
              <p className="text-gray-400">Управление генерациями скоро...</p>
            </Card>
          )}

          {activeTab === 'payments' && (
            <Card>
              <h3 className="text-lg font-bold text-white mb-4">Платежи</h3>
              <p className="text-gray-400">Управление платежами скоро...</p>
            </Card>
          )}

          {activeTab === 'settings' && (
            <Card>
              <h3 className="text-lg font-bold text-white mb-4">Настройки</h3>
              <p className="text-gray-400">Системные настройки скоро...</p>
            </Card>
          )}
        </main>
      </div>
    </>
  );
}

export default withAuth(AdminDashboard, { requireAuth: true, requireAdmin: true, adminLevel: 50 });
