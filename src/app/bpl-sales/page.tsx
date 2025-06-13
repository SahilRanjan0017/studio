// @/app/bpl-sales/page.tsx
// This is the main dashboard page for BPL Channel Partner / Sales
import { DashboardTitleBlock } from '@/components/bpl/dashboard-title-block';
import { SalesLeaderboardTable } from '@/components/bpl-sales/sales-leaderboard-table'; // Updated import
import { BarChartBig, Users } from 'lucide-react'; 

export default function BplSalesDashboardPage() { // Renamed function for clarity
  return (
    <div className="bg-background min-h-screen py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardTitleBlock 
          icon={<Users size={28} className="text-primary" />}
          title="BPL Sales Dashboard" // Updated title
          subtitle="Performance overview for Sales Teams and Channel Partners in the BPL." // Updated subtitle
          className="mb-6"
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <div className="lg:col-span-1">
            <SalesLeaderboardTable /> {/* Use the new/renamed component */}
          </div>
        </div>
      </div>
    </div>
  );
}
