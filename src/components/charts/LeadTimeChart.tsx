import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface LeadTimeChartProps {
  data: {
    period: string;
    value: number;
  }[];
  isLoading?: boolean;
  teamName?: string;
}

export function LeadTimeChart({ data, isLoading, teamName }: LeadTimeChartProps) {
  if (isLoading) {
    return (
      <div className="flex h-80 items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    date: new Date(item.period).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    'Lead Time (days)': Math.round(item.value * 10) / 10,
  }));

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            interval={Math.max(0, Math.floor(chartData.length / 8))}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
            formatter={(value) => [`${value} days`, 'Lead Time']}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="Lead Time (days)"
            stroke="#3b82f6"
            dot={false}
            strokeWidth={2}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
