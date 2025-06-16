
// @/components/bpl/leaderboard-table.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, ArrowUp, ArrowDown, User, Users, Shield, TrendingUp, TrendingDownIcon, Minus, Search, Loader2 } from 'lucide-react'; // Added Search and Loader2
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input'; // Added Input
import { cn } from '@/lib/utils';
import { fetchProjectData, type LeaderboardEntry, type LeaderboardRole, supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useCityFilter } from '@/contexts/CityFilterContext';
import { DetailPanel } from './detail-panel';

const roleConfig = {
  SPM: { icon: <User size={14} />, label: "SPM" },
  TL: { icon: <Users size={14} />, label: "TL" },
  OM: { icon: <Shield size={14} />, label: "OM" },
};

export function LeaderboardTable() {
  const [activeRole, setActiveRole] = useState<LeaderboardRole>('SPM');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  
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
      <Card className="shadow-md rounded-lg bg-card">
        <CardHeader className="border-b border-border/70 pb-3.5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2.5">
              <Trophy size={24} className="text-accent" />
              <div>
                <CardTitle className="text-lg font-semibold text-foreground">{`BPL ${roleConfig[activeRole].label} Leaderboard`}</CardTitle>
                <p className="text-xs text-muted-foreground">{DisplayName}</p>
              </div>
            </div>
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2">
              <div className="relative w-full sm:w-56 md:w-64 sm:-ml-2">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={`Search ${roleConfig[activeRole].label} name...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full h-9"
                />
              </div>
              <Tabs value={activeRole} onValueChange={(value) => setActiveRole(value as LeaderboardRole)} className="w-full sm:w-auto">
                <TabsList className="grid w-full grid-cols-3 h-9 bg-muted/70">
                  {(Object.keys(roleConfig) as LeaderboardRole[]).map(roleKey => (
                    <TabsTrigger key={roleKey} value={roleKey} className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 text-xs data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
                      {React.cloneElement(roleConfig[roleKey].icon, { className: "hidden sm:inline" })}
                      {roleConfig[roleKey].label}
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
          ) : dataError ? (
             <div className="text-center py-3 text-destructive bg-destructive/10 border border-destructive/30 rounded-md p-2.5 text-sm">{dataError}</div>
          ) : filteredLeaderboardData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {searchTerm 
                ? `No ${roleConfig[activeRole].label} found matching "${searchTerm}".`
                : `No ${roleConfig[activeRole].label} data available for ${selectedCity === "Pan India" ? "Pan India" : selectedCity}.`
              }
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/70">
                    <TableHead className="w-[50px] text-center text-xs font-semibold text-foreground px-2">Rank</TableHead>
                    <TableHead className="text-xs font-semibold text-foreground px-2">Name</TableHead>
                    <TableHead className="hidden md:table-cell text-xs font-semibold text-foreground px-2">City</TableHead>
                    <TableHead className="text-center text-xs font-semibold text-foreground px-2">Projects</TableHead>
                    <TableHead className="text-right text-xs font-semibold text-foreground px-2">Runs</TableHead>
                    <TableHead className="text-right hidden sm:table-cell text-xs font-semibold text-foreground px-2">Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeaderboardData.map((player) => (
                    <TableRow 
                      key={player.name + player.rank + player.city} 
                      className="hover:bg-muted/50 cursor-pointer transition-colors duration-150"
                      onClick={() => handleRowClick(player)}
                    >
                      <TableCell className="text-center px-2 py-2.5">
                        <div className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center font-semibold text-white text-[0.6rem] mx-auto",
                          player.rank <= 3 ? "bg-accent" : "bg-primary/80"
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
                            <div className="font-semibold text-foreground text-sm leading-tight">{player.name}</div>
                            <div className="text-xs text-muted-foreground leading-tight">{roleConfig[activeRole].label}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-muted-foreground px-2 py-2.5">{player.city || 'N/A'}</TableCell>
                      <TableCell className="text-center text-sm text-muted-foreground px-2 py-2.5">{player.projects}</TableCell>
                      <TableCell className="text-right font-bold text-sm text-foreground px-2 py-2.5">{player.runs}</TableCell>
                      <TableCell className="text-right hidden sm:table-cell px-2 py-2.5">
                        <div className="flex items-center justify-end gap-0.5">
                          <TrendIcon trend={player.trend} />
                          <span className={cn(
                            "text-xs",
                            player.trend > 0 ? 'text-custom-green' : player.trend < 0 ? 'text-primary' : 'text-muted-foreground'
                          )}>
                            {player.trend !== 0 ? Math.abs(player.trend) : ''}
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
