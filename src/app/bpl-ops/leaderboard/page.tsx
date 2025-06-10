// @/app/bpl-ops/leaderboard/page.tsx
import { DashboardTitleBlock } from '@/components/bpl/dashboard-title-block';
import { LeaderboardTable } from '@/components/bpl/leaderboard-table';
import { ListOrdered } from 'lucide-react';

export default function LeaderboardPage() {
  return (
    <div className="bg-background min-h-screen py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardTitleBlock 
          icon={<ListOrdered size={28} className="text-primary" />}
          title="BPL Leaderboard"
          subtitle="View current rankings for SPM, TL, and OM roles across different cities."
          className="mb-6"
        />
        <LeaderboardTable />
      </div>
    </div>
  );
}
