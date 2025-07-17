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
import type { SalesLeaderboardEntry, SalesLeaderboardRole, ManagerLeaderboardEntry, CityLeaderboardEntry, RawSalesLeaderboardData } from '@/types/database';
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

type SubView = 'Individual' | 'ManagerLevel' | 'CityManagerDetail';

interface SalesLeaderboardTableProps {
  tableForRole: SalesLeaderboardRole;
}

export function SalesLeaderboardTable({ tableForRole }: SalesLeaderboardTableProps) {
  const [rawData, setRawData] = useState<RawSalesLeaderboardData[]>([]);
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
    async function loadData() {
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
         setRawData([]);
         setLoadingData(false);
         return;
      }

      setLoadingData(true);
      setError(null);
      setSearchTerm('');

      const result = await fetchSalesLeaderboardData();

      if (result.error) {
         setError(result.error);
         console.error(`Failed to fetch Sales Leaderboard data:`, result.error);
      } else {
        setRawData(result.data);
      }
      setLoadingData(false);
    }

    loadData();
  }, [loadingGlobalCities, globalCityError, toast]);
  
  useEffect(() => {
    if (loadingData || !rawData) return;
    
    // 1. Filter raw data by selected role and city
    const filteredRaw = rawData.filter(item => {
      const roleMatch = item.role === tableForRole;
      const cityMatch = selectedCity === 'Pan India' || item.city === selectedCity;
      return roleMatch && cityMatch;
    });

    // 2. Get latest entry for each participant
    const latestEntriesMap = new Map<string, RawSalesLeaderboardData>();
    for (const item of filteredRaw) {
      // A person is unique by their name and role.
      const participantKey = `${item.name}-${item.role}`;
      // Since the raw data is ordered by date descending, the first one we see is the latest.
      if (!latestEntriesMap.has(participantKey)) {
        latestEntriesMap.set(participantKey, item);
      }
    }
    const uniqueLatestData = Array.from(latestEntriesMap.values());
    
    // 3. Process for Individual View
    const processedIndividual = uniqueLatestData
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
      .map((entry, index) => ({ ...entry, rank: index + 1 }));

    setIndividualData(processedIndividual);
    
    // 4. Process for Manager and City views (based on the same filtered individual data)
     if (processedIndividual.length > 0) {
      const managers: Record<string, { name: string; total_runs: number; cities: Set<string> }> = {};
      processedIndividual.forEach(entry => {
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
            city: m.cities.size === 1 ? Array.from(m.cities)[0] : (m.cities.size > 1 ? 'Multiple Cities' : (selectedCity === "Pan India" ? "N/A" : selectedCity)),
            total_runs: m.total_runs,
          }))
      );

      const citiesAgg: Record<string, { name: string; total_runs: number; managersInCity: Record<string, number> }> = {};
      processedIndividual.forEach(entry => {
        const cityNameKey = entry.city && entry.city.trim() !== '' ? entry.city.trim() : 'N/A (Global)';
        if (!citiesAgg[cityNameKey]) {
          citiesAgg[cityNameKey] = { name: cityNameKey, total_runs: 0, managersInCity: {} };
        }
        citiesAgg[cityNameKey].total_runs += entry.total_runs;

        if (entry.manager_name) {
            if (!citiesAgg[cityNameKey].managersInCity[entry.manager_name]) {
                citiesAgg[cityNameKey].managersInCity[entry.manager_name] = 0;
            }
            citiesAgg[cityNameKey].managersInCity[entry.manager_name] += entry.total_runs;
        }
      });

      const cityProcessedEntries: CityLeaderboardEntry[] = Object.values(citiesAgg)
        .map(cityAgg => {
            let topManagerNameInCity: string | undefined = undefined;
            if (Object.keys(cityAgg.managersInCity).length > 0) {
                topManagerNameInCity = Object.entries(cityAgg.managersInCity).reduce((topMgr, [currentMgrName, currentMgrRuns]) => {
                    return currentMgrRuns > (cityAgg.managersInCity[topMgr] || 0) ? currentMgrName : topMgr;
                }, Object.keys(cityAgg.managersInCity)[0]);
            }

            return {
                rank: 0,
                name: cityAgg.name === 'N/A (Global)' ? 'Global/Unassigned' : cityAgg.name,
                total_runs: cityAgg.total_runs,
                top_manager_name: topManagerNameInCity,
            };
        })
        .sort((a, b) => b.total_runs - a.total_runs)
        .map((c, i) => ({ ...c, rank: i + 1 }));
      setCityData(cityProcessedEntries);

    } else {
      setManagerData([]);
      setCityData([]);
    }

  }, [rawData, tableForRole, selectedCity, loadingData]);

  const getInitials = (name: string) => {
    if (!name) return 'N/A';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const subViewTabs: { value: SubView; label: string; icon: React.ReactNode; searchPlaceholder: string }[] = [
    { value: 'Individual', label: `${currentRoleConfig.label}`, icon: <UserSquare size={16} />, searchPlaceholder: `Search by ${currentRoleConfig.label} name...` },
    { value: 'ManagerLevel', label: `${currentRoleConfig.label} Managers`, icon: <Users size={16} />, searchPlaceholder: `Search by Manager name...` },
    { value: 'CityManagerDetail', label: `City (${currentRoleConfig.label})`, icon: <Building size={16} />, searchPlaceholder: `Search by City or Manager...` },
  ];

  const selectedSubViewConfig = subViewTabs.find(tab => tab.value === activeSubView) || subViewTabs[0];

  const filteredIndividualData = useMemo(() => {
    if (!searchTerm) return individualData;
    return individualData.filter(entry =>
      entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.manager_name && entry.manager_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (entry.city && entry.city.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [individualData, searchTerm]);

  const filteredManagerData = useMemo(() => {
    if (!searchTerm) return managerData;
    return managerData.filter(entry =>
      entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.city && entry.city.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [managerData, searchTerm]);

  const filteredCityManagerDetailData = useMemo(() => {
    if (!searchTerm) return cityData; 
    return cityData.filter(entry =>
        entry.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (entry.top_manager_name && entry.top_manager_name.toLowerCase().includes(searchTerm.toLowerCase())) 
    );
  }, [cityData, searchTerm]);


  const renderErrorState = () => {
    if (!error) return null;
    const isViewMissingError = error.includes("relation") && error.includes("does not exist") && (error.includes("sale_view") || error.includes("bpl_sales"));
    const isColumnMissingError = error.includes("column") && error.includes("does not exist");

    let title = `Failed to load data for ${currentRoleConfig.label}`;
    let details = error;

    if (isViewMissingError) {
        title = "DATABASE SETUP ERROR";
        details = `The required database view "public.sale_view" or its underlying table "public.bpl_sales" could not be found or is inaccessible. Please ensure these are created in your Supabase SQL Editor, populated, and RLS policies are correctly configured. Original error: "${error}"`;
    } else if (isColumnMissingError) {
        title = "DATABASE VIEW MISMATCH";
        const missingColumnMatch = error.match(/column "(.+?)" of relation "sale_view" does not exist/i) || error.match(/column ([a-zA-Z0-9_]+) of relation "sale_view" does not exist/i);
        const missingColumn = missingColumnMatch ? (missingColumnMatch[1] || missingColumnMatch[2]) : "unknown";
        details = `A required column (e.g., '${missingColumn}') is missing from or incorrect in "public.sale_view". The application expects certain columns based on the SQL view definition. Please verify your view definition in Supabase SQL Editor. Original error: "${error}"`;
    }


    return (
      <div className="flex flex-col items-center justify-center text-destructive py-8 text-sm bg-destructive/5 border border-destructive/20 rounded-md p-4 space-y-2">
        <AlertCircle size={32} className="mb-1.5" />
        <p className="text-center font-semibold text-base">{title}</p>
        <p className="text-center text-xs text-destructive/80 px-4">{details}</p>
        <p className="text-center text-xs mt-1 text-muted-foreground">Please check the browser console for more technical details.</p>
      </div>
    );
  };

  const renderIndividualTable = () => (
    filteredIndividualData.length === 0 ? (
      <div className="text-center py-8 text-muted-foreground text-sm">
        {searchTerm
          ? `No ${currentRoleConfig.label} found matching "${searchTerm}" in ${globalCityDisplayName}.`
          : `No data available for ${currentRoleConfig.label} in ${globalCityDisplayName}. Check if 'sale_view' table has relevant entries for this role and city.`}
      </div>
    ) : (
      <Table>
        <TableHeader>
          <TableRow className="border-border/70">
            <TableHead className="w-[50px] text-center text-xs font-semibold text-foreground px-2">Rank</TableHead>
            <TableHead className="text-xs font-semibold text-foreground px-2 min-w-[180px]">Name / Role</TableHead>
            <TableHead className="text-xs font-semibold text-foreground px-2 hidden md:table-cell">Manager</TableHead>
            <TableHead className="text-xs font-semibold text-foreground px-2 hidden md:table-cell">City</TableHead>
            <TableHead className="text-right text-xs font-semibold text-foreground px-2">Total Runs</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredIndividualData.map((entry) => (
            <TableRow key={`${entry.name}-${entry.role}-${entry.city || 'global_city'}-${entry.manager_name || 'no_manager_ind'}-${entry.record_date}`} className="hover:bg-muted/50 transition-colors duration-150">
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
                    <div className="text-xs text-muted-foreground leading-tight">{currentRoleConfig.label}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground px-2 py-2.5 hidden md:table-cell">{entry.manager_name || 'N/A'}</TableCell>
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
          : `No Manager data available for ${currentRoleConfig.label} in ${globalCityDisplayName}. Ensure 'manager_name' is populated in 'sale_view'.`}
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
            <TableRow key={`${entry.name}-${entry.city || 'global_manager_city_mgr_view'}`} className="hover:bg-muted/50 transition-colors duration-150">
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

  const renderCityManagerDetailTable = () => (
    filteredCityManagerDetailData.length === 0 ? (
      <div className="text-center py-8 text-muted-foreground text-sm">
        {searchTerm
          ? `No City or Manager found matching "${searchTerm}" for ${currentRoleConfig.label} in ${globalCityDisplayName}.`
          : `No City & Manager data available for ${currentRoleConfig.label} in ${globalCityDisplayName}.`}
      </div>
    ) : (
      <Table>
        <TableHeader>
          <TableRow className="border-border/70">
            <TableHead className="w-[50px] text-center text-xs font-semibold text-foreground px-2">Rank</TableHead>
            <TableHead className="text-xs font-semibold text-foreground px-2 min-w-[150px]">City</TableHead>
            <TableHead className="text-xs font-semibold text-foreground px-2 min-w-[180px]">Top Manager in City</TableHead>
            <TableHead className="text-right text-xs font-semibold text-foreground px-2">Total City Runs ({currentRoleConfig.label})</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCityManagerDetailData.map((entry) => (
            <TableRow key={`${entry.name}-citymanagerdetail`} className="hover:bg-muted/50 transition-colors duration-150">
              <TableCell className="text-center px-2 py-2.5">
                 <div className={cn("w-7 h-7 rounded-full flex items-center justify-center font-semibold text-white text-[0.6rem] mx-auto", entry.rank <= 3 ? "bg-accent" : "bg-primary/80")}>
                  {entry.rank}
                </div>
              </TableCell>
              <TableCell className="px-2 py-2.5">
                <div className="font-semibold text-foreground text-sm leading-tight">{entry.name}</div>
              </TableCell>
               <TableCell className="px-2 py-2.5">
                {entry.top_manager_name ? (
                    <div className="flex items-center gap-2.5">
                        <Avatar className="w-8 h-8"><AvatarFallback className="bg-muted text-muted-foreground font-semibold text-[0.65rem]">{getInitials(entry.top_manager_name)}</AvatarFallback></Avatar>
                        <div className="font-medium text-foreground text-sm leading-tight">{entry.top_manager_name}</div>
                    </div>
                ) : (
                    <span className="text-xs text-muted-foreground">N/A</span>
                )}
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
                  disabled={loadingData || !!error}
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
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 h-auto sm:h-9">
                  {subViewTabs.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="text-xs sm:text-sm px-2 py-1.5 sm:py-1 flex items-center gap-1.5 whitespace-normal sm:whitespace-nowrap h-full"
                      disabled={loadingData || !!error}
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
            {activeSubView === 'CityManagerDetail' && renderCityManagerDetailTable()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
