import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface DoraMetric {
  id: string;
  team_id: string;
  team_name: string;
  metric_type: 'deployment_frequency' | 'lead_time' | 'change_failure_rate' | 'mttr';
  value: number;
  period: string;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface TeamMetrics {
  team_name: string;
  deployment_frequency: number;
  lead_time: number;
  change_failure_rate: number;
  mttr: number;
}

const METRIC_TYPES = ['deployment_frequency', 'lead_time', 'change_failure_rate', 'mttr'] as const;

export async function getTeams(): Promise<Team[]> {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching teams:', error);
    return [];
  }

  return data || [];
}

export async function getMetricsByTeamAndPeriod(
  teamName: string,
  startDate: Date,
  endDate: Date
): Promise<DoraMetric[]> {
  const start = startDate.toISOString().split('T')[0];
  const end = endDate.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('dora_metrics')
    .select('*')
    .eq('team_name', teamName)
    .gte('period', start)
    .lte('period', end)
    .order('period', { ascending: true });

  if (error) {
    console.error('Error fetching metrics:', error);
    return [];
  }

  return data || [];
}

export async function getLatestMetricsForAllTeams(): Promise<TeamMetrics[]> {
  const { data, error } = await supabase
    .from('dora_metrics')
    .select('team_name, metric_type, value')
    .eq('period', new Date().toISOString().split('T')[0])
    .order('team_name');

  if (error) {
    console.error('Error fetching latest metrics:', error);
    return [];
  }

  const metricsMap = new Map<string, Partial<TeamMetrics>>();

  data?.forEach((metric: any) => {
    if (!metricsMap.has(metric.team_name)) {
      metricsMap.set(metric.team_name, { team_name: metric.team_name });
    }
    const team = metricsMap.get(metric.team_name)!;
    (team as any)[metric.metric_type] = metric.value;
  });

  return Array.from(metricsMap.values()) as TeamMetrics[];
}

export async function getAggregateMetrics(startDate: Date, endDate: Date) {
  const start = startDate.toISOString().split('T')[0];
  const end = endDate.toISOString().split('T')[0];

  const aggregates: Partial<Record<typeof METRIC_TYPES[number], number>> = {};

  for (const metricType of METRIC_TYPES) {
    const { data, error } = await supabase
      .from('dora_metrics')
      .select('value')
      .eq('metric_type', metricType)
      .gte('period', start)
      .lte('period', end);

    if (!error && data && data.length > 0) {
      const avg = data.reduce((sum, m) => sum + (m.value as number), 0) / data.length;
      aggregates[metricType] = Math.round(avg * 100) / 100;
    }
  }

  return aggregates;
}

export async function getMetricsTimeSeries(
  teamName: string,
  metricType: typeof METRIC_TYPES[number],
  startDate: Date,
  endDate: Date
) {
  const start = startDate.toISOString().split('T')[0];
  const end = endDate.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('dora_metrics')
    .select('period, value')
    .eq('team_name', teamName)
    .eq('metric_type', metricType)
    .gte('period', start)
    .lte('period', end)
    .order('period', { ascending: true });

  if (error) {
    console.error('Error fetching time series:', error);
    return [];
  }

  return data || [];
}

export function getDoraPerformanceTier(
  metricType: typeof METRIC_TYPES[number],
  value: number
): 'Elite' | 'High' | 'Medium' | 'Low' {
  switch (metricType) {
    case 'deployment_frequency':
      if (value >= 10) return 'Elite';
      if (value >= 5) return 'High';
      if (value >= 2) return 'Medium';
      return 'Low';
    case 'lead_time':
      if (value <= 1) return 'Elite';
      if (value <= 7) return 'High';
      if (value <= 30) return 'Medium';
      return 'Low';
    case 'change_failure_rate':
      if (value <= 5) return 'Elite';
      if (value <= 15) return 'High';
      if (value <= 30) return 'Medium';
      return 'Low';
    case 'mttr':
      if (value <= 60) return 'Elite';
      if (value <= 180) return 'High';
      if (value <= 360) return 'Medium';
      return 'Low';
    default:
      return 'Low';
  }
}

export function getTierColor(tier: 'Elite' | 'High' | 'Medium' | 'Low'): string {
  switch (tier) {
    case 'Elite':
      return '#10b981';
    case 'High':
      return '#3b82f6';
    case 'Medium':
      return '#f59e0b';
    case 'Low':
      return '#ef4444';
    default:
      return '#6b7280';
  }
}

export function formatMetricValue(
  value: number,
  metricType: typeof METRIC_TYPES[number]
): string {
  switch (metricType) {
    case 'deployment_frequency':
      return `${value.toFixed(1)}x/week`;
    case 'lead_time':
      return `${value.toFixed(1)}d`;
    case 'change_failure_rate':
      return `${value.toFixed(1)}%`;
    case 'mttr':
      return `${Math.round(value)}m`;
    default:
      return value.toFixed(1);
  }
}
