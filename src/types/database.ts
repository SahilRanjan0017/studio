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

// Represents the structure of data from 'project_performance_view'
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


// Types for BPL Sales Leaderboard based on the new sales_team_performance_view
export type SalesLeaderboardRole = 'OS' | 'IS' | 'CP_OS' | 'CP_IS';

// Raw data structure from the new sales_team_performance_view
export interface RawSalesLeaderboardData {
  name: string;
  role: SalesLeaderboardRole;
  manager_name: string | null;
  city: string | null;
  record_date: string; // Date of the record
  cumulative_score: number; // This will be used as total_runs
  // daily_score is also available if needed: sum(sales_score_tracking.score_change)
}

// Processed entry for display in the sales leaderboard
export interface SalesLeaderboardEntry {
  rank: number;
  name: string;
  manager_name?: string;
  city: string | null;
  role: SalesLeaderboardRole;
  total_runs: number; // Mapped from cumulative_score
  record_date?: string; // Optional: if we want to display the date of the score
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
