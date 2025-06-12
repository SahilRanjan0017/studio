
// @/components/bpl/dashboard-title-block.tsx
import type React from 'react';

interface DashboardTitleBlockProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function DashboardTitleBlock({ title, subtitle, icon, className }: DashboardTitleBlockProps) {
  return (
    <div className={`mb-8 text-center md:text-left ${className}`}>
      <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
        {icon && <div className="text-primary">{icon}</div>}
        <h2 className="text-3xl font-bold text-primary">{title}</h2>
      </div>
      {subtitle && <p className="text-muted-foreground max-w-2xl mx-auto md:mx-0">{subtitle}</p>}
    </div>
  );
}
