// @/app/bpl-sales/dashboard/page.tsx
import { DashboardTitleBlock } from '@/components/bpl/dashboard-title-block';
import { SalesOpsLeaderboardTable } from '@/components/bpl-sales/sales-ops-leaderboard-table'; // Changed to sales-specific leaderboard
import { ActivityFeedSection } from '@/components/bpl/activity-feed-section';
import { Briefcase } from 'lucide-react';

export default function BplSalesDashboardPage() {
  return (
    <div className="bg-background min-h-screen py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardTitleBlock 
          icon={<Briefcase size={28} className="text-primary" />}
          title="BPL Sales Dashboard"
          className="mb-6"
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SalesOpsLeaderboardTable />
          </div>
          <div className="lg:col-span-1">
            <ActivityFeedSection />
          </div>
        </div>
      </div>
    </div>
  );
}
