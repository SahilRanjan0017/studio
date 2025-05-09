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
  { rank: 1, name: "Vijayraj S", initials: "VS", role: "SPM", city: "Chennai", projects: 11, status: "Green", runs: 96, trend: 11 },
  { rank: 2, name: "Praveen Sivakumar", initials: "PS", role: "SPM", city: "Chennai", projects: 11, status: "Green", runs: 92, trend: 10 },
  { rank: 3, name: "Mohammed Basil", initials: "MB", role: "SPM", city: "Chennai", projects: 8, status: "Green", runs: 90, trend: 9 },
  { rank: 4, name: "Sai Ram D", initials: "SRD", role: "SPM", city: "Chennai", projects: 9, status: "Green", runs: 85, trend: 8 },
  { rank: 5, name: "Jallel N", initials: "JN", role: "SPM", city: "Chennai", projects: 10, status: "Green", runs: 85, trend: 7 },
  { rank: 6, name: "Yudhish Kumar", initials: "SRD", role: "SPM", city: "Hydrabad", projects: 9, status: "Green", runs: 84, trend: 6 },
  { rank: 7, name: "Khaja Fateh Mohd", initials: "SRD", role: "SPM", city: "Hydrabad", projects: 11, status: "Green", runs: 80, trend: 5 },
  { rank: 8, name: "Mulla Reddy", initials: "SRD", role: "SPM", city: "Hydrabad", projects: 11, status: "Green", runs: 79, trend: 4 },
  { rank: 9, name: "Jegannathan Gunasekaran", initials: "SRD", role: "Chennai", city: "Chennai", projects: 7, status: "Green", runs: 78, trend: 3 },
  { rank: 10, name: "Aman S", initials: "SRD", role: "SPM", city: "NCR", projects: 8, status: "Green", runs: 74, trend: 2 },
  { rank: 11, name: "Voora Tarun Kumar", initials: "SRD", role: "SPM", city: "Hydrabad", projects: 9, status: "Green", runs: 70, trend: 1 },

];

const tlData: Player[] = [ // Dummy data for TL
  { rank: 1, name: "Raghumaran R", initials: "RR", role: "TL", city: "Chennai", projects: 27, status: "Green", runs: 90, trend: 8 },
  { rank: 2, name: "Jonathan Emmanuel", initials: "JE", role: "TL", city: "Chennai", projects: 26, status: "Green", runs: 85, trend: 5 },
  { rank: 3, name: "Vankalaya Sai", initials: "VS", role: "TL", city: "Hydrabad", projects: 28, status: "Green", runs: 80, trend: 4 },
  { rank: 4, name: "Koduganti Akhil", initials: "KA", role: "TL", city: "Hydrabad", projects: 27, status: "Green", runs: 75, trend: 3 },
  { rank: 5, name: "Rajesh Kumar", initials: "RK", role: "TL", city: "Hydrabad", projects: 41, status: "Green", runs: 70, trend: 2 },


];

const omData: Player[] = [ // Dummy data for OM
  { rank: 1, name: "Manikandan", initials: "OM", role: "OM", city: "Chennai", projects: 125, status: "Green", runs: 70, trend: 8 },
  { rank: 2, name: "Akash", initials: "OM", role: "OM", city: "Bangalore", projects: 286, status: "Green", runs: 65, trend: 6 },
  { rank: 3, name: "Sai Mahesh", initials: "OM", role: "OM", city: "Hydrabad", projects: 108, status: "Green", runs: 60, trend: 5 },

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
