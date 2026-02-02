import React from 'react';
import { Card } from '../ui';
import { ImageIcon, Download, Share2, Clock } from 'lucide-react';

export function DashboardStats({ stats }) {
  const statCards = [
    {
      title: 'Генераций',
      value: stats?.totalGenerations || 0,
      subtitle: 'всего создано',
      icon: ImageIcon,
      color: 'blue',
    },
    {
      title: 'Скачиваний',
      value: stats?.totalDownloads || 0,
      subtitle: 'HD изображений',
      icon: Download,
      color: 'green',
    },
    {
      title: 'Поделились',
      value: stats?.totalShares || 0,
      subtitle: 'раз',
      icon: Share2,
      color: 'purple',
    },
    {
      title: 'Среднее время',
      value: `${stats?.avgGenerationTime || 0}с`,
      subtitle: 'генерации',
      icon: Clock,
      color: 'orange',
    },
  ];

  const colorClasses = {
    blue: 'from-blue-500 to-blue-700',
    green: 'from-green-500 to-green-700',
    purple: 'from-purple-500 to-purple-700',
    orange: 'from-orange-500 to-orange-700',
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, idx) => (
        <Card key={idx} padding="md">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[stat.color]}`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.subtitle}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default DashboardStats;
