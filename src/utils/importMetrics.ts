import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface TeamMetricData {
  metric_type: 'deployment_frequency' | 'lead_time' | 'change_failure_rate' | 'mttr';
  value: number;
  period: string;
}

interface TeamData {
  name: string;
  description?: string;
  metrics: TeamMetricData[];
}

interface JSONData {
  teams: TeamData[];
}

export async function importMetricsFromJSON(jsonData: JSONData): Promise<void> {
  const insertPromises = [];

  for (const team of jsonData.teams) {
    const { data: existingTeam } = await supabase
      .from('teams')
      .select('id')
      .eq('name', team.name)
      .maybeSingle();

    let teamId = existingTeam?.id;

    if (!teamId) {
      const { data: newTeam, error: insertError } = await supabase
        .from('teams')
        .insert({
          name: team.name,
          description: team.description || null,
        })
        .select('id')
        .maybeSingle();

      if (insertError) {
        console.error(`Error creating team ${team.name}:`, insertError);
        continue;
      }

      teamId = newTeam?.id;
    }

    if (teamId) {
      for (const metric of team.metrics) {
        insertPromises.push(
          supabase.from('dora_metrics').upsert(
            {
              team_id: teamId,
              team_name: team.name,
              metric_type: metric.metric_type,
              value: metric.value,
              period: metric.period,
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: 'team_id,team_name,metric_type,period',
            }
          )
        );
      }
    }
  }

  const results = await Promise.all(insertPromises);

  const hasErrors = results.some((result) => result.error);
  if (hasErrors) {
    console.error(
      'Some metrics failed to import',
      results.filter((r) => r.error)
    );
  }
}

export function validateJSONSchema(data: any): data is JSONData {
  if (!data.teams || !Array.isArray(data.teams)) {
    throw new Error('Invalid JSON format: missing or invalid "teams" array');
  }

  for (const team of data.teams) {
    if (!team.name || typeof team.name !== 'string') {
      throw new Error('Invalid team: missing or invalid "name"');
    }

    if (!team.metrics || !Array.isArray(team.metrics)) {
      throw new Error(`Invalid metrics for team "${team.name}": missing or invalid "metrics" array`);
    }

    for (const metric of team.metrics) {
      if (!metric.metric_type || !metric.value || !metric.period) {
        throw new Error(
          `Invalid metric for team "${team.name}": missing metric_type, value, or period`
        );
      }

      const validTypes = ['deployment_frequency', 'lead_time', 'change_failure_rate', 'mttr'];
      if (!validTypes.includes(metric.metric_type)) {
        throw new Error(
          `Invalid metric_type "${metric.metric_type}" for team "${team.name}". Must be one of: ${validTypes.join(', ')}`
        );
      }
    }
  }

  return true;
}
