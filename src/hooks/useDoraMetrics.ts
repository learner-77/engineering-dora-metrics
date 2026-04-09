import { useEffect, useState } from 'react';
import {
  getTeams,
  getLatestMetricsForAllTeams,
  getMetricsTimeSeries,
  getAggregateMetrics,
  Team,
  TeamMetrics,
  DoraMetric,
} from '../services/doraMetricsService';

export interface UseDoraMetricsOptions {
  teamName?: string;
  startDate?: Date;
  endDate?: Date;
  metricType?: string;
}

export interface UseDoraMetricsResult {
  teams: Team[];
  latestMetrics: TeamMetrics[];
  timeSeries: any[];
  aggregateMetrics: Record<string, number>;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDoraMetrics(options: UseDoraMetricsOptions = {}): UseDoraMetricsResult {
  const [teams, setTeams] = useState<Team[]>([]);
  const [latestMetrics, setLatestMetrics] = useState<TeamMetrics[]>([]);
  const [timeSeries, setTimeSeries] = useState<any[]>([]);
  const [aggregateMetrics, setAggregateMetrics] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [teamsData, latestData] = await Promise.all([
        getTeams(),
        getLatestMetricsForAllTeams(),
      ]);

      setTeams(teamsData);
      setLatestMetrics(latestData);

      if (options.teamName && options.startDate && options.endDate && options.metricType) {
        const seriesData = await getMetricsTimeSeries(
          options.teamName,
          options.metricType as any,
          options.startDate,
          options.endDate
        );
        setTimeSeries(seriesData);
      }

      if (options.startDate && options.endDate) {
        const aggregateData = await getAggregateMetrics(options.startDate, options.endDate);
        setAggregateMetrics(aggregateData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [options.teamName, options.startDate, options.endDate, options.metricType]);

  return {
    teams,
    latestMetrics,
    timeSeries,
    aggregateMetrics,
    isLoading,
    error,
    refetch: fetchData,
  };
}
