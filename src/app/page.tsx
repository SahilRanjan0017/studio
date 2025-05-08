// @/app/page.tsx
import { DashboardTitleBlock } from '@/components/bpl/dashboard-title-block';
import { ScoreboardSection } from '@/components/bpl/scoreboard-section';
import { LeaderboardTable } from '@/components/bpl/leaderboard-table';
import { CrnTrackingSection } from '@/components/bpl/crn-tracking-section';
import { ActivityFeedSection } from '@/components/bpl/activity-feed-section';

export default function BplDashboardPage() {
  return (
    <div className="bg-background min-h-screen py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardTitleBlock 
          title="Brick & Bolt Premier League Dashboard"
          subtitle="Track performance, celebrate achievements, and compete for the top spot in our construction championship."
        />
        
        <ScoreboardSection />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <LeaderboardTable />
          </div>
          <div className="lg:col-span-1">
            <ActivityFeedSection />
          </div>
        </div>
        
        <CrnTrackingSection />

      </div>
    </div>
  );
}
