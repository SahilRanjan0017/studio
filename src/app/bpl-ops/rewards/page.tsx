
// src/app/bpl-ops/rewards/page.tsx
import React from 'react';
import { DashboardTitleBlock } from '@/components/bpl/dashboard-title-block';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Award, Trophy, DollarSign, User, Users, Briefcase } from 'lucide-react';

const spmRewards = [
  { rank: "1", reward: "₹25,000" },
  { rank: "2", reward: "₹15,000" },
  { rank: "3", reward: "₹12,000" },
  { rank: "4", reward: "₹10,000" },
  { rank: "5", reward: "₹7,000" },
  { rank: "6-11", reward: "₹5,000 each" },
];

const tlRewards = [
  { rank: "1", reward: "₹25,000" },
  { rank: "2", reward: "₹15,000" },
  { rank: "3", reward: "₹12,000" },
  { rank: "4", reward: "₹10,000" },
];

interface RewardTier {
  rank: string;
  reward: string;
}

interface RoleRewardProps {
  title: string;
  icon: React.ReactNode;
  rewards: RewardTier[] | { rank: string; reward: string };
  totalReward?: string;
  borderColorClass: string; // Changed from bgColorClass to borderColorClass
  bgColorClass?: string; // Optional background for card content if needed
  iconBgClass: string; // Specific for icon background circle
  iconColorClass: string; // Specific for icon color
  titleColorClass: string; // Specific for title text color
}

function RoleRewardCard({ title, icon, rewards, totalReward, borderColorClass, bgColorClass, iconBgClass, iconColorClass, titleColorClass }: RoleRewardProps) {
  return (
    <Card className={`shadow-lg rounded-xl overflow-hidden border-l-4 ${borderColorClass} ${bgColorClass || 'bg-card'}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${iconBgClass}`}>
            {React.cloneElement(icon as React.ReactElement, { className: `h-6 w-6 ${iconColorClass}` })}
          </div>
          <CardTitle className={`text-xl font-bold ${titleColorClass}`}>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {Array.isArray(rewards) ? (
          <>
            <Table className="mb-3">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] text-muted-foreground">🥇 Rank</TableHead>
                  <TableHead className="text-muted-foreground">💸 Reward</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rewards.map((item) => (
                  <TableRow key={item.rank}>
                    <TableCell className="font-medium text-foreground">{item.rank}</TableCell>
                    <TableCell className="text-foreground">{item.reward}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {totalReward && (
              <p className={`text-right font-semibold text-lg ${titleColorClass}`}>
                ✨ Total Reward: {totalReward}
              </p>
            )}
          </>
        ) : (
          <div className="text-lg text-foreground">
            <span className="font-medium">🥇 Rank {rewards.rank}:</span>
            <span className={`font-bold ml-2 ${titleColorClass}`}>{rewards.reward}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function RewardsPage() {
  return (
    <div className="bg-background min-h-screen py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardTitleBlock 
          icon={<Trophy size={32} className="text-primary animate-pulse-scale" />} // text-primary (red)
          title="🏆 Performance Rewards Breakdown"
          subtitle="Celebrate excellence, encourage performance! Your hard work deserves recognition and reward!"
          className="mb-10"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <RoleRewardCard
            title="Top Performers - Site Project Managers (SPMs)"
            icon={<User />}
            rewards={spmRewards}
            totalReward="₹99,000+"
            borderColorClass="border-primary" // Red border
            iconBgClass="bg-primary/10" // Light red bg for icon
            iconColorClass="text-primary" // Red icon
            titleColorClass="text-primary" // Red title
          />
          <RoleRewardCard
            title="Top Performers - Team Leaders (TLs)"
            icon={<Users />}
            rewards={tlRewards}
            totalReward="₹62,000+"
            borderColorClass="border-secondary" // Teal border
            iconBgClass="bg-secondary/20" // Light teal bg for icon
            iconColorClass="text-secondary-foreground" // Dark text on teal for icon
            titleColorClass="text-secondary-foreground" // Dark text on teal for title
          />
          <RoleRewardCard
            title="Top Performer - Vendor Manager (VM)"
            icon={<Briefcase />}
            rewards={{ rank: "1", reward: "₹25,000+" }}
            borderColorClass="border-foreground" // Dark Charcoal border
            iconBgClass="bg-foreground/10" // Light Dark Charcoal bg for icon
            iconColorClass="text-foreground" // Dark Charcoal icon
            titleColorClass="text-foreground" // Dark Charcoal title
          /> 
          <RoleRewardCard
            title="Top Performer - Sourcing Executive"
            icon={<DollarSign />}
            rewards={{ rank: "1", reward: "₹25,000+" }}
            borderColorClass="border-primary" // Red border
            iconBgClass="bg-primary/10" // Light red bg for icon
            iconColorClass="text-primary" // Red icon
            titleColorClass="text-primary" // Red title
          />
        </div>

        <Card className="shadow-xl rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground p-6 text-center">
          <CardHeader>
            <div className="flex items-center justify-center gap-3 mb-2">
              <Award size={36} className="text-primary-foreground"/> {/* Adjusted to primary-foreground for visibility on gradient */}
              <CardTitle className="text-3xl font-extrabold">💰 Total Reward Pool</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold mb-4">₹5,00,000+</p>
            <p className="text-lg opacity-90">🎉 Celebrate excellence, encourage performance! 🚀</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
