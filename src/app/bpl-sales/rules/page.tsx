// @/app/bpl-sales/rules/page.tsx
import { DashboardTitleBlock } from '@/components/bpl/dashboard-title-block';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; 
import { BookOpen, Target, Percent, CalendarDays, AlertTriangle } from 'lucide-react';

export default function SalesRulesPage() {
  return (
    <div className="bg-background min-h-screen py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardTitleBlock 
          icon={<BookOpen size={28} className="text-primary" />}
          title="BPL Sales League: Rules & Guidelines"
          subtitle="Understanding the framework for the Sales Premier League."
          className="mb-6"
        />
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="text-accent" />
              Sales League Rules Overview
            </CardTitle>
            <CardDescription>Key principles and regulations governing the BPL Sales competition.</CardDescription>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none space-y-6">
            
            <div>
              <h3 className="text-xl font-semibold text-primary flex items-center gap-2"><CalendarDays size={20}/>League Period</h3>
              <p>The BPL Sales League will run from [Start Date Placeholder] to [End Date Placeholder]. All sales activities and achievements contributing to scores must fall within this period.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-primary flex items-center gap-2"><Percent size={20}/>Scoring System (Conceptual)</h3>
              <p>Detailed scoring metrics for the sales league are currently under development. Points will likely be awarded based on criteria such as:</p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Number of deals closed.</li>
                <li>Total revenue generated.</li>
                <li>Meeting or exceeding sales targets.</li>
                <li>Conversion rates.</li>
                <li>New client acquisitions.</li>
                <li>Specific product/service sales pushes.</li>
              </ul>
              <p className="mt-2 text-sm italic">The finalized scoring rubric will be communicated by the sales leadership team. This section will be updated accordingly.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-primary">Participant Categories</h3>
              <p>The league will have specific categories and leaderboards for roles including:</p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>OS (Outside Sales)</li>
                <li>CP OS - Platinum (Channel Partner Outside Sales - Platinum Tier)</li>
                <li>IS Activation (Inside Sales Activation)</li>
                <li>CP IS (Channel Partner Inside Sales)</li>
                <li>City Champion (Top performer within a specific city/region)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-primary flex items-center gap-2"><AlertTriangle size={20}/>General Terms & Conditions</h3>
               <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>All sales must be validated and adhere to company policies.</li>
                <li>Any unethical practices or misrepresentation of sales figures will lead to disqualification.</li>
                <li>The management reserves the right to modify rules or scoring in exceptional circumstances, with prior notification.</li>
                <li>Dispute resolution mechanisms will be outlined by the league organizers.</li>
              </ul>
            </div>
            <p className="mt-6 text-center font-semibold text-accent">
              Further details, including specific targets, bonus structures, and data tracking methodologies, will be provided soon.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
