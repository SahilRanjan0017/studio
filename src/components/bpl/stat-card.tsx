// @/components/bpl/stat-card.tsx
import type React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor?: string; // e.g., 'bg-custom-green', 'bg-custom-amber', 'bg-custom-red'
  changeText?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

export function StatCard({ title, value, icon, iconBgColor = 'bg-primary', changeText, changeType = 'neutral' }: StatCardProps) {
  const changeIcon = changeType === 'positive' ? <ArrowUp size={16} /> : changeType === 'negative' ? <ArrowDown size={16} /> : null;
  const changeColorClass = changeType === 'positive' ? 'text-custom-green' : changeType === 'negative' ? 'text-custom-red' : 'text-muted-foreground';

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fadeInUp">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
          </div>
          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-white", iconBgColor)}>
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {changeText && (
          <div className={cn("text-xs flex items-center gap-1", changeColorClass)}>
            {changeIcon}
            {changeText}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
