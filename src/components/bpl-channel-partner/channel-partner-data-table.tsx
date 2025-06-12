// src/components/bpl-channel-partner/channel-partner-data-table.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Search, Loader2, AlertCircle } from 'lucide-react';
import { fetchChannelPartnerData, supabase } from '@/lib/supabase';
import type { ChannelPartnerEntry } from '@/types/database';
import { useCityFilter } from '@/contexts/CityFilterContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function ChannelPartnerDataTable() {
  const [data, setData] = useState<ChannelPartnerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { selectedCity, loadingCities: loadingGlobalCities, cityError: globalCityError } = useCityFilter();
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      if (!supabase) {
        setError("Supabase client not initialized. Check .env variables.");
        setLoading(false);
        return;
      }
      
      if (loadingGlobalCities) {
        setLoading(true); 
        return;
      }
      if (globalCityError) {
         setError(`Cannot load data: Error with city filter (${globalCityError}).`);
         setData([]);
         setLoading(false);
         return;
      }

      setLoading(true);
      setError(null);
      
      const result = await fetchChannelPartnerData(selectedCity);

      if (result.error) {
        console.error(`Failed to fetch Channel Partner data for ${selectedCity}:`, result.error);
        toast({
            title: `Error Fetching Channel Partner Data`,
            description: result.error,
            variant: "destructive",
        });
        setError(result.error);
        setData([]);
      } else {
        setData(result.data);
      }
      setLoading(false);
    }
    loadData();
  }, [selectedCity, loadingGlobalCities, globalCityError, toast]);

  const getInitials = (name: string) => {
    if (!name) return 'N/A';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(partner =>
      partner.partner_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const displayName = useMemo(() => {
    if (selectedCity === "Pan India") {
      return `Displaying Channel Partner rankings for Pan India.`;
    }
    return `Displaying Channel Partner rankings for ${selectedCity}.`;
  }, [selectedCity]);


  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader className="border-b border-border/70 pb-3.5">
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2.5">
                <Users size={24} className="text-primary" />
                <div>
                    <CardTitle className="text-lg font-semibold text-foreground">Channel Partner Performance</CardTitle>
                    <p className="text-xs text-muted-foreground">{displayName}</p>
                </div>
            </div>
            <div className="relative w-full sm:w-56 md:w-64 sm:-ml-2">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search partner name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full h-9"
                />
            </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 px-2 sm:px-4">
        {loading ? (
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
            <p className="text-center font-medium">Failed to load data</p>
            <p className="text-center text-xs mt-1">{error}</p>
            <p className="text-center text-xs mt-2">Please ensure the 'channel_partner_performance_view' exists in Supabase and is correctly configured.</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            {searchTerm
              ? `No partners found matching "${searchTerm}".`
              : `No Channel Partner data available for ${selectedCity === "Pan India" ? "Pan India" : selectedCity}.`}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/70">
                  <TableHead className="w-[50px] text-center text-xs font-medium text-muted-foreground/80 px-2">Rank</TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground/80 px-2 min-w-[150px]">Partner Name</TableHead>
                  <TableHead className="hidden md:table-cell text-xs font-medium text-muted-foreground/80 px-2">City</TableHead>
                  <TableHead className="text-center text-xs font-medium text-muted-foreground/80 px-2">Leads</TableHead>
                  <TableHead className="text-center text-xs font-medium text-muted-foreground/80 px-2">Conv.</TableHead>
                  <TableHead className="text-center text-xs font-medium text-muted-foreground/80 px-2">Conv. Rate</TableHead>
                  <TableHead className="text-right text-xs font-medium text-muted-foreground/80 px-2">Total Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((partner) => (
                  <TableRow key={partner.partner_id} className="hover:bg-muted/50 transition-colors duration-150">
                    <TableCell className="text-center px-2 py-2.5">
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center font-semibold text-white text-[0.6rem] mx-auto",
                        partner.rank <= 3 ? "bg-accent" : "bg-primary/80"
                      )}>
                        {partner.rank}
                      </div>
                    </TableCell>
                    <TableCell className="px-2 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-muted text-muted-foreground font-semibold text-[0.65rem]">
                            {getInitials(partner.partner_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-foreground text-sm leading-tight">{partner.partner_name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground px-2 py-2.5">{partner.city || 'N/A'}</TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground px-2 py-2.5">{partner.leads_generated}</TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground px-2 py-2.5">{partner.successful_conversions}</TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground px-2 py-2.5">{partner.conversion_rate.toFixed(1)}%</TableCell>
                    <TableCell className="text-right font-bold text-sm text-foreground px-2 py-2.5">{partner.total_score}</TableCell>
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
