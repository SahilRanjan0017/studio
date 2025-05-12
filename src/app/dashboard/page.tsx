// @/app/dashboard/page.tsx
import { DashboardTitleBlock } from '@/components/bpl/dashboard-title-block';
import { LeaderboardTable } from '@/components/bpl/leaderboard-table';
import { ActivityFeedSection } from '@/components/bpl/activity-feed-section';
import { Grid } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="bg-background min-h-screen py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardTitleBlock 
          icon={<Grid size={28} className="text-primary" />}
          title="Dashboard Overview"
          className="mb-6"
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LeaderboardTable />
          </div>
          <div className="lg:col-span-1">
            <ActivityFeedSection />
          </div>
        </div>
      </div>
    </div>
  );
}
