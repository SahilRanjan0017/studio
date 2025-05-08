// @/components/bpl/activity-feed-section.tsx
'use client';

import { History, Award, AlertCircle, UserPlus, TrendingUp } from 'lucide-react';
import { ActivityFeedItem } from './activity-feed-item';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DashboardTitleBlock } from './dashboard-title-block';


const activityData = [
  { 
    icon: <Award size={20} />, iconBgColor: "bg-accent", 
    text: <><span className="font-semibold">Rahul Sharma</span> achieved <span className="font-semibold text-primary">Milestone 3</span> on CRN00123.</>, 
    time: "2 hours ago", runsChange: 10 
  },
  { 
    icon: <AlertCircle size={20} />, iconBgColor: "bg-custom-red", 
    text: <><span className="font-semibold">CRN00789</span> status changed to <span className="font-semibold text-custom-red">Red</span>.</>, 
    time: "5 hours ago", runsChange: -5 
  },
  { 
    icon: <UserPlus size={20} />, iconBgColor: "bg-secondary", 
    text: <><span className="font-semibold">Priya Kapoor</span> assigned to new project <span className="font-semibold text-primary">CRN00567</span>.</>, 
    time: "1 day ago" 
  },
  { 
    icon: <TrendingUp size={20} />, iconBgColor: "bg-custom-green", 
    text: <><span className="font-semibold">Amit Joshi</span> completed project <span className="font-semibold text-primary">CRN00098</span> ahead of schedule.</>, 
    time: "2 days ago", runsChange: 15 
  },
];

export function ActivityFeedSection() {
  return (
    <Card className="shadow-xl animate-fadeInUp mb-8">
      <CardHeader className="border-b pb-4">
         <div className="flex items-center gap-3">
            <History size={28} className="text-primary" />
            <h3 className="text-2xl font-semibold text-primary">Recent Activity</h3>
          </div>
      </CardHeader>
      <CardContent className="pt-2 px-0 sm:px-6">
        <ul className="divide-y divide-border">
          {activityData.map((activity, index) => (
            <ActivityFeedItem
              key={index}
              icon={activity.icon}
              iconBgColor={activity.iconBgColor}
              text={activity.text}
              time={activity.time}
              runsChange={activity.runsChange}
            />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
