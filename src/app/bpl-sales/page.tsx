// @/app/bpl-sales/page.tsx
// This is the main dashboard page for BPL Sales
import { DashboardTitleBlock } from '@/components/bpl/dashboard-title-block';
import { SalesLeaderboardTable } from '@/components/bpl-sales/sales-leaderboard-table';
import { SalesActivityFeedSection } from '@/components/bpl-sales/sales-activity-feed-section';
import { BarChartBig } from 'lucide-react'; // Using a different icon for Sales Dashboard

export default function BplSalesDashboardPage() {
  return (
    <div className="bg-background min-h-screen py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardTitleBlock 
          icon={<BarChartBig size={28} className="text-primary" />}
          title="Sales Dashboard Overview"
          subtitle="Track sales performance, targets, and recent activities for the BPL Sales League."
          className="mb-6"
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SalesLeaderboardTable />
          </div>
          <div className="lg:col-span-1">
            <SalesActivityFeedSection />
          </div>
        </div>
      </div>
    </div>
  );
}
