// src/lib/supabase.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { 
  ProjectPerformanceData, 
  LeaderboardEntry, 
  LeaderboardRole, 
  RawChannelPartnerData, 
  ChannelPartnerEntry,
  RawSalesLeaderboardData,
  SalesLeaderboardEntry,
  SalesLeaderboardRole
} from '@/types/database';
import { formatDistanceToNow, parseISO, isValid } from 'date-fns';


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabaseInstance: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error("Error creating Supabase client:", error);
  }
} else {
  let warningMessage = "Supabase client not initialized. ";
  if (!supabaseUrl) {
    warningMessage += "NEXT_PUBLIC_SUPABASE_URL is not defined. ";
  } else if (!supabaseUrl.startsWith('http')) {
    warningMessage += `NEXT_PUBLIC_SUPABASE_URL is invalid (does not start with http(s)): ${supabaseUrl}. `;
  }
  if (!supabaseAnonKey) {
    warningMessage += "NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined. ";
  }
  console.warn(warningMessage + "Please check your .env.local file and ensure the Next.js development server was restarted after changes.");
}

export const supabase = supabaseInstance;

export async function fetchCities(): Promise<{ cities: string[]; error: string | null }> {
  if (!supabase) {
    const errorMsg = "Supabase client is not initialized. Cannot fetch cities. Check environment variables and Supabase setup.";
    console.error(errorMsg);
    return { cities: [], error: errorMsg };
  }

  const { data, error: supabaseError } = await supabase
    .from('project_performance_view') // This could also come from a dedicated 'cities' table or distinct on sales_members table city
    .select('city');

  if (supabaseError) {
    let errorMessage = 'Error fetching cities.';
    if (typeof supabaseError === 'object' && supabaseError !== null) {
        if (Object.keys(supabaseError).length === 0) {
            errorMessage = 'Error fetching cities: An empty error object was returned. This might be due to RLS policies, network issues, or the view returning no cities.';
        } else if ('message' in supabaseError && typeof supabaseError.message === 'string') {
            errorMessage = supabaseError.message;
        }  else {
            try {
                errorMessage = `Error fetching cities: ${JSON.stringify(supabaseError)}`;
            } catch {
                errorMessage = 'Error fetching cities: Non-serializable error object.';
            }
        }
    }
    console.error('Error details from Supabase (fetchCities):', supabaseError);
    console.error(errorMessage);
    return { cities: [], error: errorMessage };
  }

  if (!data) {
    return { cities: [], error: null }; 
  }
  
  const uniqueCities = [...new Set(data.map(item => item.city).filter(city => typeof city === 'string' && city.trim() !== '') as string[])].sort();
  return { cities: uniqueCities, error: null };
}


export async function fetchProjectData(
  city: string,
  role: LeaderboardRole
): Promise<{ data: LeaderboardEntry[]; error: string | null }> {
  if (!supabase) {
    const errorMsg = "Supabase client is not initialized. Cannot fetch project data. Check environment variables and Supabase setup.";
    console.error(errorMsg);
    return { data: [], error: errorMsg };
  }

  let query = supabase.from('project_performance_view').select<string, ProjectPerformanceData>(`
    crn_id,
    city,
    tl_name,
    spm_name,
    current_rag_status,
    cumulative_score,
    score_change,
    avg_bnb_csat,
    total_delay_days
  `);

  if (city !== 'Pan India' && city !== '') {
    query = query.eq('city', city);
  }

  const { data: rawData, error: supabaseError } = await query;

  if (supabaseError) {
    let errorMessage = 'Error fetching project performance data.';
    if (typeof supabaseError === 'object' && supabaseError !== null) {
        if (Object.keys(supabaseError).length === 0) { 
            errorMessage = 'Error fetching project performance data: An empty error object was returned from Supabase. This could be due to Row Level Security (RLS) policies, network issues, or the queried view/table (project_performance_view) returning no data matching the criteria (e.g., date filters in the view definition).';
        } else if ('message' in supabaseError && typeof supabaseError.message === 'string') {
            errorMessage = supabaseError.message;
        } else {
            try {
                errorMessage = `Error fetching project performance data: ${JSON.stringify(supabaseError)}`;
            } catch {
                errorMessage = 'Error fetching project performance data: Non-serializable error object.';
            }
        }
    }
    console.error('Error details from Supabase (fetchProjectData):', supabaseError); 
    console.error(errorMessage); 
    return { data: [], error: errorMessage };
  }

  if (!rawData) {
    return { data: [], error: null };
  }

  const aggregatedData: Record<string, {
    name: string;
    city: string | null;
    project_crns: Set<string>;
    total_cumulative_score: number;
    total_score_change: number;
    statuses: string[];
  }> = {};

  rawData.forEach(item => {
    let keyName: string | null = null;
    let personCity = item.city;

    if (role === 'SPM' && item.spm_name) keyName = item.spm_name;
    else if (role === 'TL' && item.tl_name) keyName = item.tl_name;
    else if (role === 'OM') {
      keyName = item.city ? `OM-${item.city}` : null; 
      personCity = item.city; 
    }
    
    if (!keyName) return;

    if (!aggregatedData[keyName]) {
      aggregatedData[keyName] = {
        name: keyName,
        city: personCity,
        project_crns: new Set(),
        total_cumulative_score: 0,
        total_score_change: 0,
        statuses: [],
      };
    }
    
    aggregatedData[keyName].project_crns.add(item.crn_id);
    aggregatedData[keyName].total_cumulative_score += item.cumulative_score || 0;
    aggregatedData[keyName].total_score_change += item.score_change || 0;
    if (item.current_rag_status) {
      aggregatedData[keyName].statuses.push(item.current_rag_status);
    }
  });

  const leaderboard: LeaderboardEntry[] = Object.values(aggregatedData)
    .map(agg => {
      let overallStatus: LeaderboardEntry['status'] = 'Green';
      if (agg.statuses.includes('Red')) overallStatus = 'Red';
      else if (agg.statuses.includes('Amber')) overallStatus = 'Amber';
      else if (agg.statuses.length === 0) overallStatus = 'N/A'; 

      return {
        name: agg.name,
        city: agg.city,
        projects: agg.project_crns.size,
        status: overallStatus,
        runs: agg.total_cumulative_score,
        trend: agg.total_score_change,
        rank: 0, 
      };
    })
    .sort((a, b) => b.runs - a.runs) 
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

  return { data: leaderboard, error: null };
}


