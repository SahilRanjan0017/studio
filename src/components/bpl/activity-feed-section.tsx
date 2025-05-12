// @/components/bpl/activity-feed-section.tsx
'use client';

import { History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ActivityFeedSection() {
  return (
    <Card className="shadow-lg rounded-lg h-full">
      <CardHeader className="border-b">
         <div className="flex items-center gap-3">
            <History size={24} className="text-primary" />
            <CardTitle className="text-xl font-semibold text-primary">Recent Activity</CardTitle>
          </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="text-center text-muted-foreground py-10">
          No recent activity.
        </div>
      </CardContent>
    </Card>
  );
}
