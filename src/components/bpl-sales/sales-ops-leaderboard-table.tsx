
// @/components/bpl-sales/sales-ops-leaderboard-table.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, ArrowUp, ArrowDown, User, Users, Shield, TrendingUp, TrendingDownIcon, Minus, Search, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { fetchSalesLeaderboardData, supabase } from '@/lib/supabase';
import type { RawSalesLeaderboardData, SalesOpsLeaderboardRole } from '@/types/database';
import { useToast } from '@/hooks/use-toast';
import { useCityFilter } from '@/contexts/CityFilterContext';

const roleConfig: Record<SalesOpsLeaderboardRole, { icon: React.ReactNode; label: string }> = {
  Captain: { icon: <User size={14} />, label: "Captain" },
  OS: { icon: <Users size={14} />, label: "OS" },
  ME: { icon: <Shield size={14} />, label: "ME" },
  IS: { icon: <Shield size={14} />, label: "IS" },
};

interface LeaderboardEntry {
    rank: number;
    name: string;
    city: string | null;
    runs: number;
}

export function SalesOpsLeaderboardTable() {
  const [activeRole, setActiveRole] = useState<SalesOpsLeaderboardRole>('Captain');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { selectedCity, loadingCities: loadingGlobalCities, cityError: globalCityError } = useCityFilter();
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      if (!supabase) {
        setDataError("Supabase client not initialized. Check .env variables.");
        setLoadingData(false);
        return;
      }
      
      if (loadingGlobalCities) {
        setLoadingData(true); 
        return;
      }
      if (globalCityError) {
         setDataError(`Cannot load data: Error with city filter (${globalCityError}).`);
         setLeaderboardData([]);
         setLoadingData(false);
         return;
      }

      setLoadingData(true);
      setDataError(null);
      
      const result = await fetchSalesLeaderboardData();

      if (result.error) {
        console.error(`Failed to fetch sales leaderboard data:`, result.error);
        toast({
            title: `Error Fetching Sales Data`,
            description: result.error,
            variant: "destructive",
        });
        setDataError(result.error);
        setLeaderboardData([]);
      } else {
        // Post-process the raw data here
        const filteredRaw = result.data.filter(item => {
            const roleMatch = item.role === activeRole;
            const cityMatch = selectedCity === 'Pan India' || item.city === selectedCity;
            return roleMatch && cityMatch;
        });
        
        const latestEntriesMap = new Map<string, RawSalesLeaderboardData>();
        for (const item of filteredRaw) {
          const participantKey = `${item.name}-${item.role}`;
          if (!latestEntriesMap.has(participantKey)) {
            latestEntriesMap.set(participantKey, item);
          }
        }
        const uniqueLatestData = Array.from(latestEntriesMap.values());
        
        const processedData: LeaderboardEntry[] = uniqueLatestData
            .map(item => ({
                name: item.name,
                city: item.city,
                runs: item.cumulative_score,
                rank: 0, 
            }))
            .sort((a,b) => b.runs - a.runs)
            .map((entry, index) => ({...entry, rank: index + 1}));

        setLeaderboardData(processedData);
      }
      setLoadingData(false);
    }
    loadData();
  }, [activeRole, selectedCity, loadingGlobalCities, globalCityError, toast]);
  
  const getInitials = (name: string) => {
    if (!name) return 'N/A';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const DisplayName = useMemo(() => {
    if (selectedCity === "Pan India") {
      return `Displaying ${roleConfig[activeRole].label} rankings for Pan India.`;
    }
    return `Displaying ${roleConfig[activeRole].label} rankings for ${selectedCity}.`;
  }, [activeRole, selectedCity]);

  const filteredLeaderboardData = useMemo(() => {
    if (!searchTerm) return leaderboardData;
    return leaderboardData.filter(player =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [leaderboardData, searchTerm]);

  return (
    <>
      <Card className="shadow-2xl rounded-xl bg-background/60 backdrop-blur-md border-primary/20">
        <CardHeader className="border-b-2 border-primary/20 pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <Trophy size={32} className="text-accent animate-pulse-scale" />
              <div>
                <CardTitle className="text-xl font-extrabold text-primary-foreground tracking-wider">{`BPL ${roleConfig[activeRole].label} Leaderboard`}</CardTitle>
                <p className="text-xs text-primary-foreground/80 font-medium">{DisplayName}</p>
              </div>
            </div>
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-56 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={`Search ${roleConfig[activeRole].label}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full h-10 bg-background/70 rounded-full focus:ring-accent"
                />
              </div>
              <Tabs value={activeRole} onValueChange={(value) => setActiveRole(value as SalesOpsLeaderboardRole)} className="w-full sm:w-auto">
                <TabsList className="grid w-full grid-cols-4 h-10 bg-muted/70 rounded-full">
                  {(Object.keys(roleConfig) as SalesOpsLeaderboardRole[]).map(roleKey => (
                    <TabsTrigger key={roleKey} value={roleKey} className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg">
                      {React.cloneElement(roleConfig[roleKey].icon, { className: "hidden sm:inline" })}
                      {roleConfig[roleKey].label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2 px-2 sm:px-4">
          {loadingData ? ( 
            <div className="space-y-2 py-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-grow">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-8 w-16 rounded-md" />
                </div>
              ))}
            </div>
          ) : dataError ? (
             <div className="text-center py-6 text-destructive bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-sm">{dataError}</div>
          ) : filteredLeaderboardData.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm">
              <p className="font-semibold text-primary-foreground/70">
              {searchTerm 
                ? `No ${roleConfig[activeRole].label} found matching "${searchTerm}".`
                : `No ${roleConfig[activeRole].label} data available for ${selectedCity === "Pan India" ? "Pan India" : selectedCity}.`
              }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="border-b-primary/10">
                    <TableHead className="w-[60px] text-center text-xs font-semibold uppercase text-primary-foreground/60 tracking-wider px-2">Rank</TableHead>
                    <TableHead className="text-xs font-semibold uppercase text-primary-foreground/60 tracking-wider px-2">Player</TableHead>
                    <TableHead className="hidden md:table-cell text-xs font-semibold uppercase text-primary-foreground/60 tracking-wider px-2">City</TableHead>
                    <TableHead className="text-right text-xs font-semibold uppercase text-primary-foreground/60 tracking-wider px-2">Runs</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeaderboardData.map((player) => (
                    <TableRow 
                      key={player.name + player.rank + player.city} 
                      className="border-b border-primary/10 hover:bg-primary/5 cursor-pointer transition-all duration-200"
                    >
                      <TableCell className="text-center px-2 py-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mx-auto border-2",
                          player.rank <= 3 ? "bg-accent/10 border-accent text-accent" : "bg-muted/50 border-border text-primary-foreground"
                        )}>
                          {player.rank}
                        </div>
                      </TableCell>
                      <TableCell className="px-2 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10 border-2 border-primary/20">
                            <AvatarFallback className="bg-muted text-muted-foreground font-semibold text-sm">
                              {getInitials(player.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-bold text-primary-foreground text-base leading-tight">{player.name}</div>
                            <div className="text-xs text-primary-foreground/70 font-medium leading-tight">{roleConfig[activeRole].label}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-primary-foreground/80 font-medium px-2 py-3">{player.city || 'N/A'}</TableCell>
                      <TableCell className="text-right font-extrabold text-lg text-primary px-2 py-3">{player.runs}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
