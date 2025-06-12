// @/app/bpl-sales/rules/page.tsx
import { DashboardTitleBlock } from '@/components/bpl/dashboard-title-block';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  BookOpen, 
  Target, 
  Award, 
  Zap, 
  Handshake, 
  Flame, 
  Trophy, 
  Star, 
  Users, 
  CalendarDays, 
  AlertTriangle,
  DollarSign
} from 'lucide-react';

const osKpis = [
  { kpi: "1st Qualified Meeting", runs: "2" },
  { kpi: "CEM", runs: "6" },
  { kpi: "Conversion", runs: "24" },
];

const cpOsKpis = [
  { kpi: "1st Meeting", runs: "2" },
  { kpi: "1st Qualified Meeting", runs: "6" },
  { kpi: "For every CP activation with atleast 10 leads", runs: "2" },
  { kpi: "For every CP activation with atleast 1 1st meeting", runs: "4" },
  { kpi: "For every CP activation with atleast 1 qualified meeting", runs: "6" },
  { kpi: ">60% Platinum CPs with atleast 1 qualified meeting", runs: "50" },
  { kpi: ">60% Gold CPs with atleast 10 lead per CP", runs: "50" },
  { kpi: ">20% Gold CPs with atleast 1 qualified meeting", runs: "50" },
];

const isActivationKpis = [
  { kpi: "# of CP onboarding", runs: "6" },
];

const cpIsKpis = [
  { kpi: "# 1st meetings", runs: "6" },
];

export default function SalesRulesPage() {
  return (
    <div className="bg-background min-h-screen py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardTitleBlock 
          icon={<BookOpen size={28} className="text-primary" />}
          title="BPL Sales League: Rules & Guidelines"
          subtitle="Understanding the framework for the Sales Premier League, including scoring and prizes."
          className="mb-6"
        />
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="text-accent" />
              Sales League Scoring & Prizes
            </CardTitle>
            <CardDescription>Key performance indicators (KPIs), run allocations for participant categories, and prize details.</CardDescription>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none space-y-8">
            
            <div>
              <h3 className="text-xl font-semibold text-primary flex items-center gap-2"><CalendarDays size={20}/>League Period</h3>
              <p>The BPL Sales League will run from [Start Date Placeholder] to [End Date Placeholder]. All sales activities and achievements contributing to scores must fall within this period.</p>
            </div>

            {/* OS Section */}
            <div>
              <h3 className="text-xl font-semibold text-primary flex items-center gap-2"><Target size={20}/> Outside Sales (OS)</h3>
              <p className="text-sm text-muted-foreground mb-3">Participants: 8</p>
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader><TableRow><TableHead>KPI</TableHead><TableHead className="text-center w-[100px]">Runs</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {osKpis.map(item => (
                      <TableRow key={item.kpi}><TableCell>{item.kpi}</TableCell><TableCell className="text-center font-semibold">{item.runs}</TableCell></TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* CP OS Section */}
            <div>
              <h3 className="text-xl font-semibold text-primary flex items-center gap-2"><Award size={20}/> Channel Partner Outside Sales (CP OS)</h3>
              <p className="text-sm text-muted-foreground mb-3">Participants: 8 Platinum + 22 Gold (Total 30)</p>
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader><TableRow><TableHead>KPI / Achievement</TableHead><TableHead className="text-center w-[100px]">Runs</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {cpOsKpis.map(item => (
                      <TableRow key={item.kpi}><TableCell>{item.kpi}</TableCell><TableCell className="text-center font-semibold">{item.runs}</TableCell></TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* IS Activation Section */}
            <div>
              <h3 className="text-xl font-semibold text-primary flex items-center gap-2"><Zap size={20}/> Inside Sales Activation (IS Activation)</h3>
              <p className="text-sm text-muted-foreground mb-3">Participants: 30</p>
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader><TableRow><TableHead>KPI</TableHead><TableHead className="text-center w-[100px]">Runs</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {isActivationKpis.map(item => (
                      <TableRow key={item.kpi}><TableCell>{item.kpi}</TableCell><TableCell className="text-center font-semibold">{item.runs}</TableCell></TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* CP IS Section */}
            <div>
              <h3 className="text-xl font-semibold text-primary flex items-center gap-2"><Handshake size={20}/> Channel Partner Inside Sales (CP IS)</h3>
              <p className="text-sm text-muted-foreground mb-3">Participants: 37</p>
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader><TableRow><TableHead>KPI</TableHead><TableHead className="text-center w-[100px]">Runs</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {cpIsKpis.map(item => (
                      <TableRow key={item.kpi}><TableCell>{item.kpi}</TableCell><TableCell className="text-center font-semibold">{item.runs}</TableCell></TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            
            {/* City Champion Section */}
            <div>
              <h3 className="text-xl font-semibold text-primary flex items-center gap-2"><Flame size={20}/> City Champion (OS + CP)</h3>
              <p className="text-muted-foreground">
                The City Champion is determined by the sum of all runs achieved by OS and CP OS participants within a specific city.
              </p>
              <p className="text-muted-foreground mt-1">
                Applicable Cities: BLR1/2/3, CHE, HYD, Gurgaon, Noida, Pune.
              </p>
              <p className="mt-2"><strong>Runs Calculation:</strong> Sum of all individual OS & CP OS scores within the designated city.</p>
            </div>

            {/* Prizes Section */}
            <div>
              <h3 className="text-xl font-semibold text-primary flex items-center gap-2"><Trophy size={20}/> Prizes</h3>
              <Card className="mt-3 border-accent bg-accent/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2 text-accent-foreground">
                    <Star size={18} className="text-primary" /> Best City Award
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-accent-foreground">🏆 Trophy + ₹50,000 fund for Celebration</p>
                  <p className="text-sm text-muted-foreground mt-1">Awarded to the city with the highest total runs from OS and CP OS participants.</p>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-primary flex items-center gap-2"><AlertTriangle size={20}/>General Terms & Conditions</h3>
               <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>All sales activities and achievements must be verifiable and adhere to company policies.</li>
                <li>Any unethical practices, misrepresentation of data, or manipulation of league mechanics will lead to disqualification.</li>
                <li>The management reserves the right to modify rules, scoring, or prize distribution in exceptional circumstances, with prior notification to all participants.</li>
                <li>Dispute resolution mechanisms will be outlined by the league organizers. All decisions by the organizing committee will be final.</li>
              </ul>
            </div>
            <p className="mt-6 text-center font-semibold text-primary/80">
              Further details regarding specific data tracking methodologies and reporting will be provided. Stay tuned!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

