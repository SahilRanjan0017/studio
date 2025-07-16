
// src/app/bpl-sales/rules/page.tsx
import { DashboardTitleBlock } from '@/components/bpl/dashboard-title-block';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; 
import { BookOpen, User, Users, UserCheck, Target } from 'lucide-react'; 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const meScoringRules = [
  { kpi: "Management Contacts (Valid)", runs: "4" },
  { kpi: "New Site Added with Details", runs: "1" },
];

const isScoringRules = [
  { kpi: "High Tea Done (Orange Circle) per attendee", runs: "1" },
  { kpi: "CEM Meetings", runs: "6" },
  { kpi: "Normal M2C Meetings Done (Non - Orange Circle)", runs: "4" },
];

const mitraOsScoringRules = [
  { kpi: "Management Meeting - CP Onboarded", runs: "6" },
  { kpi: "High Tea Done (More than 10) - online", runs: "6" },
  { kpi: "High Tea Done (More than 20) - online", runs: "12" },
  { kpi: "High Tea Done (More than 10) - offline", runs: "12" },
  { kpi: "High Tea Done (More than 20) - offline", runs: "24" },
  { kpi: "CEM Done", runs: "6" },
  { kpi: "per 5 Lacs of GMV", runs: "1" },
];

const osScoringRules = [
  { kpi: "per 2 Lacs of GMV", runs: "1" },
];

export default function RulesPage() {
  return (
    <div className="bg-background min-h-screen py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardTitleBlock 
          icon={<BookOpen size={28} className="text-primary" />}
          title="BPL Sales: Rules & Scoring"
          subtitle="Understand the scoring, participation criteria, and how runs are calculated for the sales team."
          className="mb-6"
        />
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle>BPL Sales Scoring System - "Runs" Calculation</CardTitle>
            <CardDescription>Each sales activity gains “Runs” based on outcomes and achievements specific to each role.</CardDescription>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none space-y-8">
            
            <div>
              <h3 className="text-xl font-semibold text-primary flex items-center gap-2"><User size={20}/> ME Scoring</h3>
              <div className="overflow-x-auto rounded-md border mt-2">
                <Table>
                  <TableHeader><TableRow><TableHead>KPI / Event</TableHead><TableHead className="text-center w-[100px]">Runs</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {meScoringRules.map(item => (
                      <TableRow key={item.kpi}><TableCell>{item.kpi}</TableCell><TableCell className="text-center font-semibold text-custom-green">+{item.runs}</TableCell></TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-primary flex items-center gap-2"><Users size={20}/> IS Scoring</h3>
              <div className="overflow-x-auto rounded-md border mt-2">
                <Table>
                  <TableHeader><TableRow><TableHead>KPI / Event</TableHead><TableHead className="text-center w-[100px]">Runs</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {isScoringRules.map(item => (
                      <TableRow key={item.kpi}><TableCell>{item.kpi}</TableCell><TableCell className="text-center font-semibold text-custom-green">+{item.runs}</TableCell></TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-primary flex items-center gap-2"><UserCheck size={20}/> Mitra OS Scoring</h3>
              <div className="overflow-x-auto rounded-md border mt-2">
                <Table>
                  <TableHeader><TableRow><TableHead>KPI / Event</TableHead><TableHead className="text-center w-[100px]">Runs</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {mitraOsScoringRules.map(item => (
                      <TableRow key={item.kpi}><TableCell>{item.kpi}</TableCell><TableCell className="text-center font-semibold text-custom-green">+{item.runs}</TableCell></TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-primary flex items-center gap-2"><Target size={20}/> OS Scoring</h3>
              <div className="overflow-x-auto rounded-md border mt-2">
                <Table>
                  <TableHeader><TableRow><TableHead>KPI / Event</TableHead><TableHead className="text-center w-[100px]">Runs</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {osScoringRules.map(item => (
                      <TableRow key={item.kpi}><TableCell>{item.kpi}</TableCell><TableCell className="text-center font-semibold text-custom-green">+{item.runs}</TableCell></TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <h3 className="mt-8 text-xl font-semibold text-primary">General League Rules</h3>
            <p>The detailed rules for the BPL Sales League cover various aspects crucial for fair play and transparency. This section will be expanded to include:</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>League Duration</li>
              <li>Overall Objective</li>
              <li>League Structure & Teams</li>
              <li>Additional Bonuses (e.g., meeting quotas, CRM hygiene)</li>
              <li>Disqualification Criteria</li>
              <li>Prize Distribution Details</li>
              <li>Tiebreaker Rules</li>
              <li>Most Important Terms and Conditions (MITC)</li>
            </ul>
            <p className="mt-4 text-sm italic">Content for these sections is pending and will be updated based on the official BPL Sales guidelines.</p>
            
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
