
// @/app/bpl-sales/rules/page.tsx
// This page is now for BPL Channel Partner Rules
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
  DollarSign,
  UserCheck
} from 'lucide-react';

// Example KPIs - these should be defined based on actual Channel Partner metrics
const partnerTier1Kpis = [
  { kpi: "Qualified Leads Generated", runs: "2" },
  { kpi: "Successful Conversions", runs: "6" },
  { kpi: "High-Value Project Conversion", runs: "24" },
];

const partnerTier2Kpis = [
  { kpi: "New Partner Onboarding", runs: "2" },
  { kpi: "Partner Activation (First Lead)", runs: "6" },
  { kpi: "Consistent Lead Quota Met (Monthly)", runs: "10" },
  { kpi: ">60% Top-Tier Partners with Qualified Meetings", runs: "50" },
];

const partnerActivationKpis = [
  { kpi: "Partner Onboarding & Training Completion", runs: "6" },
];

const partnerEngagementKpis = [
  { kpi: "Regular Engagement (e.g., joint meetings)", runs: "6" },
];

export default function ChannelPartnerRulesPage() {
  return (
    <div className="bg-background min-h-screen py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardTitleBlock 
          icon={<BookOpen size={28} className="text-primary" />}
          title="BPL Channel Partner League: Rules & Guidelines"
          subtitle="Understanding the framework for the Channel Partner Premier League, including scoring and prizes."
          className="mb-6"
        />
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <UserCheck className="text-accent" />
              Channel Partner League Scoring & Prizes
            </CardTitle>
            <CardDescription>Key performance indicators (KPIs), run allocations for partner categories, and prize details.</CardDescription>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none space-y-8">
            
            <div>
              <h3 className="text-xl font-semibold text-primary flex items-center gap-2"><CalendarDays size={20}/>League Period</h3>
              <p className="text-muted-foreground">The BPL Channel Partner League will run from [Start Date Placeholder] to [End Date Placeholder]. All partner activities and achievements contributing to scores must fall within this period.</p>
            </div>

            {/* Partner Performance Tier 1 Section */}
            <div>
              <h3 className="text-xl font-semibold text-primary flex items-center gap-2"><Target size={20}/> Partner Performance Tier 1</h3>
              <p className="text-sm text-muted-foreground mb-3">Focus: High-performing individual partners or lead generation sources.</p>
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader><TableRow><TableHead>KPI</TableHead><TableHead className="text-center w-[100px]">Runs</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {partnerTier1Kpis.map(item => (
                      <TableRow key={item.kpi}><TableCell>{item.kpi}</TableCell><TableCell className="text-center font-semibold">{item.runs}</TableCell></TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Partner Performance Tier 2 Section */}
            <div>
              <h3 className="text-xl font-semibold text-primary flex items-center gap-2"><Award size={20}/> Partner Performance Tier 2</h3>
              <p className="text-sm text-muted-foreground mb-3">Focus: Broader partner network engagement and activation quality.</p>
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader><TableRow><TableHead>KPI / Achievement</TableHead><TableHead className="text-center w-[100px]">Runs</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {partnerTier2Kpis.map(item => (
                      <TableRow key={item.kpi}><TableCell>{item.kpi}</TableCell><TableCell className="text-center font-semibold">{item.runs}</TableCell></TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Partner Activation Metrics Section */}
            <div>
              <h3 className="text-xl font-semibold text-primary flex items-center gap-2"><Zap size={20}/> Partner Activation Metrics</h3>
              <p className="text-sm text-muted-foreground mb-3">Focus: Onboarding and initial engagement of new partners.</p>
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader><TableRow><TableHead>KPI</TableHead><TableHead className="text-center w-[100px]">Runs</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {partnerActivationKpis.map(item => (
                      <TableRow key={item.kpi}><TableCell>{item.kpi}</TableCell><TableCell className="text-center font-semibold">{item.runs}</TableCell></TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Partner Engagement Metrics Section */}
            <div>
              <h3 className="text-xl font-semibold text-primary flex items-center gap-2"><Handshake size={20}/> Partner Engagement Metrics</h3>
              <p className="text-sm text-muted-foreground mb-3">Focus: Ongoing relationship and activity levels with partners.</p>
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader><TableRow><TableHead>KPI</TableHead><TableHead className="text-center w-[100px]">Runs</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {partnerEngagementKpis.map(item => (
                      <TableRow key={item.kpi}><TableCell>{item.kpi}</TableCell><TableCell className="text-center font-semibold">{item.runs}</TableCell></TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            
            {/* Regional Partner Champion Section */}
            <div>
              <h3 className="text-xl font-semibold text-primary flex items-center gap-2"><Flame size={20}/> Regional Partner Champion</h3>
              <p className="text-muted-foreground">
                The Regional Partner Champion is determined by the sum of all runs achieved by partners within a specific city/region.
              </p>
              <p className="text-muted-foreground mt-1">
                Applicable Cities/Regions: BLR1/2/3, CHE, HYD, Gurgaon, Noida, Pune. (Example)
              </p>
              <p className="mt-2 text-foreground"><strong>Runs Calculation:</strong> Sum of all individual partner scores within the designated region.</p>
            </div>

            {/* Prizes Section */}
            <div>
              <h3 className="text-xl font-semibold text-primary flex items-center gap-2"><Trophy size={20}/> Prizes</h3>
              <Card className="mt-3 border-accent bg-accent/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                    <Star size={18} className="text-primary" /> Best Performing Region/City Award
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-foreground flex items-center">
                    <Trophy size={18} className="inline-block mr-2 text-primary" /> Trophy + ₹50,000 fund for Celebration
                  </p>
                  <p className="text-sm text-foreground mt-1">Awarded to the city/region with the highest total runs from its channel partners.</p>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-primary flex items-center gap-2"><AlertTriangle size={20}/>General Terms & Conditions</h3>
               <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>All partner activities and achievements must be verifiable and adhere to company policies and partnership agreements.</li>
                <li>Any unethical practices, misrepresentation of data, or manipulation of league mechanics will lead to disqualification.</li>
                <li>The management reserves the right to modify rules, scoring, or prize distribution in exceptional circumstances, with prior notification to all participants.</li>
                <li>Dispute resolution mechanisms will be outlined by the league organizers. All decisions by the organizing committee will be final.</li>
              </ul>
            </div>
            <p className="mt-6 text-center font-semibold text-primary/80">
              Further details regarding specific data tracking methodologies and reporting for Channel Partners will be provided. Stay tuned!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

