// @/components/bpl/crn-tracking-card.tsx
import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export type CrnStatus = 'Green' | 'Amber' | 'Red';

interface CrnDetail {
  label: string;
  value: string | number;
}

interface CrnTrackingCardProps {
  crnId: string;
  status: CrnStatus;
  customerName: string;
  spmName: string;
  stage: string;
  details: CrnDetail[];
  progressValue: number; // 0-100
}

export function CrnTrackingCard({ crnId, status, customerName, spmName, stage, details, progressValue }: CrnTrackingCardProps) {
  const statusColorClasses = {
    Green: { border: 'border-l-custom-green', dot: 'bg-custom-green', progress: 'bg-custom-green' },
    Amber: { border: 'border-l-custom-amber', dot: 'bg-custom-amber', progress: 'bg-custom-amber' },
    Red: { border: 'border-l-custom-red', dot: 'bg-custom-red', progress: 'bg-custom-red' },
  };

  const currentStatusColors = statusColorClasses[status];

  return (
    <Card className={cn("shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fadeInUp border-l-4", currentStatusColors.border)}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold text-primary">{crnId}</CardTitle>
          <div className="flex items-center gap-2">
            <div className={cn("w-3 h-3 rounded-full", currentStatusColors.dot)}></div>
            <span className={cn("font-semibold text-sm", 
              status === 'Green' ? 'text-custom-green' :
              status === 'Amber' ? 'text-custom-amber' : 'text-custom-red'
            )}>{status}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{customerName} / SPM: {spmName}</p>
      </CardHeader>
      <CardContent>
        <div className="mb-3">
          <p className="text-sm font-medium text-foreground">Current Stage: <span className="font-semibold text-primary">{stage}</span></p>
        </div>
        <div className="space-y-1.5 mb-4">
          {details.map((detail, index) => (
            <div key={index} className="flex justify-between text-xs pb-1 border-b border-border last:border-b-0">
              <span className="text-muted-foreground">{detail.label}:</span>
              <span className="font-medium text-foreground">{detail.value}</span>
            </div>
          ))}
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-semibold text-primary">{progressValue}%</span>
          </div>
          <Progress value={progressValue} className={cn("h-2 [&>div]:bg-primary", currentStatusColors.progress)} indicatorClassName={currentStatusColors.progress} />
        </div>
      </CardContent>
    </Card>
  );
}
