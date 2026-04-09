import React from 'react';
import { Calendar } from 'lucide-react';

interface FilterBarProps {
  selectedTeams: string[];
  onTeamsChange: (teams: string[]) => void;
  selectedPeriod: number;
  onPeriodChange: (period: number) => void;
  allTeams: string[];
}

export function FilterBar({
  selectedTeams,
  onTeamsChange,
  selectedPeriod,
  onPeriodChange,
  allTeams,
}: FilterBarProps) {
  const handleTeamToggle = (teamName: string) => {
    if (selectedTeams.includes(teamName)) {
      onTeamsChange(selectedTeams.filter((t) => t !== teamName));
    } else {
      onTeamsChange([...selectedTeams, teamName]);
    }
  };

  const handleSelectAll = () => {
    if (selectedTeams.length === allTeams.length) {
      onTeamsChange([]);
    } else {
      onTeamsChange([...allTeams]);
    }
  };

  return (
    <div className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Time Period Filter */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Calendar className="h-4 w-4" />
              Time Period
            </label>
            <div className="mt-3 flex gap-2">
              {[
                { label: '7d', value: 7 },
                { label: '30d', value: 30 },
                { label: '90d', value: 90 },
              ].map((period) => (
                <button
                  key={period.value}
                  onClick={() => onPeriodChange(period.value)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    selectedPeriod === period.value
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>

          {/* Teams Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Teams</label>
            <div className="mt-3 space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedTeams.length === allTeams.length && allTeams.length > 0}
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600"
                />
                <span className="text-sm text-gray-700">
                  {selectedTeams.length === allTeams.length && allTeams.length > 0
                    ? 'Deselect All'
                    : 'Select All'}
                </span>
              </label>
              <div className="grid gap-1">
                {allTeams.map((team) => (
                  <label key={team} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedTeams.includes(team)}
                      onChange={() => handleTeamToggle(team)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">{team}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
