// src/app/rules/page.tsx
import { DashboardTitleBlock } from '@/components/bpl/dashboard-title-block';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, TrendingUp, TrendingDown, CheckCircle, FolderCheck, MessageSquare } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const scoringRules = [
  { event: "🔴 Red → 🟠 Amber", runs: "+4 Runs", description: "Improvement in project status", icon: <TrendingUp className="text-custom-amber" /> },
  { event: "🔴 Red → 🟢 Green", runs: "+6 Runs", description: "Excellent recovery", icon: <TrendingUp className="text-custom-green" /> },
  { event: "🟠 Amber → 🟢 Green", runs: "+2 Runs", description: "Moderate improvement", icon: <TrendingUp className="text-custom-green" /> },
  { event: "🟢 Green → 🔴 Red", runs: "-6 Runs", description: "Major decline", icon: <TrendingDown className="text-custom-red" /> },
  { event: "🟠 Amber → 🔴 Red", runs: "-4 Runs", description: "Status worsened", icon: <TrendingDown className="text-custom-red" /> },
  { event: "🟢 Green → 🟠 Amber", runs: "-2 Runs", description: "Slight decline", icon: <TrendingDown className="text-custom-amber" /> },
  { event: "🟢 New Projects (Stays Green for 45 days from 1 May 2025)", runs: "+6 Runs", description: "Rewarded for maintaining green status in the first 45 days", icon: <CheckCircle className="text-custom-green" /> },
  { event: "🟢 New Projects → 🟠 Amber", runs: "0 Runs", description: "No reward for early drop in status", icon: <AlertCircle className="text-custom-amber" /> }, // Assuming AlertCircle or similar
  { event: "✅ Customer Delight Meeting (SPM-led)", runs: "+6 Runs", description: "Customer engagement milestone", icon: <Users className="text-primary" /> }, // Users or Smile
  { event: "📝 Customer Testimonial Received", runs: "+6 Runs", description: "Positive client feedback", icon: <MessageSquare className="text-primary" /> },
  { event: "📁 Project Handed Over (HO)", runs: "+6 Runs", description: "Project successfully handed over", icon: <FolderCheck className="text-primary" /> },
];

// Dummy icons for placeholders, replace if better ones exist or if not needed
const AlertCircle = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;
const Users = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;


export default function RulesPage() {
  return (
    <div className="bg-background min-h-screen py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardTitleBlock 
          icon={<BookOpen size={28} className="text-primary" />}
          title="League Rules & Scoring"
          subtitle="Understand the scoring, participation criteria, and how runs are calculated."
          className="mb-6"
        />
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle>BPL Scoring System - "Runs" Calculation</CardTitle>
            <CardDescription>Each project can gain or lose “Runs” based on status transitions and achievements.</CardDescription>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            
            <div className="overflow-x-auto rounded-md border mt-4">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted hover:bg-muted">
                    <TableHead className="w-[40px] px-3 py-3 text-center">Icon</TableHead>
                    <TableHead className="min-w-[250px] px-4 py-3">Status / Event</TableHead>
                    <TableHead className="px-4 py-3 text-center">Runs</TableHead>
                    <TableHead className="px-4 py-3">Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scoringRules.map((rule, index) => (
                    <TableRow key={index} className="hover:bg-muted/50">
                      <TableCell className="px-3 py-3 text-center">{rule.icon}</TableCell>
                      <TableCell className="px-4 py-3 font-medium">{rule.event}</TableCell>
                      <TableCell className={`px-4 py-3 text-center font-semibold ${rule.runs.startsWith('+') ? 'text-custom-green' : rule.runs.startsWith('-') ? 'text-custom-red' : 'text-foreground'}`}>
                        {rule.runs}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm text-muted-foreground">{rule.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <h3 className="mt-8 text-xl font-semibold text-primary">General League Rules</h3>
            <p>The detailed rules for the Brick & Bolt Premier League cover various aspects crucial for fair play and transparency. This section will be expanded to include:</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>League Duration</li>
              <li>Overall Objective</li>
              <li>League Structure & Teams (SPM, TL, OM participation)</li>
              <li>Additional Bonuses (e.g., Attendance, Time on Site, specific KPIs)</li>
              <li>Disqualification Criteria</li>
              <li>Prize Distribution Details (beyond the Rewards page)</li>
              <li>Tiebreaker Rules</li>
              <li>Most Important Terms and Conditions (MITC)</li>
            </ul>
            <p className="mt-4 text-sm italic">Content for these sections is pending and will be updated based on the official BPL guidelines. Please refer to the complete BPL documentation for all rules.</p>
            
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
