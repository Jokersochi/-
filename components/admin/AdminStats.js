import React from 'react';
import { Card } from '../ui';
import { 
  Users, 
  ImageIcon, 
  CreditCard, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export function AdminStats({ stats }) {
  const statCards = [
    {
      title: 'Пользователей',
      value: stats?.totalUsers || 0,
      change: stats?.usersChange || 0,
      icon: Users,
      color: 'blue',
    },
    {
      title: 'Генераций',
      value: stats?.totalGenerations || 0,
      change: stats?.generationsChange || 0,
      icon: ImageIcon,
      color: 'purple',
    },
    {
      title: 'Доход',
      value: `${(stats?.totalRevenue || 0).toLocaleString()} ₽`,
      change: stats?.revenueChange || 0,
      icon: CreditCard,
      color: 'green',
    },
    {
      title: 'Конверсия',
      value: `${stats?.conversionRate || 0}%`,
      change: stats?.conversionChange || 0,
      icon: TrendingUp,
      color: 'orange',
    },
  ];

  const colorClasses = {
    blue: 'from-blue-500 to-blue-700',
    purple: 'from-purple-500 to-purple-700',
    green: 'from-green-500 to-green-700',
    orange: 'from-orange-500 to-orange-700',
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, idx) => (
        <Card key={idx} className="relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm">{stat.title}</p>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              <div className={`flex items-center gap-1 mt-2 text-sm ${
                stat.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {stat.change >= 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                <span>{Math.abs(stat.change)}%</span>
                <span className="text-gray-500">за неделю</span>
              </div>
            </div>
            <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[stat.color]}`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
          {/* Background decoration */}
          <div className={`absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-gradient-to-br ${colorClasses[stat.color]} opacity-10`} />
        </Card>
      ))}
    </div>
  );
}

export default AdminStats;
