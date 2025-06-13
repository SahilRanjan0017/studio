// src/components/bpl-sales/sales-leaderboard-table.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Search, Loader2, AlertCircle, TrendingUp, TrendingDownIcon, Minus, Target, Zap, Briefcase } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchSalesLeaderboardData, supabase } from '@/lib/supabase'; // Updated to fetchSalesLeaderboardData
import type { SalesLeaderboardEntry, SalesLeaderboardRole } from '@/types/database'; // Updated types
import { useCityFilter } from '@/contexts/CityFilterContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const salesRoleConfig: Record<SalesLeaderboardRole, { icon: React.ReactNode; label: string }> = {
  'OS': { icon: <Target size={14} />, label: "OS" },
  'IS': { icon: <Zap size={14} />, label: "IS" },
  'CP_OS': { icon: <Users size={14} />, label: "CP OS" },
  'CP_IS': { icon: <Briefcase size={14} />, label: "CP IS" },
};

export function SalesLeaderboardTable() {
  const [activeRole, setActiveRole] = useState<SalesLeaderboardRole>('OS');
  const [data, setData] = useState<SalesLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { selectedCity, loadingCities: loadingGlobalCities, cityError: globalCityError } = useCityFilter();
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      if (!supabase) {
        setError("Supabase client not initialized. Check .env variables.");
        setLoading(false);
        return;
      }
      
      if (loadingGlobalCities) {
        setLoading(true); 
        return;
      }
      if (globalCityError) {
         setError(`Cannot load data: Error with city filter (${globalCityError}).`);
         setData([]);
         setLoading(false);
         return;
      }

      setLoading(true);
      setError(null);
      
      // Fetch data for the currently active sales role
      const result = await fetchSalesLeaderboardData(selectedCity, activeRole);

      if (result.error) {
        console.error(`Failed to fetch Sales Leaderboard data for role ${activeRole} in ${selectedCity}:`, result.error);
        toast({
            title: `Error Fetching ${salesRoleConfig[activeRole].label} Data`,
            description: result.error,
            variant: "destructive",
        });
        setError(result.error);
        setData([]);
      } else {
        setData(result.data);
      }
      setLoading(false);
    }
    loadData();
  }, [activeRole, selectedCity, loadingGlobalCities, globalCityError, toast]);

  const getInitials = (name: string) => {
    if (!name) return 'N/A';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(entry =>
      entry.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const displayName = useMemo(() => {
    const roleLabel = salesRoleConfig[activeRole].label;
    if (selectedCity === "Pan India") {
      return `Displaying ${roleLabel} rankings for Pan India.`;
    }
    return `Displaying ${roleLabel} rankings for ${selectedCity}.`;
  }, [activeRole, selectedCity]);

  const TrendIcon = ({ trend }: { trend?: number }) => {
    if (trend === undefined) return null;
    if (trend > 0) return <TrendingUp size={16} className="text-custom-green" />;
    if (trend < 0) return <TrendingDownIcon size={16} className="text-primary" />;
    return <Minus size={16} className="text-muted-foreground" />;
  };

  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader className="border-b border-border/70 pb-3.5">
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2.5">
                <Users size={24} className="text-primary" />
                <div>
                    <CardTitle className="text-lg font-semibold text-foreground">BPL Sales Leaderboard</CardTitle>
                    <p className="text-xs text-muted-foreground">{displayName}</p>
                </div>
            </div>
            <div className="w-full sm:w-auto flex flex-col md:flex-row items-center gap-2">
                <div className="relative w-full md:w-56 lg:w-64">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                    type="search"
                    placeholder={`Search ${salesRoleConfig[activeRole].label} name...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-full h-9"
                    />
                </div>
                <Tabs value={activeRole} onValueChange={(value) => setActiveRole(value as SalesLeaderboardRole)} className="w-full md:w-auto">
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-9 bg-muted/70">
                        {(Object.keys(salesRoleConfig) as SalesLeaderboardRole[]).map(roleKey => (
                        <TabsTrigger 
                            key={roleKey} 
                            value={roleKey} 
                            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 text-xs data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm"
                        >
                            {React.cloneElement(salesRoleConfig[roleKey].icon, { className: "hidden sm:inline" })}
                            {salesRoleConfig[roleKey].label}
                        </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 px-2 sm:px-4">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-1.5">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="space-y-1.5 flex-grow">
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-2.5 w-1/2" />
                </div>
                <Skeleton className="h-7 w-14 rounded-md" />
                <Skeleton className="h-7 w-10 rounded-md" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center text-destructive py-8 text-sm bg-destructive/10 border border-destructive/30 rounded-md p-2.5">
            <AlertCircle size={28} className="mb-1.5" />
            <p className="text-center font-medium">Failed to load data</p>
            <p className="text-center text-xs mt-1">{error}</p>
            <p className="text-center text-xs mt-2">Please ensure the 'sales_team_performance_view' exists and is correctly configured in Supabase for the role '{salesRoleConfig[activeRole].label}'.</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            {searchTerm
              ? `No ${salesRoleConfig[activeRole].label} found matching "${searchTerm}".`
              : `No data available for ${salesRoleConfig[activeRole].label} in ${selectedCity === "Pan India" ? "Pan India" : selectedCity}.`}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/70">
                  <TableHead className="w-[50px] text-center text-xs font-semibold text-foreground px-2">Rank</TableHead>
                  <TableHead className="text-xs font-semibold text-foreground px-2 min-w-[150px]">Name</TableHead>
                  <TableHead className="hidden md:table-cell text-xs font-semibold text-foreground px-2">City</TableHead>
                  <TableHead className="text-center text-xs font-semibold text-foreground px-2">KPIs Count</TableHead>
                  <TableHead className="text-center text-xs font-semibold text-foreground px-2 hidden sm:table-cell">Last Update</TableHead>
                  <TableHead className="text-right text-xs font-semibold text-foreground px-2">Total Runs</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((entry) => (
                  <TableRow key={entry.participant_id} className="hover:bg-muted/50 transition-colors duration-150">
                    <TableCell className="text-center px-2 py-2.5">
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center font-semibold text-white text-[0.6rem] mx-auto",
                        entry.rank <= 3 ? "bg-accent" : "bg-primary/80"
                      )}>
                        {entry.rank}
                      </div>
                    </TableCell>
                    <TableCell className="px-2 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-muted text-muted-foreground font-semibold text-[0.65rem]">
                            {getInitials(entry.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-foreground text-sm leading-tight">{entry.name}</div>
                           <div className="text-xs text-muted-foreground leading-tight">{salesRoleConfig[entry.role].label}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground px-2 py-2.5">{entry.city || 'N/A'}</TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground px-2 py-2.5">{entry.kpi_types_count ?? 'N/A'}</TableCell>
                    <TableCell className="text-center text-xs text-muted-foreground px-2 py-2.5 hidden sm:table-cell">{entry.last_update_formatted || 'N/A'}</TableCell>
                    <TableCell className="text-right font-bold text-sm text-foreground px-2 py-2.5">{entry.total_runs}</TableCell>
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
