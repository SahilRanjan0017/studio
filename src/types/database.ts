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

// Represents an entry in the displayed leaderboard
export interface LeaderboardEntry {
  rank: number;
  name: string; // SPM name, TL name, etc.
  city: string | null;
  projects: number; // Count of projects
  status: 'Green' | 'Amber' | 'Red' | string; // Overall status
  runs: number; // Typically cumulative_score
  trend: number; // score_change indicating trend
  // Optional: for tooltips or detailed views
  avg_csat?: number | null;
  total_delay_days_sum?: number | null;
}

export type LeaderboardRole = 'SPM' | 'TL' | 'OM';

// Structure for raw data from channel_partner_performance_view
export interface RawChannelPartnerData {
  partner_id: string;
  partner_name: string;
  city: string | null;
  leads_generated: number;
  successful_conversions: number;
  total_score: number;
}

// Structure for processed channel partner entries to be displayed
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
