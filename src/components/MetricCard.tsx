import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  tier: 'Elite' | 'High' | 'Medium' | 'Low';
  trend?: 'up' | 'down' | 'neutral';
  trendPercent?: number;
  benchmark?: string;
  description?: string;
}

const tierConfig = {
  Elite: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    badge: 'bg-green-100 text-green-800',
    text: 'Elite',
  },
  High: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-800',
    text: 'High',
  },
  Medium: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-800',
    text: 'Medium',
  },
  Low: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-800',
    text: 'Low',
  },
};

export function MetricCard({
  title,
  value,
  tier,
  trend,
  trendPercent,
  benchmark,
  description,
}: MetricCardProps) {
  const config = tierConfig[tier];

  return (
    <div className={`rounded-lg border-2 ${config.border} ${config.bg} p-6`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {description && <p className="mt-1 text-xs text-gray-600">{description}</p>}
        </div>
        <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${config.badge}`}>
          {config.text}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        {trend && trendPercent !== undefined && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              trend === 'up'
                ? 'text-green-600'
                : trend === 'down'
                  ? 'text-red-600'
                  : 'text-gray-600'
            }`}
          >
            {trend === 'up' && <TrendingUp className="h-4 w-4" />}
            {trend === 'down' && <TrendingDown className="h-4 w-4" />}
            <span>{Math.abs(trendPercent)}%</span>
          </div>
        )}
        {benchmark && <p className="text-xs text-gray-600">vs {benchmark}</p>}
      </div>
    </div>
  );
}
