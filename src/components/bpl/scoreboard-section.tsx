// @/components/bpl/scoreboard-section.tsx
'use client';

import { useState } from 'react';
import { BarChart3, Building, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { StatCard } from './stat-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const roles = [
  { value: "all", label: "All Roles" },
  { value: "spm", label: "SPM" },
  { value: "tl", label: "TL" },
  { value: "om", label: "OM" },
];

const periods = [
  { value: "weekly", label: "This Week" },
  { value: "monthly", label: "This Month" },
  { value: "overall", label: "Overall" },
];

export function ScoreboardSection() {
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("weekly");

  // Dummy data - replace with actual data fetching and processing
  const statsData = [
    { title: "Active Projects", value: 128, icon: <Building size={24} />, iconBgColor: "bg-custom-green", changeText: "+12 from last month", changeType: "positive" as const },
    { title: "Green Projects", value: 84, icon: <CheckCircle2 size={24} />, iconBgColor: "bg-custom-green", changeText: "65% of total", changeType: "positive" as const },
    { title: "Amber Projects", value: 32, icon: <AlertTriangle size={24} />, iconBgColor: "bg-custom-amber", changeText: "25% of total", changeType: "neutral" as const },
    { title: "Red Projects", value: 12, icon: <XCircle size={24} />, iconBgColor: "bg-custom-red", changeText: "-4 from last month", changeType: "negative" as const },
  ];

  return (
    <Card className="shadow-xl animate-fadeInUp mb-8">
      <CardHeader className="border-b pb-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <BarChart3 size={28} className="text-primary" />
            <h3 className="text-2xl font-semibold text-primary">Performance Scoreboard</h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full sm:w-[150px] h-9">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-full sm:w-[150px] h-9">
                <SelectValue placeholder="Select Period" />
              </SelectTrigger>
              <SelectContent>
                {periods.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              iconBgColor={stat.iconBgColor}
              changeText={stat.changeText}
              changeType={stat.changeType}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
