// src/lib/supabase.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { ProjectPerformanceData, LeaderboardEntry, LeaderboardRole } from '@/types/database';

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
  if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
    console.warn("Supabase URL is not defined or invalid. Please check your .env file for NEXT_PUBLIC_SUPABASE_URL.");
  }
  if (!supabaseAnonKey) {
    console.warn("Supabase Anon Key is not defined. Please check your .env file for NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }
}

export const supabase = supabaseInstance;

export async function fetchCities(): Promise<string[]> {
  if (!supabase) {
    console.error("Supabase client is not initialized for fetchCities.");
    return [];
  }
  const { data, error } = await supabase
    .from('project_performance_view')
    .select('city', { count: 'exact', head: false });

  if (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
  // Get unique, non-null cities
  return [...new Set(data?.map(item => item.city).filter(Boolean) as string[])].sort();
}


export async function fetchProjectData(
  city: string, // 'Pan India' or specific city
  role: LeaderboardRole
): Promise<LeaderboardEntry[]> {
  if (!supabase) {
    console.error("Supabase client is not initialized for fetchProjectData.");
    return [];
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

  const { data: rawData, error } = await query;

  if (error) {
    console.error('Error fetching project performance data:', error);
    return [];
  }

  if (!rawData) {
    return [];
  }

  const aggregatedData: Record<string, {
    name: string;
    city: string | null;
    project_crns: Set<string>;
    total_cumulative_score: number;
    total_score_change: number;
    statuses: string[];
    // Add fields for CSAT and delay days if needed for aggregation
  }> = {};

  rawData.forEach(item => {
    let keyName: string | null = null;
    let personCity = item.city;

    if (role === 'SPM' && item.spm_name) keyName = item.spm_name;
    else if (role === 'TL' && item.tl_name) keyName = item.tl_name;
    else if (role === 'OM') {
      // OM logic: For example, if OMs are also in tl_name or spm_name with a specific identifier,
      // or if OM is an aggregation of an entire city or multiple TLs.
      // This part needs clarification based on how OMs are represented in the data.
      // As a placeholder, let's assume OMs might be represented in tl_name for certain entries.
      // Or, if an OM's performance is the sum of all projects in their city:
      keyName = item.city ? `OM-${item.city}` : null; // Example: OM for a city
      personCity = item.city; // Group by city for OM
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
      let overallStatus: LeaderboardEntry['status'] = 'Green'; // Default
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
        rank: 0, // Rank will be assigned after sorting
      };
    })
    .sort((a, b) => b.runs - a.runs)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

  return leaderboard;
}
