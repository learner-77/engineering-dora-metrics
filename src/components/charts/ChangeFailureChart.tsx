import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ChangeFailureChartProps {
  data: {
    team_name: string;
    value: number;
  }[];
  isLoading?: boolean;
}

export function ChangeFailureChart({ data, isLoading }: ChangeFailureChartProps) {
  if (isLoading) {
    return (
      <div className="flex h-80 items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.team_name,
    'Failure Rate (%)': Math.round(item.value * 10) / 10,
  }));

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fontSize: 12 }}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
            formatter={(value) => [`${value}%`, 'Failure Rate']}
          />
          <Legend />
          <Bar dataKey="Failure Rate (%)" fill="#ef4444" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
