// src/components/bpl-sales/sales-leaderboard-table.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Search, Loader2, AlertCircle, TrendingUp, TrendingDownIcon, Minus, Target, Zap, Briefcase, UserCircle2, MapPin } from 'lucide-react';
import { fetchSalesLeaderboardData, supabase } from '@/lib/supabase';
import type { SalesLeaderboardEntry, SalesLeaderboardRole } from '@/types/database';
import { useCityFilter } from '@/contexts/CityFilterContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const salesRoleConfig: Record<SalesLeaderboardRole, { icon: React.ReactNode; label: string; fullTitle: string }> = {
  'OS': { icon: <Target size={20} />, label: "OS", fullTitle: "OS Performance" },
  'IS': { icon: <Zap size={20} />, label: "IS", fullTitle: "IS Performance" },
  'CP_OS': { icon: <Users size={20} />, label: "CP OS", fullTitle: "CP OS Performance" },
  'CP_IS': { icon: <Briefcase size={20} />, label: "CP IS", fullTitle: "CP IS Performance" },
};

interface SalesLeaderboardTableProps {
  tableForRole: SalesLeaderboardRole;
}

export function SalesLeaderboardTable({ tableForRole }: SalesLeaderboardTableProps) {
  const [data, setData] = useState<SalesLeaderboardEntry[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { 
    selectedCity, 
    setSelectedCity, 
    availableCities, 
    loadingCities: loadingGlobalCities, 
    cityError: globalCityError 
  } = useCityFilter();
  const { toast } = useToast();

  const currentRoleConfig = salesRoleConfig[tableForRole];

  useEffect(() => {
    async function loadData() {
      if (!supabase) {
        setError("Supabase client not initialized. Check .env variables.");
        setLoadingData(false);
        return;
      }
      
      if (loadingGlobalCities) {
        setLoadingData(true); 
        return;
      }
      if (globalCityError) {
         setError(`Cannot load data: Error with city filter (${globalCityError}).`);
         setData([]);
         setLoadingData(false);
         return;
      }

      setLoadingData(true);
      setError(null);
      
      const result = await fetchSalesLeaderboardData(selectedCity, tableForRole);

      if (result.error) {
        console.error(`Failed to fetch Sales Leaderboard data for role ${tableForRole} in ${selectedCity}:`, result.error);
        toast({
            title: `Error Fetching ${currentRoleConfig.label} Data`,
            description: result.error,
            variant: "destructive",
        });
        setError(result.error);
        setData([]);
      } else {
        setData(result.data);
      }
      setLoadingData(false);
    }
    loadData();
  }, [tableForRole, selectedCity, loadingGlobalCities, globalCityError, toast, currentRoleConfig.label]);

  const getInitials = (name: string) => {
    if (!name) return 'N/A';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(entry =>
      entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.manager_name && entry.manager_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [data, searchTerm]);

  const cityDisplayName = selectedCity === "Pan India" ? "Pan India" : selectedCity;

  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader className="border-b border-border/70 pb-4">
         <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
                {React.cloneElement(currentRoleConfig.icon, { className: "text-primary h-6 w-6" })} 
                <div>
                    <CardTitle className="text-lg font-semibold text-foreground">{currentRoleConfig.fullTitle}</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground mt-0.5">
                      Role: {currentRoleConfig.label}
                    </CardDescription>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <label htmlFor={`city-filter-sales-${tableForRole}`} className="text-sm font-medium text-foreground whitespace-nowrap sr-only md:not-sr-only">
                    <MapPin size={16} className="inline-block mr-1 text-muted-foreground" /> City:
                  </label>
                  <Select 
                    value={selectedCity} 
                    onValueChange={setSelectedCity}
                    disabled={loadingGlobalCities || !!globalCityError}
                  >
                    <SelectTrigger 
                      id={`city-filter-sales-${tableForRole}`}
                      className="w-full sm:w-[180px] bg-background h-9 text-sm focus:ring-primary/50"
                      aria-label="City filter for sales dashboard"
                    >
                      {loadingGlobalCities ? (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                          <span>Loading...</span>
                        </div>
                      ) : globalCityError ? (
                         <span className="text-destructive text-xs">Error</span>
                      ) : (
                        <SelectValue placeholder="Select City" />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {!loadingGlobalCities && !globalCityError && (
                        <>
                          <SelectItem value="Pan India">Pan India</SelectItem>
                          {availableCities.map((city, index) => (
                            <SelectItem key={index} value={city}>{city}</SelectItem>
                          ))}
                        </>
                      )}
                       {globalCityError && <SelectItem value="Error" disabled>Error loading cities</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative w-full sm:flex-grow">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder={`Search by name or manager...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-full h-9"
                    />
                </div>
            </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 px-2 sm:px-4">
        {loadingData ? (
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
            <p className="text-center font-medium">Failed to load data for {currentRoleConfig.label}</p>
            <p className="text-center text-xs mt-1">{error}</p>
            <p className="text-center text-xs mt-2">Please ensure the 'sales_team_performance_view' exists, includes a 'manager_name' column, and is correctly configured in Supabase. Also, check RLS policies.</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            {searchTerm
              ? `No ${currentRoleConfig.label} found matching "${searchTerm}" in ${cityDisplayName}.`
              : `No data available for ${currentRoleConfig.label} in ${cityDisplayName}.`}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/70">
                  <TableHead className="w-[50px] text-center text-xs font-semibold text-foreground px-2">Rank</TableHead>
                  <TableHead className="text-xs font-semibold text-foreground px-2 min-w-[180px]">Name / Role</TableHead>
                  <TableHead className="text-xs font-semibold text-foreground px-2 min-w-[150px] hidden md:table-cell">Manager</TableHead>
                  <TableHead className="text-xs font-semibold text-foreground px-2 hidden lg:table-cell">City</TableHead>
                  <TableHead className="text-center text-xs font-semibold text-foreground px-2 hidden sm:table-cell">KPIs Count</TableHead>
                  <TableHead className="text-center text-xs font-semibold text-foreground px-2 hidden md:table-cell">Last Update</TableHead>
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
                    <TableCell className="text-xs text-muted-foreground px-2 py-2.5 hidden md:table-cell">
                      {entry.manager_name || 'N/A'}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground px-2 py-2.5 hidden lg:table-cell">{entry.city || 'N/A'}</TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground px-2 py-2.5 hidden sm:table-cell">{entry.kpi_types_count ?? 'N/A'}</TableCell>
                    <TableCell className="text-center text-xs text-muted-foreground px-2 py-2.5 hidden md:table-cell">{entry.last_update_formatted || 'N/A'}</TableCell>
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
