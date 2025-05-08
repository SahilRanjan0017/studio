// @/components/bpl/activity-feed-item.tsx
import type React from 'react';
import { cn } from '@/lib/utils';

interface ActivityFeedItemProps {
  icon: React.ReactNode;
  iconBgColor: string; // e.g., 'bg-custom-green', 'bg-primary'
  text: React.ReactNode; // Allows for <strong> tags
  time: string;
  runsChange?: number; // Positive for gain, negative for loss
}

export function ActivityFeedItem({ icon, iconBgColor, text, time, runsChange }: ActivityFeedItemProps) {
  return (
    <li className="flex gap-4 py-4 border-b border-border last:border-b-0 animate-fadeInUp">
      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0", iconBgColor)}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="mb-1 text-sm text-foreground">
          {text}
          {runsChange !== undefined && (
            <span className={cn(
              "font-bold py-0.5 px-1.5 rounded text-xs ml-2",
              runsChange > 0 ? "bg-custom-green/20 text-custom-green" : "bg-custom-red/20 text-custom-red"
            )}>
              {runsChange > 0 ? `+${runsChange}` : runsChange} Runs
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </li>
  );
}
