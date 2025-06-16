
// src/types/database.ts

export interface ProjectScore {
  crn_id: string;
  city: string | null;
  tl_name: string | null;
  spm_name: string | null;
  avg_bnb_csat: number | null;
  total_delay_days: number | null;
  rag_profile: string | null;
  project_type: string | null;
  record_date: string; // DATE as string e.g., "YYYY-MM-DD"
}

export interface ScoreTracking {
  id: number;
  crn_id: string;
  score_date: string; // DATE as string e.g., "YYYY-MM-DD"
  prev_rag_status: string | null;
  current_rag_status: string;
  score_change: number;
  cumulative_score: number;
  created_at?: string; // TIMESTAMPTZ as string
}

// Represents the structure of data from 'project_performance_view' (for BPL Ops)
export interface ProjectPerformanceData {
  crn_id: string;
  city: string | null;
  tl_name: string | null;
  spm_name: string | null;
  avg_bnb_csat: number | null;
  total_delay_days: number | null;
  rag_profile: string | null;
  project_type: string | null;
  record_date: string;
  prev_rag_status: string | null;
  current_rag_status: string;
  score_change: number;
  cumulative_score: number;
}

// Represents an entry in the displayed leaderboard for BPL Operations
export interface LeaderboardEntry {
  rank: number;
  name: string; // SPM name, TL name, etc.
  city: string | null;
  projects: number; // Count of projects
  status: 'Green' | 'Amber' | 'Red' | string; // Overall status
  runs: number; // Typically cumulative_score
  trend: number; // score_change indicating trend
  avg_csat?: number | null;
  total_delay_days_sum?: number | null;
}

export type LeaderboardRole = 'SPM' | 'TL' | 'OM';


// Types for BPL Sales Leaderboard based on the user-provided sales_team_performance_view
export type SalesLeaderboardRole = 'OS' | 'IS' | 'CP_OS' | 'CP_IS';

// Raw data structure from the sales_team_performance_view.
// This must exactly match the columns output by your SQL view.
export interface RawSalesLeaderboardData {
  name: string;
  role: SalesLeaderboardRole; 
  manager_name: string | null;
  city: string | null;
  record_date: string; 
  daily_score: number; // Sum of score_change for that day
  cumulative_score: number; // Max cumulative_score up to that day
}

// Processed entry for display in the sales leaderboard (Individual/Staff View)
export interface SalesLeaderboardEntry {
  rank: number;
  name: string;
  manager_name?: string; 
  city: string | null;
  role: SalesLeaderboardRole;
  total_runs: number; // This will be the latest cumulative_score for the participant    
  record_date: string; 
}

// Processed entry for Manager Level View
export interface ManagerLeaderboardEntry {
  rank: number;
  name: string; // Manager's Name
  city: string; // Derived: Manager's primary city or "Multiple Cities"
  total_runs: number;
}

// Processed entry for City Level View (and CityManagerDetail view)
export interface CityLeaderboardEntry {
  rank: number;
  name: string; // City Name
  top_manager_name?: string; // Optional: For the CityManagerDetail view
  total_runs: number;
}


// Structure for raw data from channel_partner_performance_view (Initial version, might be superseded by SalesLeaderboard)
export interface RawChannelPartnerData {
  partner_id: string;
  partner_name: string;
  city: string | null;
  leads_generated: number;
  successful_conversions: number;
  total_score: number;
}

// Structure for processed channel partner entries to be displayed (Initial version)
export interface ChannelPartnerEntry {
  partner_id: string;
  partner_name: string;
  city: string | null;
  leads_generated: number;
  successful_conversions: number;
  conversion_rate: number;
  total_score: number;
  rank: number;
}
