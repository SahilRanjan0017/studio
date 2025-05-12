// src/app/rewards/page.tsx
import { DashboardTitleBlock } from '@/components/bpl/dashboard-title-block';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award } from 'lucide-react';

export default function RewardsPage() {
  return (
    <div className="bg-background min-h-screen py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardTitleBlock 
          icon={<Award size={28} className="text-primary" />}
          title="Rewards & Recognition"
          subtitle="Details about prizes and accolades for top performers."
          className="mb-6"
        />
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle>BPL Rewards Program</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Information on individual prizes, team awards, and the Best City Celebration Fund will be available here.</p>
             <p className="mt-4"><em>(Content for this section is under development.)</em></p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
