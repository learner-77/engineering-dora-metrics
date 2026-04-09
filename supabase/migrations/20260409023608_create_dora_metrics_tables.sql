/*
  # Create DORA Metrics Tables

  1. New Tables
    - `teams`: Store team information
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text, optional)
      - `created_at` (timestamp)
    
    - `dora_metrics`: Store DORA metric data
      - `id` (uuid, primary key)
      - `team_id` (uuid, foreign key)
      - `team_name` (text, for quick access)
      - `metric_type` (text: deployment_frequency, lead_time, change_failure_rate, mttr)
      - `value` (numeric)
      - `period` (date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Indexes
    - Index on (team_id, metric_type, period) for efficient queries
    - Index on period for time-range queries

  3. Security
    - Enable RLS on both tables
    - Allow public read access (metrics are not sensitive)
    - Allow authenticated inserts/updates for data imports
*/

CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS dora_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  team_name text NOT NULL,
  metric_type text NOT NULL CHECK (metric_type IN ('deployment_frequency', 'lead_time', 'change_failure_rate', 'mttr')),
  value numeric NOT NULL,
  period date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dora_metrics_team_metric_period ON dora_metrics(team_id, metric_type, period);
CREATE INDEX IF NOT EXISTS idx_dora_metrics_period ON dora_metrics(period);
CREATE INDEX IF NOT EXISTS idx_dora_metrics_team_name ON dora_metrics(team_name);

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE dora_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teams are publicly readable"
  ON teams FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Metrics are publicly readable"
  ON dora_metrics FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert teams"
  ON teams FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert metrics"
  ON dora_metrics FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update metrics"
  ON dora_metrics FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete metrics"
  ON dora_metrics FOR DELETE
  TO authenticated
  USING (true);
