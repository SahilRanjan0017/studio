// @/components/bpl-sales/sales-leaderboard-table.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, ArrowUp, ArrowDown, Target, Award, Zap, Users, MapPin, Briefcase, Star, PhoneCall, Handshake, Flame, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useCityFilter } from '@/contexts/CityFilterContext';

export type SalesLeaderboardRole = 'OS' | 'CP OS - Platinum' | 'IS Activation' | 'CP IS' | 'City Champion';

interface SalesLeaderboardEntry {
  rank: number;
  name: string;
  city: string | null;
  dealsClosed?: number; // Example metric for sales
  revenueGenerated?: number; // Example metric for sales
  status: string; // e.g., 'Top Performer', 'On Target'
  runs: number; // Main scoring metric, e.g., sales points
  trend: number; // Change in score/points
  role: SalesLeaderboardRole;
}

const salesRoleConfig: Record<SalesLeaderboardRole, { icon: React.ReactNode; label: string }> = {
  'OS': { icon: <Target size={16} />, label: "OS" },
  'CP OS - Platinum': { icon: <Award size={16} />, label: "CP OS - Plat." },
  'IS Activation': { icon: <Zap size={16} />, label: "IS Act." },
  'CP IS': { icon: <Users size={16} />, label: "CP IS" },
  'City Champion': { icon: <Flame size={16} />, label: "City Champ" },
};

// Placeholder data - replace with actual data fetching logic for sales
const placeholderSalesData: SalesLeaderboardEntry[] = [
  { rank: 1, name: 'Sales Star Alpha', city: 'Metropolis', dealsClosed: 10, revenueGenerated: 500000, status: 'Top Performer', runs: 500, trend: 50, role: 'OS' },
  { rank: 2, name: 'Channel King Beta', city: 'Gotham', dealsClosed: 8, revenueGenerated: 450000, status: 'High Achiever', runs: 450, trend: 30, role: 'CP OS - Platinum' },
  { rank: 3, name: 'Activation Ace Gamma', city: 'Star City', dealsClosed: 12, revenueGenerated: 400000, status: 'Rising Star', runs: 400, trend: 20, role: 'IS Activation' },
  { rank: 4, name: 'Partner Pro Delta', city: 'Central City', dealsClosed: 7, revenueGenerated: 350000, status: 'Consistent', runs: 350, trend: 10, role: 'CP IS' },
  { rank: 5, name: 'Metro Champ Epsilon', city: 'Metropolis', dealsClosed: 15, revenueGenerated: 300000, status: 'Leading', runs: 300, trend: 5, role: 'City Champion' },
  { rank: 6, name: 'Zonal Lead Zeta', city: 'Pan India', dealsClosed: 5, revenueGenerated: 250000, status: 'On Target', runs: 280, trend: 15, role: 'OS' },
];

export function SalesLeaderboardTable() {
  const [activeRole, setActiveRole] = useState<SalesLeaderboardRole>('OS');
  const [leaderboardData, setLeaderboardData] = useState<SalesLeaderboardEntry[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  
  const { selectedCity, loadingCities: loadingGlobalCities, cityError: globalCityError } = useCityFilter();
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      setLoadingData(true);
      setDataError(null);

      if (loadingGlobalCities) return;
      if (globalCityError) {
        setDataError(`Cannot load data due to city filter error: ${globalCityError}`);
        setLeaderboardData([]);
        setLoadingData(false);
        return;
      }

      // --- START Placeholder Data Logic ---
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter placeholder data based on selectedCity and activeRole
      let filteredData = placeholderSalesData.filter(p => p.role === activeRole);
      if (selectedCity !== "Pan India") {
        filteredData = filteredData.filter(p => p.city === selectedCity);
      }
      
      // Re-rank after filtering
      const finalData = filteredData
        .sort((a, b) => b.runs - a.runs)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));

      setLeaderboardData(finalData);
      if (finalData.length === 0) {
         setDataError(null); // No error, just no data for this filter
      }
      // --- END Placeholder Data Logic ---
      
      // TODO: Replace placeholder logic with actual Supabase data fetching for sales roles.
      // This will involve:
      // 1. Defining a new Supabase view or function for sales leaderboard data.
      // 2. Creating a new fetch function in `src/lib/supabase.ts` or a sales-specific data service.
      // 3. Updating the `SalesLeaderboardEntry` type if metrics differ significantly.
      // Example of what real fetching might look like (conceptual):
      // const result = await fetchSalesLeaderboardData(selectedCity, activeRole);
      // if (result.error) {
      //   setDataError(result.error);
      //   setLeaderboardData([]);
      // } else {
      //   setLeaderboardData(result.data);
      // }

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
      return `Displaying ${salesRoleConfig[activeRole].label} rankings for Pan India.`;
    }
    return `Displaying ${salesRoleConfig[activeRole].label} rankings for ${selectedCity}.`;
  }, [activeRole, selectedCity]);


  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader className="border-b pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Trophy size={28} className="text-accent" />
            <div>
              <CardTitle className="text-xl font-semibold text-primary">BPL Sales Leaderboard</CardTitle>
              <p className="text-sm text-muted-foreground">{DisplayName}</p>
            </div>
          </div>
          <Tabs value={activeRole} onValueChange={(value) => setActiveRole(value as SalesLeaderboardRole)} className="w-full sm:w-auto">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-5">
              {(Object.keys(salesRoleConfig) as SalesLeaderboardRole[]).map(roleKey => (
                <TabsTrigger key={roleKey} value={roleKey} className="flex items-center gap-2 px-2 sm:px-3 py-1.5 text-xs sm:text-sm">
                  {React.cloneElement(salesRoleConfig[roleKey].icon, { className: "hidden sm:inline" })}
                  {salesRoleConfig[roleKey].label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="pt-6 px-2 sm:px-6">
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
        ) : dataError ? (
           <div className="text-center py-4 text-destructive bg-destructive/10 border border-destructive/30 rounded-md p-3">{dataError}</div>
        ) : leaderboardData.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No {salesRoleConfig[activeRole].label} data available for {selectedCity === "Pan India" ? "Pan India" : selectedCity}.
            <p className="text-xs mt-2">(Currently using placeholder data. Sales data source needs to be connected.)</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px] text-center">Rank</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">City</TableHead>
                  <TableHead className="text-center">Deals</TableHead> {/* Example: Deals Closed */}
                  <TableHead className="text-center">Rev (₹ Lacs)</TableHead> {/* Example: Revenue */}
                  <TableHead className="text-right">Points</TableHead> {/* 'Runs' equivalent */}
                  <TableHead className="text-right hidden sm:table-cell">Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboardData.map((player) => (
                  <TableRow key={player.name + player.role}>
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
                          <div className="text-xs text-muted-foreground">{salesRoleConfig[player.role].label}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{player.city || 'N/A'}</TableCell>
                    <TableCell className="text-center text-sm">{player.dealsClosed !== undefined ? player.dealsClosed : 'N/A'}</TableCell>
                    <TableCell className="text-center text-sm">{player.revenueGenerated !== undefined ? (player.revenueGenerated / 100000).toFixed(1) : 'N/A'}</TableCell>
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
