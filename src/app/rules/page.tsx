// src/app/rules/page.tsx
import { DashboardTitleBlock } from '@/components/bpl/dashboard-title-block';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

export default function RulesPage() {
  return (
    <div className="bg-background min-h-screen py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardTitleBlock 
          icon={<BookOpen size={28} className="text-primary" />}
          title="League Rules"
          subtitle="Understand the scoring, participation criteria, and rewards."
          className="mb-6"
        />
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle>BPL Rules & Regulations</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none dark:prose-invert">
            <p>The detailed rules for the Brick & Bolt Premier League will be outlined here. This section will cover:</p>
            <ul>
              <li>League Duration</li>
              <li>Objective</li>
              <li>League Structure & Teams (SPM, TL, OM)</li>
              <li>Scoring System (Runs Calculation for project status changes)</li>
              <li>Additional Bonuses (Attendance, Time on Site, Testimonials, Customer Delight Meetings)</li>
              <li>Disqualification Criteria</li>
              <li>Prize Distribution</li>
              <li>Tiebreaker Rules</li>
              <li>Most Important Terms and Conditions (MITC)</li>
            </ul>
            <p><em>Content for this section is pending and will be updated based on the BPL guidelines provided in the BPL Word document or other official sources.</em></p>
            
            <h3 className="mt-6 text-lg font-semibold">Example: Scoring System (Runs Calculation)</h3>
            <p><strong>Project Status Changes (Runs Earned/Deducted):</strong></p>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status Change</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Runs</th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  <tr><td className="px-4 py-2 whitespace-nowrap text-sm">Red → Amber</td><td className="px-4 py-2 whitespace-nowrap text-sm">+4</td></tr>
                  <tr><td className="px-4 py-2 whitespace-nowrap text-sm">Red → Green</td><td className="px-4 py-2 whitespace-nowrap text-sm">+6</td></tr>
                  <tr><td className="px-4 py-2 whitespace-nowrap text-sm">Amber → Green</td><td className="px-4 py-2 whitespace-nowrap text-sm">+2</td></tr>
                  <tr><td className="px-4 py-2 whitespace-nowrap text-sm">Green → Red</td><td className="px-4 py-2 whitespace-nowrap text-sm text-destructive">-6</td></tr>
                  <tr><td className="px-4 py-2 whitespace-nowrap text-sm">Amber → Red</td><td className="px-4 py-2 whitespace-nowrap text-sm text-destructive">-4</td></tr>
                  <tr><td className="px-4 py-2 whitespace-nowrap text-sm">Green → Amber</td><td className="px-4 py-2 whitespace-nowrap text-sm text-destructive">-2</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4">Please refer to the complete BPL documentation for all rules.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
