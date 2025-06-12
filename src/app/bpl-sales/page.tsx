// @/app/bpl-sales/page.tsx
// This is the main dashboard page for BPL Channel Partner
import { DashboardTitleBlock } from '@/components/bpl/dashboard-title-block';
import { ChannelPartnerDataTable } from '@/components/bpl-channel-partner/channel-partner-data-table';
import { BarChartBig, Users } from 'lucide-react'; 

export default function BplChannelPartnerDashboardPage() {
  return (
    <div className="bg-background min-h-screen py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardTitleBlock 
          icon={<Users size={28} className="text-primary" />}
          title="Channel Partner Dashboard"
          subtitle="Performance overview for Channel Partners in the BPL."
          className="mb-6"
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <div className="lg:col-span-1">
            <ChannelPartnerDataTable />
          </div>
        </div>
      </div>
    </div>
  );
}
