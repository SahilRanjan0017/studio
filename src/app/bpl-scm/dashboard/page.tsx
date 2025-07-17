// @/app/bpl-scm/dashboard/page.tsx
import { DashboardTitleBlock } from '@/components/bpl/dashboard-title-block';
import { ShoppingCart } from 'lucide-react';

export default function BplScmDashboardPage() {
  return (
    <div 
      className="relative min-h-screen py-6 bg-cover bg-center"
      style={{ backgroundImage: "url('https://i.postimg.cc/7Yp1qt0n/Gemini-Generated-Image-krvb48krvb48krvb.jpg')" }}
      data-ai-hint="warehouse logistics"
    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardTitleBlock 
          icon={<ShoppingCart size={28} className="text-primary" />}
          title="BPL SCM Dashboard"
          className="mb-6"
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            {/* Content for SCM dashboard can be added here */}
            <p className="text-center text-primary-foreground/80 py-10">
              Welcome to the SCM Dashboard. Content and leaderboards are coming soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
