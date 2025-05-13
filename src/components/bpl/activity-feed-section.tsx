// @/components/bpl/activity-feed-section.tsx
'use client';

import { useEffect, useState } from 'react';
import { History, TrendingUp, TrendingDown, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils'; // Import cn from lib/utils

interface Activity {
  id: string; 
  crn_id: string;
  score_change: number;
  prev_rag_status: string | null;
  current_rag_status: string;
  city: string | null;
}

export function ActivityFeedSection() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchActivities() {
      setLoading(true);
      setError(null);

      if (!supabase) {
        setError("Supabase client not available.");
        setLoading(false);
        return;
      }
      
      const today = new Date().toISOString().split('T')[0];

      const { data, error: dbError } = await supabase
        .from('project_performance_view')
        .select('crn_id, score_change, prev_rag_status, current_rag_status, city, score_date')
        .neq('score_change', 0)
        .eq('score_date', today) // Filter for current date
        .order('crn_id', { ascending: true }); 

      if (dbError) {
        console.error('Error fetching activity feed:', dbError);
        setError(`Failed to load activities: ${dbError.message}`);
        setActivities([]);
      } else if (data) {
        const mappedActivities = data.map((item, index) => ({
          id: `${item.crn_id}-${index}`, 
          crn_id: item.crn_id,
          score_change: item.score_change || 0,
          prev_rag_status: item.prev_rag_status || 'N/A',
          current_rag_status: item.current_rag_status || 'N/A',
          city: item.city || 'N/A',
        }));
        setActivities(mappedActivities);
      } else {
        setActivities([]);
      }
      setLoading(false);
    }

    fetchActivities();
  }, []);

  const renderActivityItem = (activity: Activity) => {
    const isPositive = activity.score_change > 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const colorClass = isPositive ? 'text-custom-green' : 'text-custom-red';
    const scorePrefix = isPositive ? '+' : '';

    return (
      <li key={activity.id} className="py-3 px-1 border-b border-border last:border-b-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon size={20} className={colorClass} />
            <div className="text-sm">
              <span className="font-semibold text-foreground">CRN {activity.crn_id}</span>
              <span className="text-muted-foreground"> ({activity.city}) score changed by </span>
              <span className={`font-bold ${colorClass}`}>{scorePrefix}{activity.score_change}</span>.
            </div>
          </div>
           <Badge variant={isPositive ? "default" : "destructive"} className={cn(
             "text-xs py-0.5 px-2 font-medium",
             isPositive ? "bg-custom-green/10 text-custom-green border-custom-green/30 hover:bg-custom-green/20" 
                        : "bg-custom-red/10 text-custom-red border-custom-red/30 hover:bg-custom-red/20"
           )}>
            {activity.prev_rag_status} → {activity.current_rag_status}
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
            <History size={24} className="text-primary" />
            <CardTitle className="text-xl font-semibold text-primary">Recent Activity</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">{format(new Date(), 'do MMM, yyyy')}</Badge>
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
            <p className="text-xs text-muted-foreground mt-1">Please ensure the database view 'project_performance_view' is correctly configured for today's date.</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center text-muted-foreground py-10 h-full flex flex-col justify-center items-center">
            <History size={32} className="mb-2 opacity-50" />
            <p>No significant score changes today.</p>
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
