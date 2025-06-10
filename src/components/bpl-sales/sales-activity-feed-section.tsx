// @/components/bpl-sales/sales-activity-feed-section.tsx
'use client';

import { useEffect, useState } from 'react';
import { History, TrendingUp, TrendingDown, AlertCircle, Loader2, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { format, isValid } from 'date-fns';
import { cn } from '@/lib/utils';

interface SalesActivity {
  id: string; 
  entityId: string; // Could be Sales Rep ID, Deal ID, etc.
  changeAmount: number; // e.g., change in sales points, revenue
  prevStatus: string | null; // e.g., 'Prospect'
  currentStatus: string; // e.g., 'Closed Won'
  city: string | null;
  description?: string; // Optional: More context like "Deal Closed"
}

export function SalesActivityFeedSection() {
  const [activities, setActivities] = useState<SalesActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formattedDate, setFormattedDate] = useState<string | null>(null);

  useEffect(() => {
    const today = new Date();
    if (isValid(today)) {
      setFormattedDate(format(today, 'do MMM, yyyy'));
    } else {
      setFormattedDate("Invalid Date");
    }
  }, []);

  useEffect(() => {
    async function fetchActivities() {
      setLoading(true);
      setError(null);

      // --- START Placeholder/Ops Data Fetching ---
      // TODO: This section needs to be updated to fetch sales-specific activity.
      // Currently, it fetches from 'project_performance_view' which is for BPL Ops.
      // You'll need a new Supabase view/table for sales activities (e.g., 'sales_activity_log_view')
      // and update the query accordingly.
      if (!supabase) {
        setError("Supabase client not available.");
        setLoading(false);
        return;
      }
      
      const todayStr = new Date().toISOString().split('T')[0];

      const { data, error: dbError } = await supabase
        .from('project_performance_view') // WARNING: Using Ops data source
        .select('crn_id, score_change, prev_rag_status, current_rag_status, city, record_date')
        .neq('score_change', 0)
        .eq('record_date', todayStr) 
        .order('crn_id', { ascending: true })
        .limit(10); // Limit for display purposes

      if (dbError) {
        console.error('Error fetching sales activity (using ops view):', dbError);
        setError(`Failed to load activities (ops data): ${dbError.message}`);
        setActivities([]);
      } else if (data) {
        const mappedActivities: SalesActivity[] = data.map((item, index) => ({
          id: `${item.crn_id}-${index}`, 
          entityId: item.crn_id, // Placeholder: replace with actual sales entity ID
          changeAmount: item.score_change || 0,
          prevStatus: item.prev_rag_status || 'N/A',
          currentStatus: item.current_rag_status || 'N/A',
          city: item.city || 'N/A',
          description: `Status changed for ${item.crn_id}` // Generic description
        }));
        setActivities(mappedActivities);
      } else {
        setActivities([]);
      }
      // --- END Placeholder/Ops Data Fetching ---
      setLoading(false);
    }

    fetchActivities();
  }, []);

  const renderActivityItem = (activity: SalesActivity) => {
    const isPositive = activity.changeAmount > 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const colorClass = isPositive ? 'text-custom-green' : 'text-custom-red';
    const scorePrefix = isPositive ? '+' : '';

    return (
      <li key={activity.id} className="py-3 px-1 border-b border-border last:border-b-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon size={20} className={colorClass} />
            <div className="text-sm">
              <span className="font-semibold text-foreground">{activity.entityId}</span>
              {activity.city && <span className="text-muted-foreground"> ({activity.city})</span>}
              <span className="text-muted-foreground"> {activity.description || 'updated'}: </span>
              <span className={`font-bold ${colorClass}`}>{scorePrefix}{activity.changeAmount} pts</span>.
            </div>
          </div>
           <Badge variant={isPositive ? "default" : "destructive"} className={cn(
             "text-xs py-0.5 px-2 font-medium",
             isPositive ? "bg-custom-green/10 text-custom-green border-custom-green/30 hover:bg-custom-green/20" 
                        : "bg-custom-red/10 text-custom-red border-custom-red/30 hover:bg-custom-red/20"
           )}>
            {activity.prevStatus} → {activity.currentStatus}
          </Badge>
        </div>
      </li>
    );
  };

  return (
    <Card className="shadow-lg rounded-lg h-full flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Briefcase size={24} className="text-primary" />
            <CardTitle className="text-xl font-semibold text-primary">Sales Activity</CardTitle>
          </div>
          {formattedDate && formattedDate !== "Invalid Date" ? (
            <Badge variant="outline" className="text-xs">{formattedDate}</Badge>
          ) : (
            <Badge variant="outline" className="text-xs">Loading date...</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4 flex-grow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            <span>Loading activities...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-destructive">
            <AlertCircle size={32} className="mb-2" />
            <p className="text-center">{error}</p>
            <p className="text-xs text-muted-foreground mt-1">Note: This section is currently configured to show BPL Ops data. Sales-specific data source needs to be connected.</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center text-muted-foreground py-10 h-full flex flex-col justify-center items-center">
            <History size={32} className="mb-2 opacity-50" />
            <p>No significant sales activities today.</p>
             <p className="text-xs text-muted-foreground mt-1">(Or, sales data source not yet connected.)</p>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100%-0rem)] pr-3 -mr-3"> 
            <ul className="divide-y divide-border">
              {activities.map(renderActivityItem)}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
