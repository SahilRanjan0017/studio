// @/app/bpl-sales/dashboard/page.tsx
import { DashboardTitleBlock } from '@/components/bpl/dashboard-title-block';
import { SalesOpsLeaderboardTable } from '@/components/bpl-sales/sales-ops-leaderboard-table'; // Changed to sales-specific leaderboard
import { Briefcase } from 'lucide-react';

export default function BplSalesDashboardPage() {
  return (
    <div 
      className="relative min-h-screen py-6 bg-cover bg-center"
      style={{ backgroundImage: "url('https://i.postimg.cc/zfcXMH2H/mario-klassen-70-Yx-STWa2-Zw-unsplash.jpg')" }}
      data-ai-hint="cricket stadium floodlights"
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-0"></div>
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardTitleBlock 
          icon={<Briefcase size={28} className="text-primary" />}
          title="BPL Sales Dashboard"
          className="mb-6"
        />
        
        <div className="grid grid-cols-1 gap-6">
          <SalesOpsLeaderboardTable />
        </div>
      </div>
    </div>
  );
}
