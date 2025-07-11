// src/app/bpl-scm/rules/page.tsx
import { DashboardTitleBlock } from '@/components/bpl/dashboard-title-block';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; 
import { BookOpen, Percent, TrendingUp, Truck, CheckCircle, AlertCircle, FileText } from 'lucide-react'; 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const scoringRules = [
  { event: "Cost Saving Initiative", runs: "+5 Runs", description: "Successfully implementing a cost-saving measure", icon: <TrendingUp className="text-custom-green" /> },
  { event: "On-Time Delivery Rate > 98%", runs: "+4 Runs", description: "Exceeding on-time delivery targets for the month", icon: <Truck className="text-custom-green" /> },
  { event: "Inventory Accuracy > 99%", runs: "+4 Runs", description: "Maintaining high inventory accuracy", icon: <CheckCircle className="text-custom-green" /> },
  { event: "Successful Vendor Negotiation (Cost Reduction)", runs: "+6 Runs", description: "Negotiating better terms or prices with vendors", icon: <Percent className="text-primary" /> },
  { event: "Stock Out / Shortage", runs: "-5 Runs", description: "Item is out of stock, affecting operations", icon: <AlertCircle className="text-custom-red" /> },
  { event: "Delayed Shipment (SCM Fault)", runs: "-3 Runs", description: "Shipment delayed due to internal SCM issues", icon: <Truck className="text-custom-red" /> },
  { event: "Process Automation Implemented", runs: "+8 Runs", description: "Successfully automating a manual SCM process", icon: <FileText className="text-primary" /> },
];

export default function RulesPage() {
  return (
    <div className="bg-background min-h-screen py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardTitleBlock 
          icon={<BookOpen size={28} className="text-primary" />}
          title="BPL SCM: Rules & Scoring"
          subtitle="Understand the scoring for the Supply Chain Management team."
          className="mb-6"
        />
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle>BPL SCM Scoring System - "Runs" Calculation</CardTitle>
            <CardDescription>Each SCM metric can gain or lose “Runs” based on performance and initiatives.</CardDescription>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            
            <div className="overflow-x-auto rounded-md border mt-4">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted hover:bg-muted">
                    <TableHead className="w-[40px] px-3 py-3 text-center">Icon</TableHead>
                    <TableHead className="min-w-[250px] px-4 py-3">Metric / Event</TableHead>
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
            <p>The detailed rules for the BPL SCM League cover various aspects crucial for fair play and transparency. This section will be expanded to include:</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>League Duration & Objective</li>
              <li>KPI Definitions and Data Sources</li>
              <li>Disqualification Criteria</li>
              <li>Prize Distribution Details</li>
              <li>Tiebreaker Rules</li>
              <li>Most Important Terms and Conditions (MITC)</li>
            </ul>
            <p className="mt-4 text-sm italic">Content for these sections is pending and will be updated based on the official BPL SCM guidelines.</p>
            
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
