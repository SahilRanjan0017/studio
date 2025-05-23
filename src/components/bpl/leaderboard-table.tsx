// @/components/bpl/leaderboard-table.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, ArrowUp, ArrowDown, User, Users, Shield, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge'; // Status badge currently commented out
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { fetchProjectData, type LeaderboardEntry, type LeaderboardRole, supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useCityFilter } from '@/contexts/CityFilterContext'; // Import global city filter

const roleConfig = {
  SPM: { icon: <User size={16} />, label: "SPM" },
  TL: { icon: <Users size={16} />, label: "TL" },
  OM: { icon: <Shield size={16} />, label: "OM" },
};

export function LeaderboardTable() {
  const [activeRole, setActiveRole] = useState<LeaderboardRole>('SPM');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  
  const { selectedCity, loadingCities: loadingGlobalCities, cityError: globalCityError } = useCityFilter();
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      if (!supabase) {
        setDataError("Supabase client not initialized. Check .env variables.");
        setLoadingData(false);
        return;
      }
      
      // Wait for global city filter to initialize if it's still loading or has an error
      if (loadingGlobalCities) {
        setLoadingData(true); // Keep showing loading state for the table
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
      
      const result = await fetchProjectData(selectedCity, activeRole);

      if (result.error) {
        console.error(`Failed to fetch ${activeRole} leaderboard data for ${selectedCity}:`, result.error);
        toast({
            title: `Error Fetching ${activeRole} Data`,
            description: result.error,
            variant: "destructive",
        });
        setDataError(result.error);
        setLeaderboardData([]);
      } else {
        setLeaderboardData(result.data);
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
      return `Displaying ${activeRole} rankings for Pan India.`;
    }
    return `Displaying ${activeRole} rankings for ${selectedCity}.`;
  }, [activeRole, selectedCity]);


  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader className="border-b pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Trophy size={28} className="text-accent" />
            <div>
              <CardTitle className="text-xl font-semibold text-primary">BPL Leaderboard</CardTitle>
              <p className="text-sm text-muted-foreground">{DisplayName}</p>
            </div>
          </div>
          <Tabs value={activeRole} onValueChange={(value) => setActiveRole(value as LeaderboardRole)} className="w-full sm:w-auto">
            <TabsList className="grid w-full grid-cols-3">
              {(Object.keys(roleConfig) as LeaderboardRole[]).map(roleKey => (
                <TabsTrigger key={roleKey} value={roleKey} className="flex items-center gap-2 px-2 sm:px-3 py-1.5">
                  {React.cloneElement(roleConfig[roleKey].icon, { className: "hidden sm:inline" })}
                  {roleConfig[roleKey].label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="pt-6 px-2 sm:px-6">
        {dataError && <div className="text-center py-4 text-destructive bg-destructive/10 border border-destructive/30 rounded-md p-3">{dataError}</div>}
        
        {loadingData ? ( 
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-grow">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-12" />
              </div>
            ))}
          </div>
        ) : !dataError && leaderboardData.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No {activeRole} data available for {selectedCity === "Pan India" ? "Pan India" : selectedCity}.
            <p className="text-xs mt-2">(This could be due to data filters, RLS policies, or the data view in Supabase returning no results for the current selection.)</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px] text-center">Rank</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">City</TableHead>
                  <TableHead className="text-center">Projects</TableHead>
                  {/* <TableHead className="text-center">Status</TableHead> */}
                  <TableHead className="text-right">Runs</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboardData.map((player) => (
                  <TableRow key={player.name}>
                    <TableCell className="text-center">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs mx-auto",
                        player.rank <= 3 ? "bg-accent" : "bg-primary"
                      )}>
                        {player.rank}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9">
                          <AvatarFallback className="bg-muted text-muted-foreground font-semibold text-xs">
                            {getInitials(player.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-foreground text-sm">{player.name}</div>
                          <div className="text-xs text-muted-foreground">{roleConfig[activeRole].label}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{player.city || 'N/A'}</TableCell>
                    <TableCell className="text-center text-sm">{player.projects}</TableCell>
                    {/* <TableCell className="text-center">
                       <Badge className={cn("text-xs py-0.5 px-2 font-medium", getStatusBadgeClass(player.status))}>
                          {player.status}
                       </Badge>
                    </TableCell> */}
                    <TableCell className="text-right font-bold text-base text-foreground">{player.runs}</TableCell>
                    <TableCell className="text-right hidden sm:table-cell">
                      <span className={cn(
                        "flex items-center justify-end gap-1 text-xs",
                        player.trend > 0 ? 'text-custom-green' : player.trend < 0 ? 'text-custom-red' : 'text-muted-foreground'
                      )}>
                        {player.trend > 0 ? <ArrowUp size={14} /> : player.trend < 0 ? <ArrowDown size={14} /> : null}
                        {player.trend !== 0 ? Math.abs(player.trend) : '-'}
                      </span>
                    </TableCell>
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
