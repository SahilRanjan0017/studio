
// src/components/bpl-sales/sales-leaderboard-table.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Search, AlertCircle, Target, Zap, Briefcase, UserSquare, Building, UserCheck } from 'lucide-react';
import { fetchSalesLeaderboardData, supabase } from '@/lib/supabase';
import type { SalesLeaderboardEntry, SalesLeaderboardRole, ManagerLeaderboardEntry, CityLeaderboardEntry } from '@/types/database';
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
  'CP_OS': { icon: <UserCheck size={20} />, label: "CP OS", fullTitle: "CP OS Performance" },
  'CP_IS': { icon: <Briefcase size={20} />, label: "CP IS", fullTitle: "CP IS Performance" },
};

type SubView = 'Individual' | 'ManagerLevel' | 'CityLevel';

interface SalesLeaderboardTableProps {
  tableForRole: SalesLeaderboardRole;
}

export function SalesLeaderboardTable({ tableForRole }: SalesLeaderboardTableProps) {
  const [individualData, setIndividualData] = useState<SalesLeaderboardEntry[]>([]);
  const [managerData, setManagerData] = useState<ManagerLeaderboardEntry[]>([]);
  const [cityData, setCityData] = useState<CityLeaderboardEntry[]>([]);
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
  const globalCityDisplayName = selectedCity === "Pan India" ? "Pan India" : selectedCity;


  useEffect(() => {
    async function loadAndProcessData() {
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
         setManagerData([]);
         setCityData([]);
         setLoadingData(false);
         return;
      }

      setLoadingData(true);
      setError(null);

      const result = await fetchSalesLeaderboardData(selectedCity, tableForRole);

      if (result.error) {
        console.error(`Failed to fetch Sales Leaderboard data for role ${tableForRole} in ${selectedCity}:`, result.error);
        setError(result.error);
        setIndividualData([]);
        setManagerData([]);
        setCityData([]);
      } else {
        const fetchedIndividualEntries = result.data;
        setIndividualData(fetchedIndividualEntries);

        if (fetchedIndividualEntries.length > 0) {
          const managers: Record<string, { name: string; total_runs: number; cities: Set<string> }> = {};
          fetchedIndividualEntries.forEach(entry => {
            const managerName = entry.manager_name || 'No Manager Assigned';
            if (!managers[managerName]) {
              managers[managerName] = { name: managerName, total_runs: 0, cities: new Set() };
            }
            managers[managerName].total_runs += entry.total_runs;
            if (entry.city) managers[managerName].cities.add(entry.city);
          });
          setManagerData(
            Object.values(managers)
              .sort((a, b) => b.total_runs - a.total_runs)
              .map((m, i) => ({
                rank: i + 1,
                name: m.name,
                city: m.cities.size === 1 ? Array.from(m.cities)[0] : (m.cities.size > 1 ? 'Multiple Cities' : 'N/A'),
                total_runs: m.total_runs,
              }))
          );

          const cities: Record<string, { name: string; total_runs: number }> = {};
          fetchedIndividualEntries.forEach(entry => {
            const cityName = entry.city || 'N/A (Global)'; // Use a specific label for entries with no city
            if (!cities[cityName]) {
              cities[cityName] = { name: cityName, total_runs: 0 };
            }
            cities[cityName].total_runs += entry.total_runs;
          });
          
          const cityEntries = Object.values(cities)
            .filter(c => c.name !== 'N/A (Global)') // Filter out entries explicitly labeled as 'N/A (Global)'
            .sort((a, b) => b.total_runs - a.total_runs)
            .map((c, i) => ({
              rank: i + 1,
              name: c.name,
              total_runs: c.total_runs,
            }));

          // If Pan India is selected and there's a 'N/A (Global)' entry, add it to the list
          // This is usually for entries that genuinely don't have a city assigned.
          if (selectedCity === "Pan India" && cities['N/A (Global)']) {
             cityEntries.push({
                rank: cityEntries.length + 1, // Assign rank after sorting others
                name: 'Global/Unassigned', // Or a more descriptive name
                total_runs: cities['N/A (Global)'].total_runs
             });
          }
          setCityData(cityEntries);

        } else {
          setManagerData([]);
          setCityData([]);
        }
      }
      setLoadingData(false);
    }

    loadAndProcessData();
  }, [tableForRole, selectedCity, loadingGlobalCities, globalCityError, toast]);

  const getInitials = (name: string) => {
    if (!name) return 'N/A';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const subViewTabs = [
    { value: 'Individual', label: `${currentRoleConfig.label}`, icon: <UserSquare size={16} />, searchPlaceholder: `Search by ${currentRoleConfig.label} name...` },
    { value: 'ManagerLevel', label: `${currentRoleConfig.label} Managers`, icon: <Users size={16} />, searchPlaceholder: `Search by Manager name...` },
    { value: 'CityLevel', label: `City Rank (${currentRoleConfig.label})`, icon: <Building size={16} />, searchPlaceholder: `Search by City name...` },
  ];

  const selectedSubViewConfig = subViewTabs.find(tab => tab.value === activeSubView) || subViewTabs[0];

  const filteredIndividualData = useMemo(() => {
    if (!searchTerm) return individualData;
    return individualData.filter(entry =>
      entry.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [individualData, searchTerm]);

  const filteredManagerData = useMemo(() => {
    if (!searchTerm) return managerData;
    return managerData.filter(entry =>
      entry.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [managerData, searchTerm]);

  const filteredCityData = useMemo(() => {
    if (!searchTerm) return cityData;
    return cityData.filter(entry =>
      entry.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cityData, searchTerm]);

  const renderErrorState = () => {
    if (!error) return null;

    const isMissingViewError = error.includes("relation \"public.sales_team_performance_view\" does not exist");
    const isMissingColumnError = error.includes("column") && error.includes("does not exist");
    const isRLSError = error.includes("RLS") || error.includes("empty error object") || error.includes("Supabase error: ") || error.includes("Non-serializable error object");

    return (
      <div className="flex flex-col items-center justify-center text-destructive py-8 text-sm bg-destructive/5 border border-destructive/20 rounded-md p-4 space-y-2">
        <AlertCircle size={32} className="mb-1.5" />
        <p className="text-center font-semibold text-base">Failed to load data for {currentRoleConfig.label}</p>
        {isMissingViewError ? (
          <>
            <p className="text-center text-lg font-bold text-destructive mt-2">DATABASE SETUP ERROR:</p>
            <p className="text-center">The required database view <code>public.sales_team_performance_view</code> could not be found.</p>
            <p className="text-center text-xs mt-1">Please ensure this view is created in your Supabase SQL Editor. Also verify that the underlying table <code>public.sales_score_tracking</code> exists, is populated, and contains columns like <code>name</code>, <code>role</code>, <code>manager_name</code>, <code>city</code>, <code>record_date</code>, <code>score_change</code>, and <code>cumulative_score</code>.</p>
          </>
        ) : isMissingColumnError ? (
           <>
            <p className="text-center text-lg font-bold text-destructive mt-2">DATABASE VIEW MISMATCH:</p>
            <p className="text-center">A required column is missing from or incorrect in the <code>public.sales_team_performance_view</code>.</p>
            <p className="text-center text-xs mt-1">The error from Supabase is: "{error}"</p>
            <p className="text-center text-xs mt-1">Please verify your <code>public.sales_team_performance_view</code> definition in Supabase SQL Editor matches the application's expectations (e.g., includes <code>name</code>, <code>role</code>, <code>manager_name</code>, <code>city</code>, <code>record_date</code>, <code>daily_score</code>, <code>cumulative_score</code>).</p>
          </>
        ) : isRLSError ? (
          <p className="text-center text-xs text-destructive/80">
            Could not fetch data for {currentRoleConfig.label}. This might be due to Row Level Security (RLS) policies on <code>public.sales_team_performance_view</code> or its underlying table(s), or the view itself is not returning data for the current filters (e.g., for role '{tableForRole}' in city '{globalCityDisplayName}'). Please verify RLS settings and view configuration in Supabase. Original Error: {error}
          </p>
        ) : (
          <p className="text-center text-xs text-destructive/80">An unexpected error occurred: {error}</p>
        )}
        <p className="text-center text-xs mt-1 text-muted-foreground">The detailed error from Supabase is logged in your browser's developer console.</p>
      </div>
    );
  };

  const renderIndividualTable = () => (
    filteredIndividualData.length === 0 ? (
      <div className="text-center py-8 text-muted-foreground text-sm">
        {searchTerm
          ? `No ${currentRoleConfig.label} found matching "${searchTerm}" in ${globalCityDisplayName}.`
          : `No data available for ${currentRoleConfig.label} in ${globalCityDisplayName}. Check if 'sales_score_tracking' table has relevant entries for this role and city.`}
      </div>
    ) : (
      <Table>
        <TableHeader>
          <TableRow className="border-border/70">
            <TableHead className="w-[50px] text-center text-xs font-semibold text-foreground px-2">Rank</TableHead>
            <TableHead className="text-xs font-semibold text-foreground px-2 min-w-[180px]">Name / Role</TableHead>
            <TableHead className="text-xs font-semibold text-foreground px-2 hidden md:table-cell">City</TableHead>
            <TableHead className="text-right text-xs font-semibold text-foreground px-2">Total Runs</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredIndividualData.map((entry) => (
            <TableRow key={`${entry.name}-${entry.role}-${entry.city || 'global'}-${entry.record_date}`} className="hover:bg-muted/50 transition-colors duration-150">
              <TableCell className="text-center px-2 py-2.5">
                <div className={cn("w-7 h-7 rounded-full flex items-center justify-center font-semibold text-white text-[0.6rem] mx-auto", entry.rank <= 3 ? "bg-accent" : "bg-primary/80")}>
                  {entry.rank}
                </div>
              </TableCell>
              <TableCell className="px-2 py-2.5">
                <div className="flex items-center gap-2.5">
                  <Avatar className="w-8 h-8"><AvatarFallback className="bg-muted text-muted-foreground font-semibold text-[0.65rem]">{getInitials(entry.name)}</AvatarFallback></Avatar>
                  <div>
                    <div className="font-semibold text-foreground text-sm leading-tight">{entry.name}</div>
                    <div className="text-xs text-muted-foreground leading-tight">{salesRoleConfig[entry.role].label}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground px-2 py-2.5 hidden md:table-cell">{entry.city || 'N/A'}</TableCell>
              <TableCell className="text-right font-bold text-sm text-foreground px-2 py-2.5">{entry.total_runs}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  );

  const renderManagerTable = () => (
    filteredManagerData.length === 0 ? (
       <div className="text-center py-8 text-muted-foreground text-sm">
        {searchTerm
          ? `No Managers found matching "${searchTerm}" for ${currentRoleConfig.label} in ${globalCityDisplayName}.`
          : `No Manager data available for ${currentRoleConfig.label} in ${globalCityDisplayName}. Ensure 'manager_name' is populated in 'sales_score_tracking'.`}
      </div>
    ) : (
      <Table>
        <TableHeader>
          <TableRow className="border-border/70">
            <TableHead className="w-[50px] text-center text-xs font-semibold text-foreground px-2">Rank</TableHead>
            <TableHead className="text-xs font-semibold text-foreground px-2 min-w-[180px]">Manager Name</TableHead>
            <TableHead className="text-xs font-semibold text-foreground px-2 hidden md:table-cell">City/Region</TableHead>
            <TableHead className="text-right text-xs font-semibold text-foreground px-2">Total Team Runs</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredManagerData.map((entry) => (
            <TableRow key={entry.name + '-' + entry.city} className="hover:bg-muted/50 transition-colors duration-150">
              <TableCell className="text-center px-2 py-2.5">
                <div className={cn("w-7 h-7 rounded-full flex items-center justify-center font-semibold text-white text-[0.6rem] mx-auto", entry.rank <= 3 ? "bg-accent" : "bg-primary/80")}>
                  {entry.rank}
                </div>
              </TableCell>
              <TableCell className="px-2 py-2.5">
                <div className="flex items-center gap-2.5">
                  <Avatar className="w-8 h-8"><AvatarFallback className="bg-muted text-muted-foreground font-semibold text-[0.65rem]">{getInitials(entry.name)}</AvatarFallback></Avatar>
                  <div className="font-semibold text-foreground text-sm leading-tight">{entry.name}</div>
                </div>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground px-2 py-2.5 hidden md:table-cell">{entry.city}</TableCell>
              <TableCell className="text-right font-bold text-sm text-foreground px-2 py-2.5">{entry.total_runs}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  );

  const renderCityTable = () => (
    filteredCityData.length === 0 ? (
      <div className="text-center py-8 text-muted-foreground text-sm">
         {searchTerm
          ? `No Cities found matching "${searchTerm}" for ${currentRoleConfig.label} in ${globalCityDisplayName}.`
          : `No City-wise data available for ${currentRoleConfig.label} in ${globalCityDisplayName}. This view is most effective when "Pan India" is selected globally, or if city data exists for '${selectedCity}'.`}
      </div>
    ) : (
      <Table>
        <TableHeader>
          <TableRow className="border-border/70">
            <TableHead className="w-[50px] text-center text-xs font-semibold text-foreground px-2">Rank</TableHead>
            <TableHead className="text-xs font-semibold text-foreground px-2 min-w-[180px]">City</TableHead>
            <TableHead className="text-right text-xs font-semibold text-foreground px-2">Total Runs ({currentRoleConfig.label})</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCityData.map((entry) => (
            <TableRow key={entry.name} className="hover:bg-muted/50 transition-colors duration-150">
              <TableCell className="text-center px-2 py-2.5">
                 <div className={cn("w-7 h-7 rounded-full flex items-center justify-center font-semibold text-white text-[0.6rem] mx-auto", entry.rank <= 3 ? "bg-accent" : "bg-primary/80")}>
                  {entry.rank}
                </div>
              </TableCell>
              <TableCell className="px-2 py-2.5">
                <div className="font-semibold text-foreground text-sm leading-tight">{entry.name}</div>
              </TableCell>
              <TableCell className="text-right font-bold text-sm text-foreground px-2 py-2.5">{entry.total_runs}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  );


  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader className="border-b border-border/70 pb-4">
         <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
                {React.cloneElement(currentRoleConfig.icon, { className: "text-primary h-7 w-7" })}
                <div>
                    <CardTitle className="text-lg font-semibold text-foreground">{currentRoleConfig.fullTitle}</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground mt-0.5">
                       Role: {currentRoleConfig.label} | Global Filter City: {globalCityDisplayName}
                    </CardDescription>
                </div>
            </div>
            <div className="relative w-full sm:flex-grow">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={selectedSubViewConfig.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full h-9"
                  disabled={loadingData || !!error}
                />
            </div>

            <div className="w-full mt-2">
              <div className="sm:hidden">
                <Select
                  value={activeSubView}
                  onValueChange={(value) => { setActiveSubView(value as SubView); setSearchTerm(''); }}
                  disabled={loadingData}
                >
                  <SelectTrigger className="w-full h-9 text-xs">
                     <div className="flex items-center gap-2">
                        {React.cloneElement(selectedSubViewConfig.icon, {className: "h-4 w-4"})}
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
                onValueChange={(value) => { setActiveSubView(value as SubView); setSearchTerm(''); }}
                className="hidden sm:block w-full"
              >
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto sm:h-9">
                  {subViewTabs.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="text-xs sm:text-sm px-2 py-1.5 sm:py-1 flex items-center gap-1.5 whitespace-normal sm:whitespace-nowrap h-full"
                      disabled={loadingData}
                    >
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
              <div key={`skel-${i}`} className="flex items-center space-x-3 p-1.5">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="space-y-1.5 flex-grow">
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-2.5 w-1/2" />
                </div>
                <Skeleton className="h-7 w-14 rounded-md" />
              </div>
            ))}
          </div>
        ) : error ? (
            renderErrorState()
        ) : (
          <div className="overflow-x-auto">
            {activeSubView === 'Individual' && renderIndividualTable()}
            {activeSubView === 'ManagerLevel' && renderManagerTable()}
            {activeSubView === 'CityLevel' && renderCityTable()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

