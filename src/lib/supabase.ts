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
  SalesLeaderboardRole,
  ManagerLeaderboardEntry,
  CityLeaderboardEntry
} from '@/types/database';

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
    const errorMsg = "Supabase client is not initialized. Cannot fetch cities for the filter. Check environment variables and Supabase setup.";
    console.error(errorMsg);
    return { cities: [], error: errorMsg };
  }

  // Fetch cities exclusively from sale_view for the BPL Sales filter
  let salesCities: string[] = [];
  try {
    const { data: salesCitiesData, error: salesCitiesError } = await supabase
      .from('sale_view') // Only query sales view for cities
      .select('city');
    
    if (salesCitiesError) throw salesCitiesError;

    if (salesCitiesData) {
      salesCities = [
        ...new Set(
          salesCitiesData
            .map(item => item.city)
            .filter(city => typeof city === 'string' && city.trim() !== '') as string[]
        )
      ].sort();
    }
  } catch (e: any) {
    const errorMsg = `Failed to fetch cities from sale_view: ${e.message}. This view is required for the BPL Sales city filter. Please ensure it exists and RLS policies allow access.`;
    console.error(errorMsg);
    return { cities: [], error: errorMsg };
  }

  if (salesCities.length === 0) {
    // It's possible no cities are found, which isn't an error itself if the view is empty or no cities are assigned.
    // An error message here might be too strong if the view is simply empty.
    console.warn("No distinct cities found in 'sale_view'. The city filter in BPL Sales will be empty or show only 'Pan India'.");
  }

  return { cities: salesCities, error: null };
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


export async function fetchSalesLeaderboardData(
  cityFilter: string,
  role: SalesLeaderboardRole
): Promise<{ data: SalesLeaderboardEntry[]; error: string | null }> {
  if (!supabase) {
    const errorMsg = "Supabase client is not initialized. Cannot fetch sales leaderboard data.";
    console.error(errorMsg);
    return { data: [], error: errorMsg };
  }

  const { data: rawData, error: supabaseError } = await supabase
    .from('sale_view')
    .select<string, RawSalesLeaderboardData>('*')
    .order('record_date', { ascending: false });

  if (supabaseError) {
    let errorMessage = `Error fetching sales leaderboard data.`;
     if (typeof supabaseError === 'object' && supabaseError !== null) {
        if (Object.keys(supabaseError).length === 0) {
            errorMessage = `Error fetching sales leaderboard data: Supabase returned an empty error. This often means Row Level Security (RLS) policies are blocking access, or the 'sale_view' does not exist or is empty. Please verify the view and RLS policies in your Supabase dashboard.`;
        } else if ('message' in supabaseError && typeof supabaseError.message === 'string') {
            const lowerMsg = supabaseError.message.toLowerCase();
            if (lowerMsg.includes('relation') && lowerMsg.includes('does not exist')) {
              errorMessage = `DATABASE SETUP ERROR: The required database view "public.sale_view" could not be found. Please ensure this view is created in your Supabase SQL Editor. Original error: "${supabaseError.message}"`;
            } else if (lowerMsg.includes('column') && lowerMsg.includes('does not exist')) {
              const missingColumnMatch = supabaseError.message.match(/column "(.+?)" does not exist/i) || supabaseError.message.match(/column ([a-zA-Z0-9_]+) of relation "sale_view" does not exist/i);
              const missingColumn = missingColumnMatch ? (missingColumnMatch[1] || missingColumnMatch[2]) : "unknown";
              errorMessage = `DATABASE VIEW MISMATCH: A required column (e.g., '${missingColumn}') is missing from or incorrect in "public.sale_view". Please verify your view definition. Original error: "${supabaseError.message}"`;
            } else {
              errorMessage = `Supabase error: ${supabaseError.message}. Check view definition and RLS policies.`;
            }
        } else {
            try {
                errorMessage = `Error fetching sales leaderboard data: ${JSON.stringify(supabaseError)}`;
            } catch {
                errorMessage = `Error fetching sales leaderboard data: Non-serializable error object from Supabase.`;
            }
        }
    }
    console.error(`Error details from Supabase (fetchSalesLeaderboardData for ${role} in ${cityFilter}):`, supabaseError);
    console.error(errorMessage);
    return { data: [], error: errorMessage };
  }

  if (!rawData || rawData.length === 0) {
    return { data: [], error: null };
  }
  
  // Filter data based on role and city after fetching
  const filteredRawData = rawData.filter(item => {
    const roleMatch = item.role === role;
    const cityMatch = cityFilter === 'Pan India' || cityFilter === '' || item.city === cityFilter;
    return roleMatch && cityMatch;
  });

  const latestEntriesMap = new Map<string, RawSalesLeaderboardData>();

  for (const item of filteredRawData) {
    const participantKey = `${item.name}-${item.role}-${item.city || 'GLOBAL_CITY'}-${item.manager_name || 'NO_MANAGER'}`;
    if (!latestEntriesMap.has(participantKey)) {
      latestEntriesMap.set(participantKey, item);
    }
  }

  const uniqueLatestData = Array.from(latestEntriesMap.values());

  const processedData: SalesLeaderboardEntry[] = uniqueLatestData
    .map(item => ({
      name: item.name,
      manager_name: item.manager_name || undefined,
      city: item.city,
      role: item.role as SalesLeaderboardRole, 
      total_runs: item.cumulative_score, 
      record_date: item.record_date,
      rank: 0, 
    }))
    .sort((a, b) => b.total_runs - a.total_runs)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

  return { data: processedData, error: null };
}


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
