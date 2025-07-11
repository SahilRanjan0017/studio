// @/app/bpl-scm/dashboard/page.tsx
import { DashboardTitleBlock } from '@/components/bpl/dashboard-title-block';
import { LeaderboardTable } from '@/components/bpl/leaderboard-table'; // Re-using for consistency
import { ActivityFeedSection } from '@/components/bpl/activity-feed-section';
import { ShoppingCart } from 'lucide-react';

export default function BplScmDashboardPage() {
  return (
    <div className="bg-background min-h-screen py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardTitleBlock 
          icon={<ShoppingCart size={28} className="text-primary" />}
          title="BPL SCM Dashboard"
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
