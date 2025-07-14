// src/app/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingCart, Users, Briefcase, Building } from 'lucide-react';
import CompanyLogo from '@/components/CompanyLogo';

const PortalLinkButton = ({ href, children, icon }: { href: string, children: React.ReactNode, icon: React.ReactNode }) => (
    <Link href={href} passHref>
        <Button
          variant="outline"
          size="lg"
          className="w-full h-24 md:h-28 text-lg md:text-xl font-bold 
                     border-2 border-[hsl(var(--primary))] text-[hsl(20,100%,98%)]
                     hover:text-[hsl(258,82%,18%)]
                     focus-visible:ring-[hsl(var(--primary))]
                     relative group overflow-hidden
                     before:content-[''] before:absolute before:inset-0 before:w-full before:h-full 
                     before:bg-gradient-to-r before:from-yellow-400 before:via-orange-500 before:to-yellow-400
                     before:transition-transform before:duration-500 before:ease-out 
                     before:scale-x-0 before:origin-left group-hover:before:scale-x-100 
                     before:z-[-1] hover:border-transparent hover:shadow-xl"
        >
          <div className="flex flex-col items-center justify-center gap-2 relative z-10">
            {icon}
            <span className="flex items-center">{children} <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" /></span>
          </div>
        </Button>
    </Link>
);


export default function LandingPage() {
  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen p-6 bg-cover bg-center"
      style={{ backgroundImage: "url('https://i.postimg.cc/zfcXMH2H/mario-klassen-70-Yx-STWa2-Zw-unsplash.jpg')" }}
      data-ai-hint="cricket stadium floodlights"
    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl animate-page-fade-in">
        <div className="mb-8 md:mb-10 transition-transform duration-300 ease-out hover:scale-105">
          <CompanyLogo />
        </div>

        <header className="text-center mb-10 md:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[hsl(20,100%,98%)] mb-3 tracking-tight" style={{color: 'hsl(20, 100%, 98%)'}}>
            Brick & Bolt Premier League
          </h1>
          <p className="text-lg sm:text-xl text-[hsl(20,100%,98%)] opacity-90" style={{color: 'hsl(20, 100%, 98%)'}}>
            Drill Down into Team Stats
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 w-full">
            <PortalLinkButton href="/bpl-ops/dashboard" icon={<Building size={24} />}>
                Operations
            </PortalLinkButton>
            <PortalLinkButton href="/bpl-channel-partner" icon={<Users size={24} />}>
                Channel Partner
            </PortalLinkButton>
            <PortalLinkButton href="/bpl-sales/dashboard" icon={<Briefcase size={24} />}>
                Sales
            </PortalLinkButton>
            <PortalLinkButton href="/bpl-scm/dashboard" icon={<ShoppingCart size={24} />}>
                SCM
            </PortalLinkButton>
        </div>
      </div>

      <footer className="absolute bottom-4 w-full text-center text-xs md:text-sm py-2 z-10" style={{color: 'hsla(20, 100%, 98%, 0.7)'}}>
        © {new Date().getFullYear()} Brick & Bolt. All rights reserved.
      </footer>
    </div>
  );
}
