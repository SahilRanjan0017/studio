// @/components/bpl/leaderboard-table.tsx
'use client';

import { useState } from 'react';
import { Trophy, ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar'; // ShadCN Avatar
import { Badge } from '@/components/ui/badge'; // ShadCN Badge
import { cn } from '@/lib/utils';

type Player = {
  rank: number;
  name: string;
  initials: string;
  role: string;
  city: string;
  projects: number;
  status: 'Green' | 'Amber' | 'Red';
  runs: number;
  trend: number;
};

const spmData: Player[] = [
  { rank: 1, name: "Rahul Sharma", initials: "RS", role: "SPM", city: "Bangalore", projects: 12, status: "Green", runs: 86, trend: 6 },
  { rank: 2, name: "Priya Kapoor", initials: "PK", role: "SPM", city: "Delhi NCR", projects: 10, status: "Green", runs: 78, trend: 4 },
  { rank: 3, name: "Amit Joshi", initials: "AJ", role: "SPM", city: "Pune", projects: 8, status: "Green", runs: 72, trend: 2 },
  { rank: 4, name: "Suresh Kumar", initials: "SK", role: "SPM", city: "Chennai", projects: 9, status: "Amber", runs: 65, trend: -1 },
];

const tlData: Player[] = [ // Dummy data for TL
  { rank: 1, name: "Team Lead Alpha", initials: "TA", role: "TL", city: "Hyderabad", projects: 15, status: "Green", runs: 92, trend: 8 },
  { rank: 2, name: "Team Lead Beta", initials: "TB", role: "TL", city: "Bangalore", projects: 11, status: "Green", runs: 80, trend: 3 },
];

const omData: Player[] = [ // Dummy data for OM
  { rank: 1, name: "Operations Master", initials: "OM", role: "OM", city: "Pune", projects: 20, status: "Green", runs: 95, trend: 5 },
];

const roleDataMap = {
  spm: spmData,
  tl: tlData,
  om: omData,
};

export function LeaderboardTable() {
  const [activeTab, setActiveTab] = useState<'spm' | 'tl' | 'om'>('spm');
  const currentData = roleDataMap[activeTab];

  const getStatusBadgeVariant = (status: Player['status']): "default" | "destructive" | "outline" => {
    if (status === 'Green') return 'default'; // default will use primary color (blueish), consider custom variant or class
    if (status === 'Amber') return 'outline'; // orange-like, often used for warnings
    if (status === 'Red') return 'destructive';
    return 'default';
  };
  
  const getStatusBadgeClass = (status: Player['status']): string => {
    if (status === 'Green') return 'bg-custom-green text-white';
    if (status === 'Amber') return 'bg-custom-amber text-white';
    if (status === 'Red') return 'bg-custom-red text-white';
    return '';
  }


  return (
    <Card className="shadow-xl animate-fadeInUp mb-8">
      <CardHeader className="border-b pb-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <Trophy size={28} className="text-accent" />
            <h3 className="text-2xl font-semibold text-primary">BPL Leaderboard</h3>
          </div>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'spm' | 'tl' | 'om')} className="w-full md:w-auto">
            <TabsList className="grid w-full grid-cols-3 md:w-auto">
              <TabsTrigger value="spm">SPM</TabsTrigger>
              <TabsTrigger value="tl">TL</TabsTrigger>
              <TabsTrigger value="om">OM</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">City</TableHead>
                <TableHead className="text-center hidden sm:table-cell">Projects</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Runs</TableHead>
                <TableHead className="text-right hidden sm:table-cell">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((player) => (
                <TableRow key={player.rank}>
                  <TableCell>
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center font-bold text-white",
                      player.rank <= 3 ? "bg-accent" : "bg-primary"
                    )}>
                      {player.rank}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-muted text-muted-foreground font-semibold">{player.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-foreground">{player.name}</div>
                        <div className="text-xs text-muted-foreground">{player.role}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{player.city}</TableCell>
                  <TableCell className="text-center hidden sm:table-cell">{player.projects}</TableCell>
                  <TableCell className="text-center">
                     <Badge variant={getStatusBadgeVariant(player.status)} className={cn("text-xs", getStatusBadgeClass(player.status))}>
                        {player.status}
                     </Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold text-lg text-foreground">{player.runs}</TableCell>
                  <TableCell className="text-right hidden sm:table-cell">
                    <span className={`flex items-center justify-end gap-1 text-sm ${player.trend >= 0 ? 'text-custom-green' : 'text-custom-red'}`}>
                      {player.trend >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                      {Math.abs(player.trend)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
