import React from 'react';
import { Card } from '../ui';

export function RevenueChart({ data = [] }) {
  // Calculate max value for scaling
  const maxValue = Math.max(...data.map(d => d.value), 1);
  
  // Format currency
  const formatCurrency = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Доход</h3>
        <div className="flex gap-4 text-sm">
          <button className="text-blue-400 font-medium">7 дней</button>
          <button className="text-gray-400 hover:text-white transition-colors">30 дней</button>
          <button className="text-gray-400 hover:text-white transition-colors">90 дней</button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 flex items-end gap-2">
        {data.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Нет данных
          </div>
        ) : (
          data.map((item, idx) => {
            const height = (item.value / maxValue) * 100;
            return (
              <div 
                key={idx} 
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div className="w-full flex flex-col items-center justify-end h-48">
                  <span className="text-xs text-gray-400 mb-1">
                    {formatCurrency(item.value)} ₽
                  </span>
                  <div 
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-500 hover:from-blue-500 hover:to-blue-300"
                    style={{ height: `${Math.max(height, 4)}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">{item.label}</span>
              </div>
            );
          })
        )}
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
        <div>
          <p className="text-gray-400 text-sm">Всего за период</p>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(data.reduce((acc, d) => acc + d.value, 0))} ₽
          </p>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-sm">Средний чек</p>
          <p className="text-xl font-bold text-green-400">
            {formatCurrency(Math.round(data.reduce((acc, d) => acc + d.value, 0) / Math.max(data.length, 1)))} ₽
          </p>
        </div>
      </div>
    </Card>
  );
}

export default RevenueChart;
