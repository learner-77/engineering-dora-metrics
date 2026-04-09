import React, { useState } from 'react';
import { RefreshCw, Upload } from 'lucide-react';

interface HeaderProps {
  onRefresh: () => void;
  onImport: (file: File) => void;
  isLoading: boolean;
  lastUpdated: string;
}

export function Header({ onRefresh, onImport, isLoading, lastUpdated }: HeaderProps) {
  const [importing, setImporting] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImporting(true);
      onImport(file);
      setImporting(false);
      event.target.value = '';
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">DORA Metrics Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              Track engineering team performance and DevOps metrics
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-500">Last updated</p>
              <p className="text-sm font-medium text-gray-900">{lastUpdated}</p>
            </div>

            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100">
              <Upload className="h-4 w-4" />
              Import JSON
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                disabled={importing}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </header>
  );
}