// This function is kept for now, but might be deprecated if SalesLeaderboardTable fully replaces it.
export async function fetchChannelPartnerData(
  city: string
): Promise<{ data: ChannelPartnerEntry[]; error: string | null }> {
  if (!supabase) {
    const errorMsg = "Supabase client is not initialized. Cannot fetch channel partner data.";
    console.error(errorMsg);
    return { data: [], error: errorMsg };
  }

  let query = supabase
    .from('channel_partner_performance_view') 
    .select<string, RawChannelPartnerData>(`
      partner_id,
      partner_name,
      city,
      leads_generated,
      successful_conversions,
      total_score
    `);

  if (city !== 'Pan India' && city !== '') {
    query = query.eq('city', city);
  }

  const { data: rawData, error: supabaseError } = await query;

  if (supabaseError) {
    let errorMessage = 'Error fetching channel partner performance data.';
     if (typeof supabaseError === 'object' && supabaseError !== null) {
        if (Object.keys(supabaseError).length === 0) {
            errorMessage = 'Error fetching channel partner data: An empty error object was returned. This could be due to RLS policies, network issues, or the view/table returning no data matching the criteria.';
        } else if ('message' in supabaseError && typeof supabaseError.message === 'string') {
            errorMessage = supabaseError.message;
        } else {
            try {
                errorMessage = `Error fetching channel partner data: ${JSON.stringify(supabaseError)}`;
            } catch {
                errorMessage = 'Error fetching channel partner data: Non-serializable error object.';
            }
        }
    }
    console.error('Error details from Supabase (fetchChannelPartnerData):', supabaseError);
    console.error(errorMessage);
    return { data: [], error: errorMessage };
  }

  if (!rawData) {
    return { data: [], error: null };
  }

  const processedData: ChannelPartnerEntry[] = rawData
    .map(item => ({
      ...item,
      conversion_rate: item.leads_generated > 0 
        ? parseFloat(((item.successful_conversions / item.leads_generated) * 100).toFixed(1)) 
        : 0,
      rank: 0, 
    }))
    .sort((a, b) => b.total_score - a.total_score) 
    .map((entry, index) => ({
      ...entry,
      rank: index + 1, 
    }));

  return { data: processedData, error: null };
}


export async function fetchSalesLeaderboardData(
  city: string,
  role: SalesLeaderboardRole
): Promise<{ data: SalesLeaderboardEntry[]; error: string | null }> {
  if (!supabase) {
    const errorMsg = "Supabase client is not initialized. Cannot fetch sales leaderboard data.";
    console.error(errorMsg);
    return { data: [], error: errorMsg };
  }

  let query = supabase
    .from('sales_team_performance_view') // Query the new view
    .select<string, RawSalesLeaderboardData>(`
      participant_id,
      name,
      manager_name, 
      city,
      role,
      total_runs,
      kpi_types_count,
      last_update
    `)
    .eq('role', role); // Filter by the selected role

  if (city !== 'Pan India' && city !== '') {
    query = query.eq('city', city);
  }

  const { data: rawData, error: supabaseError } = await query;

  if (supabaseError) {
    let errorMessage = `Error fetching sales leaderboard data for role ${role}.`;
     if (typeof supabaseError === 'object' && supabaseError !== null) {
        if (Object.keys(supabaseError).length === 0) {
            errorMessage = `Error fetching sales leaderboard data for role ${role}: An empty error object was returned. This could be due to RLS policies, network issues, or the view 'sales_team_performance_view' returning no data. Ensure the view includes a 'manager_name' column.`;
        } else if ('message' in supabaseError && typeof supabaseError.message === 'string') {
            errorMessage = supabaseError.message;
        } else {
            try {
                errorMessage = `Error fetching sales leaderboard data for role ${role}: ${JSON.stringify(supabaseError)}`;
            } catch {
                errorMessage = `Error fetching sales leaderboard data for role ${role}: Non-serializable error object.`;
            }
        }
    }
    console.error(`Error details from Supabase (fetchSalesLeaderboardData for ${role}):`, supabaseError);
    console.error(errorMessage);
    return { data: [], error: errorMessage };
  }

  if (!rawData) {
    return { data: [], error: null };
  }

  const processedData: SalesLeaderboardEntry[] = rawData
    .map(item => {
      let last_update_formatted = 'N/A';
      if (item.last_update) {
        const date = parseISO(item.last_update);
        if (isValid(date)) {
          last_update_formatted = formatDistanceToNow(date, { addSuffix: true });
        }
      }
      return {
        ...item,
        rank: 0, // Rank will be assigned after sorting
        manager_name: item.manager_name || undefined,
        last_update_formatted,
        // trend: calculateTrend(item.participant_id, item.total_runs) // Placeholder for trend calculation logic
      };
    })
    .sort((a, b) => b.total_runs - a.total_runs) 
    .map((entry, index) => ({
      ...entry,
      rank: index + 1, 
    }));

  return { data: processedData, error: null };
}

