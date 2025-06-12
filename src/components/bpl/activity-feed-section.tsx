// @/components/bpl/activity-feed-section.tsx
'use client';

import { useEffect, useState } from 'react';
import { History, TrendingUp, TrendingDown, AlertCircle, Loader2, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge'; // Keep Badge for date
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

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
  const [formattedDate, setFormattedDate] = useState<string | null>(null);

  useEffect(() => {
    setFormattedDate(format(new Date(), 'do MMM, yyyy'));
  }, []);

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
        .select('crn_id, score_change, prev_rag_status, current_rag_status, city, record_date')
        .neq('score_change', 0)
        .eq('record_date', today) 
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

  const getStatusColor = (status: string | null) => {
    if (!status) return 'text-muted-foreground';
    if (status.toLowerCase() === 'green') return 'text-custom-green';
    if (status.toLowerCase() === 'amber') return 'text-custom-amber';
    if (status.toLowerCase() === 'red') return 'text-custom-red';
    return 'text-muted-foreground';
  };
  
  const TrendIcon = ({ scoreChange }: { scoreChange: number }) => {
    if (scoreChange > 0) return <TrendingUp size={16} className="text-custom-green" />;
    if (scoreChange < 0) return <TrendingDown size={16} className="text-primary" />; // Orange for down
    return <Minus size={16} className="text-muted-foreground" />;
  };


  const renderActivityItem = (activity: Activity) => {
    const scorePrefix = activity.score_change > 0 ? '+' : '';

    return (
      <li key={activity.id} className="py-2.5 px-1 border-b border-border/70 last:border-b-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <TrendIcon scoreChange={activity.score_change} />
            <div className="text-sm">
              <span className="font-medium text-foreground">{activity.crn_id}</span>
              <span className="text-xs text-muted-foreground"> ({activity.city}) score </span>
              <span className={cn("font-semibold text-xs", activity.score_change > 0 ? 'text-custom-green' : activity.score_change < 0 ? 'text-primary' : 'text-muted-foreground')}>
                {scorePrefix}{activity.score_change}
              </span>.
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            <span className={getStatusColor(activity.prev_rag_status)}>{activity.prev_rag_status}</span>
            <span className="mx-0.5">→</span> 
            <span className={getStatusColor(activity.current_rag_status)}>{activity.current_rag_status}</span>
          </div>
        </div>
      </li>
    );
  };

  return (
    <Card className="shadow-md rounded-lg bg-card flex flex-col">
      <CardHeader className="border-b border-border/70 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <History size={20} className="text-primary" />
            <CardTitle className="text-base font-semibold text-foreground">Recent Activity</CardTitle>
          </div>
          {formattedDate ? (
            <Badge variant="outline" className="text-xs font-normal border-border/70 text-muted-foreground">{formattedDate}</Badge>
          ) : (
            <Badge variant="outline" className="text-xs">Loading date...</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-2 flex-grow">
        {loading ? (
          <div className="flex items-center justify-center text-muted-foreground py-8">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span className="text-sm">Loading activities...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center text-destructive py-8 text-sm">
            <AlertCircle size={28} className="mb-1.5" />
            <p className="text-center">{error}</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center text-muted-foreground py-8 flex flex-col justify-center items-center">
            <History size={28} className="mb-1.5 opacity-50" />
            <p className="text-sm">No significant score changes today.</p>
          </div>
        ) : (
          <ScrollArea className="max-h-[450px] pr-2 -mr-2"> 
            <ul className="divide-y divide-border/50">
              {activities.map(renderActivityItem)}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

    