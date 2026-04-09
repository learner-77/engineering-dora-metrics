import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { MetricCard } from './components/MetricCard';
import { DeploymentFrequencyChart } from './components/charts/DeploymentFrequencyChart';
import { LeadTimeChart } from './components/charts/LeadTimeChart';
import { ChangeFailureChart } from './components/charts/ChangeFailureChart';
import { MTTRChart } from './components/charts/MTTRChart';
import { TeamComparisonTable } from './components/TeamComparisonTable';
import { useDoraMetrics } from './hooks/useDoraMetrics';
import {
  getDoraPerformanceTier,
  formatMetricValue,
  getMetricsTimeSeries,
} from './services/doraMetricsService';
import { importMetricsFromJSON, validateJSONSchema } from './utils/importMetrics';

function App() {
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [lastUpdated, setLastUpdated] = useState('--:--');

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - selectedPeriod);

  const { teams, latestMetrics, aggregateMetrics, isLoading, error, refetch } = useDoraMetrics({
    startDate,
    endDate,
  });

  const [deploymentFreqData, setDeploymentFreqData] = useState<any[]>([]);
  const [leadTimeData, setLeadTimeData] = useState<any[]>([]);
  const [changeFailureData, setChangeFailureData] = useState<any[]>([]);
  const [mttrData, setMTTRData] = useState<any[]>([]);

  useEffect(() => {
    setLastUpdated(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
  }, [isLoading]);

  useEffect(() => {
    setSelectedTeams(teams.map((t) => t.name));
  }, [teams]);

  useEffect(() => {
    const fetchChartData = async () => {
      if (selectedTeams.length === 0) {
        setDeploymentFreqData([]);
        setLeadTimeData([]);
        setChangeFailureData([]);
        setMTTRData([]);
        return;
      }

      const teamToFetch = selectedTeams[0];

      const [depFreq, leadTime, changeFailure, mttr] = await Promise.all([
        getMetricsTimeSeries(teamToFetch, 'deployment_frequency', startDate, endDate),
        getMetricsTimeSeries(teamToFetch, 'lead_time', startDate, endDate),
        getMetricsTimeSeries(teamToFetch, 'change_failure_rate', startDate, endDate),
        getMetricsTimeSeries(teamToFetch, 'mttr', startDate, endDate),
      ]);

      setDeploymentFreqData(depFreq);
      setLeadTimeData(leadTime);
      setChangeFailureData(changeFailure);
      setMTTRData(mttr);
    };

    fetchChartData();
  }, [selectedTeams, selectedPeriod]);

  const filteredMetrics = selectedTeams.length > 0
    ? latestMetrics.filter((m) => selectedTeams.includes(m.team_name))
    : latestMetrics;

  const deploymentFreqByTeam = filteredMetrics.map((m) => ({
    team_name: m.team_name,
    value: m.deployment_frequency,
  }));

  const leadTimeByTeam = filteredMetrics.map((m) => ({
    team_name: m.team_name,
    value: m.lead_time,
  }));

  const changeFailureByTeam = filteredMetrics.map((m) => ({
    team_name: m.team_name,
    value: m.change_failure_rate,
  }));

  const mttrByTeam = filteredMetrics.map((m) => ({
    team_name: m.team_name,
    value: m.mttr,
  }));

  const avgDeploymentFreq = aggregateMetrics.deployment_frequency || 0;
  const avgLeadTime = aggregateMetrics.lead_time || 0;
  const avgChangeFailure = aggregateMetrics.change_failure_rate || 0;
  const avgMTTR = aggregateMetrics.mttr || 0;

  const handleRefresh = async () => {
    await refetch();
  };

  const handleImport = async (file: File) => {
    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);
      validateJSONSchema(jsonData);
      await importMetricsFromJSON(jsonData);
      await refetch();
      alert('Metrics imported successfully!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to import metrics';
      alert(`Import failed: ${message}`);
      console.error('Import error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onRefresh={handleRefresh}
        onImport={handleImport}
        isLoading={isLoading}
        lastUpdated={lastUpdated}
      />

      {error && (
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-red-50 p-4 text-red-700">{error}</div>
        </div>
      )}

      <FilterBar
        selectedTeams={selectedTeams}
        onTeamsChange={setSelectedTeams}
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        allTeams={teams.map((t) => t.name)}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Summary Cards */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Deployment Frequency"
            value={formatMetricValue(avgDeploymentFreq, 'deployment_frequency')}
            tier={getDoraPerformanceTier('deployment_frequency', avgDeploymentFreq)}
            benchmark="Elite: 10+ deployments/week"
          />
          <MetricCard
            title="Lead Time for Changes"
            value={formatMetricValue(avgLeadTime, 'lead_time')}
            tier={getDoraPerformanceTier('lead_time', avgLeadTime)}
            benchmark="Elite: ≤1 day"
          />
          <MetricCard
            title="Change Failure Rate"
            value={formatMetricValue(avgChangeFailure, 'change_failure_rate')}
            tier={getDoraPerformanceTier('change_failure_rate', avgChangeFailure)}
            benchmark="Elite: ≤5%"
          />
          <MetricCard
            title="Mean Time to Recovery"
            value={formatMetricValue(avgMTTR, 'mttr')}
            tier={getDoraPerformanceTier('mttr', avgMTTR)}
            benchmark="Elite: ≤1 hour"
          />
        </div>

        {/* Charts Grid */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Deployment Frequency</h3>
            <DeploymentFrequencyChart data={deploymentFreqByTeam} isLoading={isLoading} />
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Lead Time Trend</h3>
            <LeadTimeChart
              data={leadTimeData}
              isLoading={isLoading}
              teamName={selectedTeams[0]}
            />
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Change Failure Rate</h3>
            <ChangeFailureChart data={changeFailureByTeam} isLoading={isLoading} />
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Mean Time to Recovery</h3>
            <MTTRChart data={mttrByTeam} isLoading={isLoading} />
          </div>
        </div>

        {/* Team Comparison Table */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Team Performance Comparison</h3>
          <TeamComparisonTable data={filteredMetrics} isLoading={isLoading} />
        </div>

        {/* Legend */}
        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">DORA Performance Tiers</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 h-3 w-3 rounded-full bg-green-600" />
              <div>
                <p className="font-medium text-gray-900">Elite</p>
                <p className="text-sm text-gray-600">Top 10% performance</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-3 w-3 rounded-full bg-blue-600" />
              <div>
                <p className="font-medium text-gray-900">High</p>
                <p className="text-sm text-gray-600">Top 25% performance</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-3 w-3 rounded-full bg-amber-600" />
              <div>
                <p className="font-medium text-gray-900">Medium</p>
                <p className="text-sm text-gray-600">Top 50% performance</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-3 w-3 rounded-full bg-red-600" />
              <div>
                <p className="font-medium text-gray-900">Low</p>
                <p className="text-sm text-gray-600">Bottom 50% performance</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
