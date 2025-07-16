// src/app/bpl-scm/rewards/page.tsx
import React from 'react';
import { DashboardTitleBlock } from '@/components/bpl/dashboard-title-block';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Award, User, Users, Truck, Warehouse } from 'lucide-react';
import { TrophyIcon } from '@/components/icons/TrophyIcon';

const procurementRewards = [
  { rank: "1", reward: "₹25,000" },
  { rank: "2", reward: "₹15,000" },
  { rank: "3", reward: "₹12,000" },
];

const logisticsRewards = [
  { rank: "1", reward: "₹25,000" },
  { rank: "2", reward: "₹15,000" },
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
  borderColorClass: string; 
  iconBgClass: string; 
  iconColorClass: string; 
  titleColorClass: string; 
}

function RoleRewardCard({ title, icon, rewards, totalReward, borderColorClass, iconBgClass, iconColorClass, titleColorClass }: RoleRewardProps) {
  return (
    <Card className={`shadow-lg rounded-xl overflow-hidden border-l-4 ${borderColorClass} bg-card`}>
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
                  <TableHead className="w-[100px] text-muted-foreground">Rank</TableHead>
                  <TableHead className="text-muted-foreground">Reward</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rewards.map((item, index) => (
                  <TableRow key={item.rank + '-' + index}>
                    <TableCell className="font-medium text-foreground">{item.rank}</TableCell>
                    <TableCell className="text-foreground">{item.reward}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {totalReward && (
              <p className={`text-right font-semibold text-lg ${titleColorClass}`}>
                Total Reward: {totalReward}
              </p>
            )}
          </>
        ) : (
          <div className="text-lg text-foreground">
            <span className="font-medium">Rank {rewards.rank}:</span>
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
          icon={<TrophyIcon className="w-10 h-10 text-primary animate-pulse-scale" />} 
          title="BPL SCM: Rewards Breakdown"
          subtitle="Recognizing efficiency and excellence in the supply chain."
          className="mb-10"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <RoleRewardCard
            title="Top Performers - Procurement"
            icon={<Users />}
            rewards={procurementRewards}
            totalReward="₹52,000+"
            borderColorClass="border-primary" 
            iconBgClass="bg-primary/10" 
            iconColorClass="text-primary" 
            titleColorClass="text-primary" 
          />
          <RoleRewardCard
            title="Top Performers - Logistics"
            icon={<Truck />}
            rewards={logisticsRewards}
            totalReward="₹40,000+"
            borderColorClass="border-primary" 
            iconBgClass="bg-primary/10" 
            iconColorClass="text-primary"
            titleColorClass="text-primary" 
          />
          <RoleRewardCard
            title="Top Performer - Warehouse Management"
            icon={<Warehouse />}
            rewards={{ rank: "1", reward: "₹25,000+" }}
            borderColorClass="border-primary" 
            iconBgClass="bg-primary/10" 
            iconColorClass="text-primary" 
            titleColorClass="text-primary"
          /> 
          <RoleRewardCard
            title="Top Performer - Vendor Management"
            icon={<User />}
            rewards={{ rank: "1", reward: "₹20,000+" }}
            borderColorClass="border-primary" 
            iconBgClass="bg-primary/10" 
            iconColorClass="text-primary" 
            titleColorClass="text-primary" 
          />
        </div>

        <Card className="shadow-xl rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground p-6 text-center">
          <CardHeader>
            <div className="flex items-center justify-center gap-3 mb-2">
              <Award size={36} className="text-primary-foreground"/> 
              <CardTitle className="text-3xl font-extrabold">Total SCM Reward Pool</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold mb-4">₹3,00,000+</p>
            <p className="text-lg opacity-90">Rewarding precision and performance in SCM.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
