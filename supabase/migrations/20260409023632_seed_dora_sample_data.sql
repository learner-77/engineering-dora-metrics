/*
  # Seed DORA Metrics Sample Data

  1. Teams
    - Creates 6 sample teams with varying performance levels

  2. DORA Metrics
    - Populates deployment_frequency, lead_time, change_failure_rate, and mttr
    - Data spans last 90 days for trend analysis
    - Reflects realistic performance distributions across Elite, High, Medium, and Low tiers
*/

DO $$
DECLARE
  team_backend_id uuid;
  team_frontend_id uuid;
  team_platform_id uuid;
  team_data_id uuid;
  team_devops_id uuid;
  team_security_id uuid;
BEGIN
  INSERT INTO teams (name, description) VALUES
    ('Backend Services', 'Core API and services team'),
    ('Frontend Web', 'Web UI and client team'),
    ('Platform', 'Infrastructure and platform team'),
    ('Data Engineering', 'Data pipeline and analytics team'),
    ('DevOps', 'CI/CD and deployment team'),
    ('Security', 'Security and compliance team')
  ON CONFLICT (name) DO NOTHING;

  SELECT id INTO team_backend_id FROM teams WHERE name = 'Backend Services';
  SELECT id INTO team_frontend_id FROM teams WHERE name = 'Frontend Web';
  SELECT id INTO team_platform_id FROM teams WHERE name = 'Platform';
  SELECT id INTO team_data_id FROM teams WHERE name = 'Data Engineering';
  SELECT id INTO team_devops_id FROM teams WHERE name = 'DevOps';
  SELECT id INTO team_security_id FROM teams WHERE name = 'Security';

  INSERT INTO dora_metrics (team_id, team_name, metric_type, value, period) 
  SELECT team_backend_id, 'Backend Services', 'deployment_frequency', (ARRAY[10, 12, 11, 13, 9, 11, 12])[((EXTRACT(DOW FROM CURRENT_DATE - d)::int + 1) % 7) + 1], CURRENT_DATE - d
  FROM generate_series(0, 89) d
  ON CONFLICT DO NOTHING;

  INSERT INTO dora_metrics (team_id, team_name, metric_type, value, period)
  SELECT team_backend_id, 'Backend Services', 'lead_time', (ARRAY[1, 1.2, 1.5, 0.8, 1.1, 1.3, 0.9])[((EXTRACT(DOW FROM CURRENT_DATE - d)::int + 1) % 7) + 1], CURRENT_DATE - d
  FROM generate_series(0, 89) d
  ON CONFLICT DO NOTHING;

  INSERT INTO dora_metrics (team_id, team_name, metric_type, value, period)
  SELECT team_backend_id, 'Backend Services', 'change_failure_rate', (ARRAY[2, 2.5, 2.1, 1.8, 2.3, 2.2, 1.9])[((EXTRACT(DOW FROM CURRENT_DATE - d)::int + 1) % 7) + 1], CURRENT_DATE - d
  FROM generate_series(0, 89) d
  ON CONFLICT DO NOTHING;

  INSERT INTO dora_metrics (team_id, team_name, metric_type, value, period)
  SELECT team_backend_id, 'Backend Services', 'mttr', (ARRAY[45, 50, 48, 42, 46, 49, 44])[((EXTRACT(DOW FROM CURRENT_DATE - d)::int + 1) % 7) + 1], CURRENT_DATE - d
  FROM generate_series(0, 89) d
  ON CONFLICT DO NOTHING;

  INSERT INTO dora_metrics (team_id, team_name, metric_type, value, period) 
  SELECT team_frontend_id, 'Frontend Web', 'deployment_frequency', (ARRAY[8, 7, 9, 6, 8, 7, 8])[((EXTRACT(DOW FROM CURRENT_DATE - d)::int + 1) % 7) + 1], CURRENT_DATE - d
  FROM generate_series(0, 89) d
  ON CONFLICT DO NOTHING;

  INSERT INTO dora_metrics (team_id, team_name, metric_type, value, period)
  SELECT team_frontend_id, 'Frontend Web', 'lead_time', (ARRAY[2.5, 2.8, 2.3, 2.9, 2.6, 2.7, 2.4])[((EXTRACT(DOW FROM CURRENT_DATE - d)::int + 1) % 7) + 1], CURRENT_DATE - d
  FROM generate_series(0, 89) d
  ON CONFLICT DO NOTHING;

  INSERT INTO dora_metrics (team_id, team_name, metric_type, value, period)
  SELECT team_frontend_id, 'Frontend Web', 'change_failure_rate', (ARRAY[5, 5.5, 4.8, 5.2, 5.1, 5.3, 4.9])[((EXTRACT(DOW FROM CURRENT_DATE - d)::int + 1) % 7) + 1], CURRENT_DATE - d
  FROM generate_series(0, 89) d
  ON CONFLICT DO NOTHING;

  INSERT INTO dora_metrics (team_id, team_name, metric_type, value, period)
  SELECT team_frontend_id, 'Frontend Web', 'mttr', (ARRAY[90, 95, 88, 92, 89, 94, 91])[((EXTRACT(DOW FROM CURRENT_DATE - d)::int + 1) % 7) + 1], CURRENT_DATE - d
  FROM generate_series(0, 89) d
  ON CONFLICT DO NOTHING;

  INSERT INTO dora_metrics (team_id, team_name, metric_type, value, period) 
  SELECT team_platform_id, 'Platform', 'deployment_frequency', (ARRAY[15, 14, 16, 13, 15, 14, 15])[((EXTRACT(DOW FROM CURRENT_DATE - d)::int + 1) % 7) + 1], CURRENT_DATE - d
  FROM generate_series(0, 89) d
  ON CONFLICT DO NOTHING;

  INSERT INTO dora_metrics (team_id, team_name, metric_type, value, period)
  SELECT team_platform_id, 'Platform', 'lead_time', (ARRAY[0.5, 0.6, 0.7, 0.4, 0.5, 0.6, 0.5])[((EXTRACT(DOW FROM CURRENT_DATE - d)::int + 1) % 7) + 1], CURRENT_DATE - d
  FROM generate_series(0, 89) d
  ON CONFLICT DO NOTHING;

  INSERT INTO dora_metrics (team_id, team_name, metric_type, value, period)
  SELECT team_platform_id, 'Platform', 'change_failure_rate', (ARRAY[1, 1.2, 0.9, 1.1, 1.0, 1.2, 0.8])[((EXTRACT(DOW FROM CURRENT_DATE - d)::int + 1) % 7) + 1], CURRENT_DATE - d
  FROM generate_series(0, 89) d
  ON CONFLICT DO NOTHING;

  INSERT INTO dora_metrics (team_id, team_name, metric_type, value, period)
  SELECT team_platform_id, 'Platform', 'mttr', (ARRAY[30, 32, 28, 31, 29, 33, 30])[((EXTRACT(DOW FROM CURRENT_DATE - d)::int + 1) % 7) + 1], CURRENT_DATE - d
  FROM generate_series(0, 89) d
  ON CONFLICT DO NOTHING;

  INSERT INTO dora_metrics (team_id, team_name, metric_type, value, period) 
  SELECT team_data_id, 'Data Engineering', 'deployment_frequency', (ARRAY[4, 3, 5, 3, 4, 3, 4])[((EXTRACT(DOW FROM CURRENT_DATE - d)::int + 1) % 7) + 1], CURRENT_DATE - d
  FROM generate_series(0, 89) d
  ON CONFLICT DO NOTHING;

  INSERT INTO dora_metrics (team_id, team_name, metric_type, value, period)
  SELECT team_data_id, 'Data Engineering', 'lead_time', (ARRAY[5, 5.5, 4.8, 5.2, 5.1, 5.3, 4.9])[((EXTRACT(DOW FROM CURRENT_DATE - d)::int + 1) % 7) + 1], CURRENT_DATE - d
  FROM generate_series(0, 89) d
  ON CONFLICT DO NOTHING;

  INSERT INTO dora_metrics (team_id, team_name, metric_type, value, period)
  SELECT team_data_id, 'Data Engineering', 'change_failure_rate', (ARRAY[12, 13, 11, 12.5, 12.2, 13.1, 11.8])[((EXTRACT(DOW FROM CURRENT_DATE - d)::int + 1) % 7) + 1], CURRENT_DATE - d
  FROM generate_series(0, 89) d
  ON CONFLICT DO NOTHING;

  INSERT INTO dora_metrics (team_id, team_name, metric_type, value, period)
  SELECT team_data_id, 'Data Engineering', 'mttr', (ARRAY[240, 250, 230, 245, 235, 255, 240])[((EXTRACT(DOW FROM CURRENT_DATE - d)::int + 1) % 7) + 1], CURRENT_DATE - d
  FROM generate_series(0, 89) d
  ON CONFLICT DO NOTHING;

  INSERT INTO dora_metrics (team_id, team_name, metric_type, value, period) 
  SELECT team_devops_id, 'DevOps', 'deployment_frequency', (ARRAY[20, 19, 21, 18, 20, 19, 20])[((EXTRACT(DOW FROM CURRENT_DATE - d)::int + 1) % 7) + 1], CURRENT_DATE - d
  FROM generate_series(0, 89) d
  ON CONFLICT DO NOTHING;

  INSERT INTO dora_metrics (team_id, team_name, metric_type, value, period)
  SELECT team_devops_id, 'DevOps', 'lead_time', (ARRAY[0.3, 0.4, 0.35, 0.3, 0.35, 0.4, 0.3])[((EXTRACT(DOW FROM CURRENT_DATE - d)::int + 1) % 7) + 1], CURRENT_DATE - d
  FROM generate_series(0, 89) d
  ON CONFLICT DO NOTHING;

  INSERT INTO dora_metrics (team_id, team_name, metric_type, value, period)
  SELECT team_devops_id, 'DevOps', 'change_failure_rate', (ARRAY[0.5, 0.6, 0.4, 0.5, 0.5, 0.6, 0.4])[((EXTRACT(DOW FROM CURRENT_DATE - d)::int + 1) % 7) + 1], CURRENT_DATE - d
  FROM generate_series(0, 89) d
  ON CONFLICT DO NOTHING;

  INSERT INTO dora_metrics (team_id, team_name, metric_type, value, period)
  SELECT team_devops_id, 'DevOps', 'mttr', (ARRAY[15, 18, 14, 16, 15, 19, 16])[((EXTRACT(DOW FROM CURRENT_DATE - d)::int + 1) % 7) + 1], CURRENT_DATE - d
  FROM generate_series(0, 89) d
  ON CONFLICT DO NOTHING;

  INSERT INTO dora_metrics (team_id, team_name, metric_type, value, period) 
  SELECT team_security_id, 'Security', 'deployment_frequency', (ARRAY[2, 2, 2, 1, 2, 2, 1])[((EXTRACT(DOW FROM CURRENT_DATE - d)::int + 1) % 7) + 1], CURRENT_DATE - d
  FROM generate_series(0, 89) d
  ON CONFLICT DO NOTHING;

  INSERT INTO dora_metrics (team_id, team_name, metric_type, value, period)
  SELECT team_security_id, 'Security', 'lead_time', (ARRAY[15, 16, 14, 16, 15, 17, 15])[((EXTRACT(DOW FROM CURRENT_DATE - d)::int + 1) % 7) + 1], CURRENT_DATE - d
  FROM generate_series(0, 89) d
  ON CONFLICT DO NOTHING;

  INSERT INTO dora_metrics (team_id, team_name, metric_type, value, period)
  SELECT team_security_id, 'Security', 'change_failure_rate', (ARRAY[25, 26, 24, 25.5, 25.2, 26.1, 24.8])[((EXTRACT(DOW FROM CURRENT_DATE - d)::int + 1) % 7) + 1], CURRENT_DATE - d
  FROM generate_series(0, 89) d
  ON CONFLICT DO NOTHING;

  INSERT INTO dora_metrics (team_id, team_name, metric_type, value, period)
  SELECT team_security_id, 'Security', 'mttr', (ARRAY[480, 500, 470, 490, 480, 510, 485])[((EXTRACT(DOW FROM CURRENT_DATE - d)::int + 1) % 7) + 1], CURRENT_DATE - d
  FROM generate_series(0, 89) d
  ON CONFLICT DO NOTHING;

END $$;
