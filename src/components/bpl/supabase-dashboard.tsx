
// @/components/bpl/supabase-dashboard.tsx
'use client';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import React, { useState, useEffect, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Ensure you have your Supabase URL and Anon Key in your .env.local or .env file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabaseInstance: SupabaseClient | null | undefined = undefined; // undefined: not initialized, null: initialization failed, SupabaseClient: success

function getSupabaseClient(): SupabaseClient | null {
  if (supabaseInstance !== undefined) {
    return supabaseInstance;
  }

  if (supabaseUrl && supabaseAnonKey && typeof supabaseUrl === 'string' && supabaseUrl.trim() !== '' && typeof supabaseAnonKey === 'string' && supabaseAnonKey.trim() !== '') {
    if (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://')) {
      try {
        supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
      } catch (e) {
        console.error('Failed to create Supabase client during lazy initialization:', e);
        supabaseInstance = null;
      }
    } else {
      console.warn(`Invalid Supabase URL format during lazy initialization: "${supabaseUrl}". Must start with http:// or https://.`);
      supabaseInstance = null;
    }
  } else {
    console.warn("Supabase URL or Anon Key is not defined or is empty for lazy initialization. Please check your .env file for NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
    supabaseInstance = null;
  }
  return supabaseInstance;
}

interface PerformanceData {
  crn_id: string;
  city: string;
  tl_name: string;
  spm_name: string;
  avg_bnb_csat: number | null;
  total_delay_days: number | null;
  rag_profile: string | null;
  project_type: string | null;
  record_date: string | null;
  prev_rag_status: string | null;
  current_rag_status: string | null;
  score_change: number | null;
  cumulative_score: number | null;
}

export function SupabaseDashboard() {
  const supabase = useMemo(() => getSupabaseClient(), []);

  const [city, setCity] = useState<string>('');
  const [tlName, setTlName] = useState<string>('');
  const [spmName, setSpmName] = useState<string>('');
  const [data, setData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [availableTLs, setAvailableTLs] = useState<string[]>([]);
  const [availableSPMs, setAvailableSPMs] = useState<string[]>([]);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }
      try {
        const { data: citiesData, error: citiesError } = await supabase
          .from('project_performance_view')
          .select('city'); 
        if (citiesError) throw citiesError;
        setAvailableCities([...new Set(citiesData?.map(item => item.city).filter(Boolean) as string[])].sort());

        const { data: tlsData, error: tlsError } = await supabase
          .from('project_performance_view')
          .select('tl_name'); 
        if (tlsError) throw tlsError;
        setAvailableTLs([...new Set(tlsData?.map(item => item.tl_name).filter(Boolean) as string[])].sort());

        const { data: spmsData, error: spmsError } = await supabase
          .from('project_performance_view')
          .select('spm_name'); 
        if (spmsError) throw spmsError;
        setAvailableSPMs([...new Set(spmsData?.map(item => item.spm_name).filter(Boolean) as string[])].sort());

      } catch (e: any) {
        console.error('Error fetching filter options:', e);
        setError('Failed to load filter options. Please ensure the view "project_performance_view" exists and is accessible.');
      }
    };
    
    if (supabase) {
      fetchFilterOptions();
    }
  }, [supabase]);

  useEffect(() => {
    const fetchData = async () => {
      if (!supabase) {
        // Error state will be handled by the main return block
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        let query = supabase
          .from('project_performance_view')
          .select('*');

        if (city) {
          query = query.eq('city', city);
        }
        if (tlName) {
          query = query.eq('tl_name', tlName);
        }
        if (spmName) {
          query = query.eq('spm_name', spmName);
        }
        
        query = query.order('record_date', { ascending: false })
                     .order('cumulative_score', { ascending: false, nullsFirst: false });

        const { data: resultData, error: queryError } = await query;

        if (queryError) {
          throw queryError;
        }
        setData(resultData || []);
      } catch (e: any) {
        console.error('Error fetching data:', e);
        setData([]);
        setError(`Failed to fetch data: ${e.message}. Please ensure the view "project_performance_view" exists and is accessible.`);
      } finally {
        setLoading(false);
      }
    };

    if (supabase) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [city, tlName, spmName, supabase]);

  if (!supabase) {
     return (
      <Card className="mt-8 shadow-xl animate-fadeInUp">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-primary">Supabase Configuration Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Supabase client could not be initialized. Please check your environment variables (<code>.env</code> file) for <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.</p>
          <p className="text-sm text-muted-foreground mt-2">Ensure the URL is valid (starts with 'http://' or 'https://') and the key is not empty. The application may not function correctly until this is resolved.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl animate-fadeInUp my-8">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary">Project Performance Dashboard (Supabase)</CardTitle>
        <p className="text-sm text-muted-foreground">
          Data sourced from Supabase view: <code>project_performance_view</code>. Ensure the view is created in your Supabase project.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 border rounded-md bg-muted/50">
          <div>
            <label htmlFor="city-filter-sb" className="block text-sm font-medium text-foreground mb-1">Filter by City:</label>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger id="city-filter-sb" className="w-full bg-card">
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Cities</SelectItem>
                {availableCities.map((c, index) => (
                  <SelectItem key={index} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="tl-filter-sb" className="block text-sm font-medium text-foreground mb-1">Filter by TL Name:</label>
             <Select value={tlName} onValueChange={setTlName}>
              <SelectTrigger id="tl-filter-sb" className="w-full bg-card">
                <SelectValue placeholder="All TLs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All TLs</SelectItem>
                {availableTLs.map((tl, index) => (
                  <SelectItem key={index} value={tl}>{tl}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="spm-filter-sb" className="block text-sm font-medium text-foreground mb-1">Filter by SPM Name:</label>
            <Select value={spmName} onValueChange={setSpmName}>
              <SelectTrigger id="spm-filter-sb" className="w-full bg-card">
                <SelectValue placeholder="All SPMs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All SPMs</SelectItem>
                {availableSPMs.map((spm, index) => (
                  <SelectItem key={index} value={spm}>{spm}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading && <p className="text-center text-primary py-4">Loading data...</p>}
        {error && <p className="text-center text-destructive p-4 border border-destructive rounded-md bg-destructive/10">{error}</p>}
        
        {!loading && !error && data.length === 0 && (
          <p className="text-center text-muted-foreground py-4">No data available for the selected filters.</p>
        )}

        {!loading && !error && data.length > 0 && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CRN ID</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>TL Name</TableHead>
                  <TableHead>SPM Name</TableHead>
                  <TableHead>RAG Profile</TableHead>
                  <TableHead className="text-right">Avg CSAT</TableHead>
                  <TableHead className="text-right">Total Delay (Days)</TableHead>
                  <TableHead>Prev RAG</TableHead>
                  <TableHead>Current RAG</TableHead>
                  <TableHead className="text-right">Score Change</TableHead>
                  <TableHead className="text-right">Cumulative Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={row.crn_id || index}>
                    <TableCell className="font-medium">{row.crn_id}</TableCell>
                    <TableCell>{row.city}</TableCell>
                    <TableCell>{row.tl_name}</TableCell>
                    <TableCell>{row.spm_name}</TableCell>
                    <TableCell>{row.rag_profile}</TableCell>
                    <TableCell className="text-right">{row.avg_bnb_csat !== null ? Number(row.avg_bnb_csat).toFixed(2) : 'N/A'}</TableCell>
                    <TableCell className="text-right">{row.total_delay_days !== null ? row.total_delay_days : 'N/A'}</TableCell>
                    <TableCell>{row.prev_rag_status}</TableCell>
                    <TableCell>{row.current_rag_status}</TableCell>
                    <TableCell className="text-right">{row.score_change !== null ? row.score_change : 'N/A'}</TableCell>
                    <TableCell className="text-right">{row.cumulative_score !== null ? row.cumulative_score : 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

