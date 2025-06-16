// @/app/bpl-sales/page.tsx
'use client';

import { useState } from 'react';
import { DashboardTitleBlock } from '@/components/bpl/dashboard-title-block';
import { SalesLeaderboardTable } from '@/components/bpl-sales/sales-leaderboard-table';
import { Users } from 'lucide-react'; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SalesLeaderboardRole } from '@/types/database';

// Define the roles for the tabs
const salesDashboards: { value: SalesLeaderboardRole; label: string }[] = [
  { value: 'CP_OS', label: 'CP OS Dashboard' },
  { value: 'OS', label: 'OS Dashboard' }, // Interpreting "CP Dashboard" as OS
  { value: 'IS', label: 'IS Dashboard' },   // Interpreting "IS Activation Dashboard" as IS
  { value: 'CP_IS', label: 'CP IS Dashboard' },
];

export default function BplSalesDashboardPage() {
  const [activeDashboard, setActiveDashboard] = useState<SalesLeaderboardRole>(salesDashboards[0].value);

  return (
    <div className="bg-background min-h-screen py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardTitleBlock 
          icon={<Users size={28} className="text-primary" />}
          title="BPL Sales & Channel Partner"
          subtitle="Performance overview for Sales Teams and Channel Partners in the BPL."
          className="mb-6"
        />
        
        <Tabs 
          value={activeDashboard} 
          onValueChange={(value) => setActiveDashboard(value as SalesLeaderboardRole)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-4">
            {salesDashboards.map((dashboard) => (
              <TabsTrigger key={dashboard.value} value={dashboard.value}>
                {dashboard.label}
              </TabsTrigger>
            ))}
          </TabsList>

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
