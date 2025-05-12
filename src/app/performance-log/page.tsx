// src/app/performance-log/page.tsx
import { DashboardTitleBlock } from '@/components/bpl/dashboard-title-block';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare } from 'lucide-react';

export default function PerformanceLogPage() {
  return (
    <div className="bg-background min-h-screen py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardTitleBlock 
          icon={<CheckSquare size={28} className="text-primary" />}
          title="Performance Log"
          subtitle="Track detailed project scores and status changes over time."
          className="mb-6"
        />
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle>Detailed Project Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This section will display a detailed log of project performance, including CSAT scores, delay days, RAG status changes, and cumulative scores for each CRN.</p>
            <p className="text-sm mt-2">Data will be filterable by CRN ID, SPM, TL, City, and date range.</p>
            <p className="mt-4"><em>(Content for this section is under development. It will likely use the full `project_performance_view` data without aggregation.)</em></p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
