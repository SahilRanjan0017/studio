
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
import { fetchProjectData, type LeaderboardEntry, supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useCityFilter } from '@/contexts/CityFilterContext';
import { DetailPanel } from '@/components/bpl/detail-panel';

// Define a new type for the sales-specific roles
export type SalesOpsLeaderboardRole = 'Captain' | 'OS' | 'ME' | 'IS';

const roleConfig: Record<SalesOpsLeaderboardRole, { icon: React.ReactNode; label: string }> = {
  Captain: { icon: <User size={14} />, label: "Captain" },
  OS: { icon: <Users size={14} />, label: "OS" },
  ME: { icon: <Shield size={14} />, label: "ME" },
  IS: { icon: <Shield size={14} />, label: "IS" },
};

export function SalesOpsLeaderboardTable() {
  const [activeRole, setActiveRole] = useState<SalesOpsLeaderboardRole>('Captain');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { selectedCity, loadingCities: loadingGlobalCities, cityError: globalCityError } = useCityFilter();
  const { toast } = useToast();

  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<LeaderboardEntry | null>(null);

  const handleRowClick = (entry: LeaderboardEntry) => {
    setSelectedEntry(entry);
    setIsDetailPanelOpen(true);
  };

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
      
      // The fetchProjectData function needs to be adapted or a new one created if the underlying data/view is different for sales roles.
      // For now, we cast the role, assuming the existing function can handle it or will be adapted.
      // A more robust solution might require a dedicated fetchSalesOpsData function.
      const result = await fetchProjectData(selectedCity, activeRole as any);

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
      return `Displaying ${roleConfig[activeRole].label} rankings for Pan India.`;
    }
    return `Displaying ${roleConfig[activeRole].label} rankings for ${selectedCity}.`;
  }, [activeRole, selectedCity]);

  const TrendIcon = ({ trend }: { trend: number }) => {
    if (trend > 0) return <TrendingUp size={16} className="text-custom-green" />;
    if (trend < 0) return <TrendingDownIcon size={16} className="text-primary" />;
    return <Minus size={16} className="text-muted-foreground" />;
  };

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
                <CardTitle className="text-xl font-extrabold text-foreground tracking-wider">{`BPL ${roleConfig[activeRole].label} Leaderboard`}</CardTitle>
                <p className="text-xs text-muted-foreground font-medium">{DisplayName}</p>
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
              <p className="font-semibold">
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
                    <TableHead className="w-[60px] text-center text-xs font-semibold uppercase text-muted-foreground tracking-wider px-2">Rank</TableHead>
                    <TableHead className="text-xs font-semibold uppercase text-muted-foreground tracking-wider px-2">Player</TableHead>
                    <TableHead className="hidden md:table-cell text-xs font-semibold uppercase text-muted-foreground tracking-wider px-2">City</TableHead>
                    <TableHead className="text-center text-xs font-semibold uppercase text-muted-foreground tracking-wider px-2">Projects</TableHead>
                    <TableHead className="text-right text-xs font-semibold uppercase text-muted-foreground tracking-wider px-2">Runs</TableHead>
                    <TableHead className="text-right hidden sm:table-cell text-xs font-semibold uppercase text-muted-foreground tracking-wider px-2">Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeaderboardData.map((player) => (
                    <TableRow 
                      key={player.name + player.rank + player.city} 
                      className="border-b border-primary/10 hover:bg-primary/5 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                      onClick={() => handleRowClick(player)}
                    >
                      <TableCell className="text-center px-2 py-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mx-auto border-2",
                          player.rank <= 3 ? "bg-accent/10 border-accent text-accent" : "bg-muted/50 border-border text-foreground"
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
                            <div className="font-bold text-foreground text-base leading-tight">{player.name}</div>
                            <div className="text-xs text-muted-foreground font-medium leading-tight">{roleConfig[activeRole].label}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground font-medium px-2 py-3">{player.city || 'N/A'}</TableCell>
                      <TableCell className="text-center text-base font-medium text-foreground px-2 py-3">{player.projects}</TableCell>
                      <TableCell className="text-right font-extrabold text-lg text-primary px-2 py-3">{player.runs}</TableCell>
                      <TableCell className="text-right hidden sm:table-cell px-2 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <TrendIcon trend={player.trend} />
                          <span className={cn(
                            "text-sm font-semibold",
                            player.trend > 0 ? 'text-custom-green' : player.trend < 0 ? 'text-primary' : 'text-muted-foreground'
                          )}>
                            {player.trend !== 0 ? Math.abs(player.trend) : '0'}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      {selectedEntry && (
        <DetailPanel
          isOpen={isDetailPanelOpen}
          onClose={() => setIsDetailPanelOpen(false)}
          entry={selectedEntry}
          roleConfig={roleConfig[activeRole]}
        />
      )}
    </>
  );
}
