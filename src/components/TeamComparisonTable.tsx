import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import {
  getDoraPerformanceTier,
  formatMetricValue,
  getTierColor,
} from '../services/doraMetricsService';

interface TeamMetrics {
  team_name: string;
  deployment_frequency: number;
  lead_time: number;
  change_failure_rate: number;
  mttr: number;
}

interface TeamComparisonTableProps {
  data: TeamMetrics[];
  isLoading?: boolean;
}

type SortField = 'team_name' | 'deployment_frequency' | 'lead_time' | 'change_failure_rate' | 'mttr';
type SortDirection = 'asc' | 'desc';

export function TeamComparisonTable({ data, isLoading }: TeamComparisonTableProps) {
  const [sortField, setSortField] = useState<SortField>('team_name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (typeof aValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue as string)
        : (bValue as string).localeCompare(aValue);
    }

    return sortDirection === 'asc'
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <div className="h-4 w-4 opacity-30" />;
    }
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  const TierBadge = ({
    tier,
    value,
    metricType,
  }: {
    tier: 'Elite' | 'High' | 'Medium' | 'Low';
    value: number;
    metricType: 'deployment_frequency' | 'lead_time' | 'change_failure_rate' | 'mttr';
  }) => {
    const tierColors = {
      Elite: 'bg-green-100 text-green-800',
      High: 'bg-blue-100 text-blue-800',
      Medium: 'bg-amber-100 text-amber-800',
      Low: 'bg-red-100 text-red-800',
    };

    return (
      <div className="flex flex-col items-start gap-1">
        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${tierColors[tier]}`}>
          {tier}
        </span>
        <span className="text-xs text-gray-600">{formatMetricValue(value, metricType)}</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center bg-gray-50">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-6 py-3 text-left">
              <button
                onClick={() => handleSort('team_name')}
                className="flex items-center gap-2 font-semibold text-gray-900 hover:text-blue-600"
              >
                Team
                <SortIcon field="team_name" />
              </button>
            </th>
            <th className="px-6 py-3 text-left">
              <button
                onClick={() => handleSort('deployment_frequency')}
                className="flex items-center gap-2 font-semibold text-gray-900 hover:text-blue-600"
              >
                Deployment Frequency
                <SortIcon field="deployment_frequency" />
              </button>
            </th>
            <th className="px-6 py-3 text-left">
              <button
                onClick={() => handleSort('lead_time')}
                className="flex items-center gap-2 font-semibold text-gray-900 hover:text-blue-600"
              >
                Lead Time
                <SortIcon field="lead_time" />
              </button>
            </th>
            <th className="px-6 py-3 text-left">
              <button
                onClick={() => handleSort('change_failure_rate')}
                className="flex items-center gap-2 font-semibold text-gray-900 hover:text-blue-600"
              >
                Failure Rate
                <SortIcon field="change_failure_rate" />
              </button>
            </th>
            <th className="px-6 py-3 text-left">
              <button
                onClick={() => handleSort('mttr')}
                className="flex items-center gap-2 font-semibold text-gray-900 hover:text-blue-600"
              >
                MTTR
                <SortIcon field="mttr" />
              </button>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedData.map((team) => (
            <tr key={team.team_name} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <span className="font-medium text-gray-900">{team.team_name}</span>
              </td>
              <td className="px-6 py-4">
                <TierBadge
                  tier={getDoraPerformanceTier('deployment_frequency', team.deployment_frequency)}
                  value={team.deployment_frequency}
                  metricType="deployment_frequency"
                />
              </td>
              <td className="px-6 py-4">
                <TierBadge
                  tier={getDoraPerformanceTier('lead_time', team.lead_time)}
                  value={team.lead_time}
                  metricType="lead_time"
                />
              </td>
              <td className="px-6 py-4">
                <TierBadge
                  tier={getDoraPerformanceTier('change_failure_rate', team.change_failure_rate)}
                  value={team.change_failure_rate}
                  metricType="change_failure_rate"
                />
              </td>
              <td className="px-6 py-4">
                <TierBadge
                  tier={getDoraPerformanceTier('mttr', team.mttr)}
                  value={team.mttr}
                  metricType="mttr"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
