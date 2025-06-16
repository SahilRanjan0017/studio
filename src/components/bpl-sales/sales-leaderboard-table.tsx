// src/components/bpl-sales/sales-leaderboard-table.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Search, AlertCircle, Target, Zap, Briefcase, UserSquare, Building, UserCheck, ListTree } from 'lucide-react';
import { fetchSalesLeaderboardData, supabase } from '@/lib/supabase';
import type { SalesLeaderboardEntry, SalesLeaderboardRole } from '@/types/database';
import { useCityFilter } from '@/contexts/CityFilterContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  'CP_OS': { icon: <UserCheck size={20} />, label: "CP OS", fullTitle: "CP OS Performance" }, // Updated Icon
  'CP_IS': { icon: <Briefcase size={20} />, label: "CP IS", fullTitle: "CP IS Performance" },
};

type SubView = 'Individual' | 'ManagerLevel' | 'CityLevel';

interface SalesLeaderboardTableProps {
  tableForRole: SalesLeaderboardRole;
}

export function SalesLeaderboardTable({ tableForRole }: SalesLeaderboardTableProps) {
  const [individualData, setIndividualData] = useState<SalesLeaderboardEntry[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubView, setActiveSubView] = useState<SubView>('Individual');
  
  const { 
    selectedCity, 
    loadingCities: loadingGlobalCities, 
    cityError: globalCityError 
  } = useCityFilter();
  const { toast } = useToast();

  const currentRoleConfig = salesRoleConfig[tableForRole];
  const cityDisplayName = selectedCity === "Pan India" ? "Pan India" : selectedCity;

  useEffect(() => {
    async function loadIndividualData() {
      if (!supabase) {
        setError("Supabase client not initialized. Check environment variables.");
        setLoadingData(false);
        return;
      }
      
      if (loadingGlobalCities) {
        setLoadingData(true); 
        return;
      }
      if (globalCityError) {
         setError(`Cannot load data: Error with city filter (${globalCityError}).`);
         setIndividualData([]);
         setLoadingData(false);
         return;
      }

      setLoadingData(true);
      setError(null);
      
      // Pass selectedCity from context to the fetch function
      const result = await fetchSalesLeaderboardData(selectedCity, tableForRole);

      if (result.error) {
        console.error(`Failed to fetch Sales Leaderboard data for role ${tableForRole} in ${selectedCity}:`, result.error);
        toast({
            title: `Error Fetching ${currentRoleConfig.label} Data`,
            description: result.error, 
            variant: "destructive",
        });
        setError(result.error); 
        setIndividualData([]);
      } else {
        setIndividualData(result.data);
      }
      setLoadingData(false);
    }

    if (activeSubView === 'Individual') {
      loadIndividualData();
    } else { // For ManagerLevel and CityLevel, which are placeholders
      setIndividualData([]); 
      setLoadingData(false); 
      const viewName = activeSubView === 'ManagerLevel' ? 'Manager Level' : 'City Level';
      setError(`${viewName} view for ${currentRoleConfig.label} is not yet implemented. This requires a specific database view for aggregation.`);
    }
  }, [tableForRole, selectedCity, loadingGlobalCities, globalCityError, toast, currentRoleConfig.label, activeSubView]);

  const getInitials = (name: string) => {
    if (!name) return 'N/A';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Sub-view tabs configuration dynamically using currentRoleConfig.label
  const subViewTabs = [
    { value: 'Individual', label: `${currentRoleConfig.label}`, icon: <UserSquare size={16} /> },
    { value: 'ManagerLevel', label: `${currentRoleConfig.label} Managers`, icon: <Users size={16} /> },
    { value: 'CityLevel', label: `City Rank (${currentRoleConfig.label})`, icon: <Building size={16} /> },
  ];
  
  const selectedSubViewConfig = subViewTabs.find(tab => tab.value === activeSubView);

  const filteredIndividualData = useMemo(() => {
    if (!searchTerm || activeSubView !== 'Individual') return individualData;
    return individualData.filter(entry =>
      entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.manager_name && entry.manager_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [individualData, searchTerm, activeSubView]);


  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader className="border-b border-border/70 pb-4">
         <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
                {React.cloneElement(currentRoleConfig.icon, { className: "text-primary h-7 w-7" })} 
                <div>
                    <CardTitle className="text-lg font-semibold text-foreground">{currentRoleConfig.fullTitle}</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground mt-0.5">
                       Role: {currentRoleConfig.label} | City: {cityDisplayName} {/* City display confirmed removed */}
                    </CardDescription>
                </div>
            </div>
            <div className="relative w-full sm:flex-grow">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={`Search by name or manager...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full h-9"
                  disabled={activeSubView !== 'Individual'}
                />
            </div>

            <div className="w-full mt-2">
              <div className="sm:hidden">
                <Select
                  value={activeSubView}
                  onValueChange={(value) => setActiveSubView(value as SubView)}
                >
                  <SelectTrigger className="w-full h-9 text-xs">
                     <div className="flex items-center gap-2">
                        {selectedSubViewConfig && React.cloneElement(selectedSubViewConfig.icon, {className: "h-4 w-4"})}
                        <SelectValue placeholder="Select view..." />
                     </div>
                  </SelectTrigger>
                  <SelectContent>
                    {subViewTabs.map((tab) => (
                      <SelectItem key={tab.value} value={tab.value} className="text-xs">
                        <div className="flex items-center gap-2">
                          {React.cloneElement(tab.icon, {className: "h-4 w-4"})}
                          <span>{tab.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Tabs
                value={activeSubView}
                onValueChange={(value) => setActiveSubView(value as SubView)}
                className="hidden sm:block w-full"
              >
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto sm:h-9">
                  {subViewTabs.map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value} className="text-xs sm:text-sm px-2 py-1.5 sm:py-1 flex items-center gap-1.5 whitespace-normal sm:whitespace-nowrap h-full">
                      {React.cloneElement(tab.icon, { className: "hidden sm:inline-block"})}
                      <span>{tab.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
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
          <div className="flex flex-col items-center justify-center text-destructive py-8 text-sm bg-destructive/10 border border-destructive/30 rounded-md p-3 space-y-2">
            <AlertCircle size={28} className="mb-1.5" />
            <p className="text-center font-semibold">Failed to load data for {currentRoleConfig.label}</p>
            <p className="text-center text-xs text-destructive/80">
              {error.includes("relation \"public.sales_team_performance_view\" does not exist") 
                ? "The required database view 'public.sales_team_performance_view' does not exist. Please create it in your Supabase SQL Editor using the provided schema."
                : error.includes("RLS") || error.includes("empty error object") || error.includes("Supabase error: ") || error.includes("Non-serializable error object")
                ? `There was an issue fetching data from Supabase. This is LIKELY due to Row Level Security (RLS) policies preventing data access to 'public.sales_team_performance_view' or its underlying table 'sales_score_tracking'. Please check your RLS policies. Other causes: the view is misconfigured, or there's no data for the current filters. Error: ${error}`
                : error.includes("not yet implemented")
                ? error // Show the "not yet implemented" message directly
                : `An unexpected error occurred: ${error}`
              }
            </p>
             {(error.includes("RLS") || error.includes("empty error object") || error.includes("Supabase error: ")) && <p className="text-center text-xs mt-1 text-muted-foreground">The detailed error from Supabase is logged in your browser's developer console.</p>}
          </div>
        ) : activeSubView === 'Individual' ? (
          filteredIndividualData.length === 0 ? (
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
                    <TableHead className="text-xs font-semibold text-foreground px-2 hidden md:table-cell">Record Date</TableHead>
                    <TableHead className="text-right text-xs font-semibold text-foreground px-2">Total Runs</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIndividualData.map((entry) => (
                    <TableRow key={`${entry.name}-${entry.role}-${entry.city || 'global'}-${entry.manager_name || 'no_manager'}-${entry.record_date}`} className="hover:bg-muted/50 transition-colors duration-150">
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
                      <TableCell className="text-center text-xs text-muted-foreground px-2 py-2.5 hidden md:table-cell">{entry.record_date || 'N/A'}</TableCell>
                      <TableCell className="text-right font-bold text-sm text-foreground px-2 py-2.5">{entry.total_runs}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )
        ) : activeSubView === 'ManagerLevel' ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <ListTree size={28} className="mx-auto mb-2 opacity-50" /> {/* Changed Icon */}
            Leaderboard for {currentRoleConfig.label} Managers is coming soon.
            <p className="text-xs mt-1">(This requires data aggregation by manager_name from 'sales_score_tracking' or the view.)</p>
          </div>
        ) : activeSubView === 'CityLevel' ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <Building size={28} className="mx-auto mb-2 opacity-50" />
            City Ranking for {currentRoleConfig.label} performance is coming soon.
            <p className="text-xs mt-1">(This requires data aggregation by city from 'sales_score_tracking' or the view.)</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

