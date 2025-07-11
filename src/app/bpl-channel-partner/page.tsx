// @/app/bpl-channel-partner/page.tsx
'use client';

import { useState } from 'react';
import { DashboardTitleBlock } from '@/components/bpl/dashboard-title-block';
import { SalesLeaderboardTable } from '@/components/bpl-channel-partner/sales-leaderboard-table';
import { Users } from 'lucide-react'; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SalesLeaderboardRole } from '@/types/database';

const salesDashboards: { value: SalesLeaderboardRole; label: string }[] = [
  { value: 'CP_OS', label: 'CP OS Dashboard' },
  { value: 'OS', label: 'OS Dashboard' }, 
  { value: 'IS', label: 'IS Dashboard' },   
  { value: 'CP_IS', label: 'CP IS Dashboard' },
];

export default function BplChannelPartnerDashboardPage() {
  const [activeDashboard, setActiveDashboard] = useState<SalesLeaderboardRole>(salesDashboards[0].value);

  return (
    <div className="bg-background min-h-screen py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardTitleBlock 
          icon={<Users size={28} className="text-primary" />}
          title="BPL Channel Partner"
          subtitle="Performance overview for Sales Teams and Channel Partners in the BPL."
          className="mb-6"
        />
        
        <Tabs 
          value={activeDashboard} 
          onValueChange={(value) => setActiveDashboard(value as SalesLeaderboardRole)}
          className="w-full"
        >
          <div className="sm:hidden mb-4">
            <Select
              value={activeDashboard}
              onValueChange={(value) => setActiveDashboard(value as SalesLeaderboardRole)}
            >
              <SelectTrigger className="w-full h-10 text-sm">
                <SelectValue placeholder="Select Dashboard..." />
              </SelectTrigger>
              <SelectContent>
                {salesDashboards.map((dashboard) => (
                  <SelectItem key={dashboard.value} value={dashboard.value} className="text-sm">
                    {dashboard.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="hidden sm:block">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mb-4">
              {salesDashboards.map((dashboard) => (
                <TabsTrigger key={dashboard.value} value={dashboard.value}>
                  {dashboard.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {salesDashboards.map((dashboard) => (
            <TabsContent key={dashboard.value} value={dashboard.value}>
              <SalesLeaderboardTable tableForRole={dashboard.value} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
