
// @/components/bpl-sales/sales-leaderboard-table.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, ArrowUp, ArrowDown, Target, Award, Zap, Users, MapPin, Briefcase, Star, PhoneCall, Handshake, Flame, Loader2, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useCityFilter } from '@/contexts/CityFilterContext';

export type SalesLeaderboardRole = 'OS' | 'CP OS - Platinum' | 'IS Activation' | 'CP IS' | 'City Champion';

interface SalesLeaderboardEntry {
  rank: number;
  name: string;
  city: string | null;
  dealsClosed?: number; 
  revenueGenerated?: number; 
  status: string; 
  runs: number; 
  trend: number; 
  role: SalesLeaderboardRole;
}

const salesRoleConfig: Record<SalesLeaderboardRole, { icon: React.ReactNode; label: string }> = {
  'OS': { icon: <Target size={16} />, label: "OS" },
  'CP OS - Platinum': { icon: <Award size={16} />, label: "CP OS - Plat." },
  'IS Activation': { icon: <Zap size={16} />, label: "IS Act." },
  'CP IS': { icon: <Users size={16} />, label: "CP IS" },
  'City Champion': { icon: <Flame size={16} />, label: "City Champ" },
};

const placeholderSalesData: SalesLeaderboardEntry[] = [
  { rank: 1, name: 'Sales Star Alpha', city: 'Metropolis', dealsClosed: 10, revenueGenerated: 500000, status: 'Top Performer', runs: 500, trend: 50, role: 'OS' },
  { rank: 2, name: 'Channel King Beta', city: 'Gotham', dealsClosed: 8, revenueGenerated: 450000, status: 'High Achiever', runs: 450, trend: 30, role: 'CP OS - Platinum' },
  { rank: 3, name: 'Activation Ace Gamma', city: 'Star City', dealsClosed: 12, revenueGenerated: 400000, status: 'Rising Star', runs: 400, trend: 20, role: 'IS Activation' },
  { rank: 4, name: 'Partner Pro Delta', city: 'Central City', dealsClosed: 7, revenueGenerated: 350000, status: 'Consistent', runs: 350, trend: 10, role: 'CP IS' },
  { rank: 5, name: 'Metro Champ Epsilon', city: 'Metropolis', dealsClosed: 15, revenueGenerated: 300000, status: 'Leading', runs: 300, trend: 5, role: 'City Champion' },
  { rank: 6, name: 'Zonal Lead Zeta', city: 'Pan India', dealsClosed: 5, revenueGenerated: 250000, status: 'On Target', runs: 280, trend: 15, role: 'OS' },
  { rank: 7, name: 'Alpha Junior', city: 'Metropolis', dealsClosed: 3, revenueGenerated: 150000, status: 'Promising', runs: 150, trend: 25, role: 'OS' },
  { rank: 8, name: 'Beta Max', city: 'Gotham', dealsClosed: 2, revenueGenerated: 100000, status: 'Developing', runs: 100, trend: -5, role: 'CP OS - Platinum' },
];

export function SalesLeaderboardTable() {
  const [activeRole, setActiveRole] = useState<SalesLeaderboardRole>('OS');
  const [leaderboardData, setLeaderboardData] = useState<SalesLeaderboardEntry[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
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

      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredData = placeholderSalesData.filter(p => p.role === activeRole);
      if (selectedCity !== "Pan India") {
        filteredData = filteredData.filter(p => p.city === selectedCity);
      }
      
      const finalData = filteredData
        .sort((a, b) => b.runs - a.runs)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));

      setLeaderboardData(finalData);
      if (finalData.length === 0 && !globalCityError) { // Only set no data if there wasn't a global city error
         setDataError(null); 
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
      return `Displaying ${salesRoleConfig[activeRole].label} rankings for Pan India.`;
    }
    return `Displaying ${salesRoleConfig[activeRole].label} rankings for ${selectedCity}.`;
  }, [activeRole, selectedCity]);

  const filteredLeaderboardData = useMemo(() => {
    if (!searchTerm) return leaderboardData;
    return leaderboardData.filter(player => 
      player.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [leaderboardData, searchTerm]);


  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader className="border-b pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Trophy size={28} className="text-primary" />
            <div>
              <CardTitle className="text-xl font-semibold text-primary">BPL Sales Leaderboard</CardTitle>
              <p className="text-sm text-muted-foreground">{DisplayName}</p>
            </div>
          </div>
          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full sm:w-56 md:w-64 sm:-ml-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search"
                placeholder={`Search ${salesRoleConfig[activeRole].label} name...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full h-9"
              />
            </div>
            <Tabs value={activeRole} onValueChange={(value) => setActiveRole(value as SalesLeaderboardRole)} className="w-full sm:w-auto">
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 h-9 bg-muted/70">
                {(Object.keys(salesRoleConfig) as SalesLeaderboardRole[]).map(roleKey => (
                  <TabsTrigger key={roleKey} value={roleKey} className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 text-xs data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm">
                    {React.cloneElement(salesRoleConfig[roleKey].icon, { className: "hidden sm:inline" })}
                    {salesRoleConfig[roleKey].label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
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
        ) : filteredLeaderboardData.length === 0 && searchTerm ? ( 
          <div className="text-center py-10 text-muted-foreground">
            No {salesRoleConfig[activeRole].label} found matching "{searchTerm}".
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px] text-center text-xs font-medium text-muted-foreground/80 px-2">Rank</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground/80 px-2">Name</TableHead>
                  <TableHead className="hidden md:table-cell text-xs font-medium text-muted-foreground/80 px-2">City</TableHead>
                  <TableHead className="text-center text-xs font-medium text-muted-foreground/80 px-2">Deals</TableHead>
                  <TableHead className="text-center text-xs font-medium text-muted-foreground/80 px-2">Rev (₹ Lacs)</TableHead>
                  <TableHead className="text-right text-xs font-medium text-muted-foreground/80 px-2">Points</TableHead>
                  <TableHead className="text-right hidden sm:table-cell text-xs font-medium text-muted-foreground/80 px-1">Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeaderboardData.map((player) => (
                  <TableRow key={player.name + player.role + player.rank}>
                    <TableCell className="text-center px-2 py-2.5">
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center font-semibold text-white text-[0.6rem] mx-auto",
                        player.rank <= 3 ? "bg-primary" : "bg-primary/80"
                      )}>
                        {player.rank}
                      </div>
                    </TableCell>
                    <TableCell className="px-2 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-muted text-muted-foreground font-semibold text-[0.65rem]">
                            {getInitials(player.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-foreground text-sm leading-tight">{player.name}</div>
                          <div className="text-xs text-muted-foreground leading-tight">{salesRoleConfig[player.role].label}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground px-2 py-2.5">{player.city || 'N/A'}</TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground px-2 py-2.5">{player.dealsClosed !== undefined ? player.dealsClosed : 'N/A'}</TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground px-2 py-2.5">{player.revenueGenerated !== undefined ? (player.revenueGenerated / 100000).toFixed(1) : 'N/A'}</TableCell>
                    <TableCell className="text-right font-bold text-sm text-foreground px-2 py-2.5">{player.runs}</TableCell>
                    <TableCell className="text-right hidden sm:table-cell px-1 py-2.5">
                      <span className={cn(
                        "flex items-center justify-end gap-0.5 text-xs",
                        player.trend > 0 ? 'text-custom-green' : player.trend < 0 ? 'text-primary' : 'text-muted-foreground'
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
