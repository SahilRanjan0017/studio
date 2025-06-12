// src/components/bpl/detail-panel.tsx
'use client';

import type React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowUp, ArrowDown, Minus, Briefcase, BarChart2, Activity, Users2, X } from 'lucide-react';
import type { LeaderboardEntry, LeaderboardRole } from '@/types/database'; // Assuming Role definition is here
import { cn } from '@/lib/utils';

interface RoleConfig {
  icon: React.ReactNode;
  label: string;
}

interface DetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  entry: LeaderboardEntry | null;
  roleConfig: RoleConfig; 
}

const getInitials = (name: string) => {
  if (!name) return 'N/A';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const TrendIndicator = ({ trend }: { trend: number }) => {
  if (trend > 0) return <ArrowUp size={20} className="text-custom-green" />;
  if (trend < 0) return <ArrowDown size={20} className="text-primary" />; // Burnt orange
  return <Minus size={20} className="text-muted-foreground" />;
};

export function DetailPanel({ isOpen, onClose, entry, roleConfig }: DetailPanelProps) {
  if (!entry) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent className="sm:max-w-lg w-full bg-card p-0 flex flex-col" side="right">
        <SheetHeader className="bg-muted/30 p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 border-2 border-primary">
                <AvatarFallback className="text-lg bg-primary/10 text-primary font-semibold">
                  {getInitials(entry.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle className="text-xl font-bold text-foreground">{entry.name}</SheetTitle>
                <SheetDescription className="text-sm text-muted-foreground">
                  {roleConfig.label} {entry.city && entry.city !== 'N/A' ? ` - ${entry.city}` : ''}
                </SheetDescription>
              </div>
            </div>
            <SheetClose asChild>
              <button className="p-1 rounded-md hover:bg-muted focus-visible:ring-1 focus-visible:ring-ring">
                <X size={20} className="text-muted-foreground" />
              </button>
            </SheetClose>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Total Runs</p>
              <p className="text-3xl font-bold text-primary">{entry.runs}</p>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <TrendIndicator trend={entry.trend} />
              <span className={cn(
                entry.trend > 0 ? 'text-custom-green' : entry.trend < 0 ? 'text-primary' : 'text-muted-foreground',
                "font-semibold"
              )}>
                {entry.trend !== 0 ? `${Math.abs(entry.trend)} pts` : 'No Change'}
              </span>
              <span className="text-xs text-muted-foreground ml-1"> (trend)</span>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          <Card>
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                <Briefcase size={16} className="text-primary" />
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1.5 pt-0">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Rank:</span>
                <span className="font-medium text-foreground">{entry.rank}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Projects Managed:</span>
                <span className="font-medium text-foreground">{entry.projects}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Overall Status:</span>
                <span className={cn(
                  "font-medium",
                  entry.status.toLowerCase() === 'green' && 'text-custom-green',
                  entry.status.toLowerCase() === 'amber' && 'text-custom-amber',
                  entry.status.toLowerCase() === 'red' && 'text-custom-red',
                )}>
                  {entry.status}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                <BarChart2 size={16} className="text-primary" />
                Performance Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground text-center py-6">
              <p>(Placeholder for detailed charts and performance metrics)</p>
              <p className="text-xs mt-1">E.g., Runs Over Time, CSAT Score, Delay Analysis</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                <Activity size={16} className="text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground text-center py-6">
              <p>(Placeholder for team-specific recent activities)</p>
            </CardContent>
          </Card>

          {roleConfig.label !== 'OM' && ( // OMs are typically city-based, not individual teams
            <Card>
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Users2 size={16} className="text-primary" />
                  Team Members / Key Contacts
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground text-center py-6">
                <p>(Placeholder for team member list or key contacts)</p>
              </CardContent>
            </Card>
          )}
        </div>
        <div className="p-4 border-t border-border mt-auto">
            <button 
                onClick={onClose} 
                className="w-full text-sm py-2 px-4 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
            >
                Close Panel
            </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

    