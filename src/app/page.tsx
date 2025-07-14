// src/app/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingCart, Users, Briefcase, Building } from 'lucide-react';
import CompanyLogo from '@/components/CompanyLogo';
import { cn } from '@/lib/utils';

const portalButtons = [
    {
        href: "/bpl-ops/dashboard",
        icon: <Building size={24} />,
        label: "Operations",
        id: "ops"
    },
    {
        href: "/bpl-channel-partner",
        icon: <Users size={24} />,
        label: "Channel Partner",
        id: "cp"
    },
    {
        href: "/bpl-sales/dashboard",
        icon: <Briefcase size={24} />,
        label: "Sales",
        id: "sales"
    },
    {
        href: "/bpl-scm/dashboard",
        icon: <ShoppingCart size={24} />,
        label: "SCM",
        id: "scm"
    }
];

const PortalLinkButton = ({ href, children, icon, onMouseEnter, className }: { href: string, children: React.ReactNode, icon: React.ReactNode, onMouseEnter: () => void, className?: string }) => (
    <div onMouseEnter={onMouseEnter} className={cn("transition-opacity duration-300", className)}>
        <Link href={href} passHref>
            <Button
              variant="outline"
              size="lg"
              className="w-full h-24 md:h-28 text-lg md:text-xl font-bold 
                         border-2 border-orange-500 text-orange-500
                         hover:border-white hover:text-white
                         focus-visible:ring-orange-500
                         relative group overflow-hidden
                         bg-transparent
                         transition-colors duration-300 ease-in-out"
            >
              <div className="flex flex-col items-center justify-center gap-2 relative z-10">
                {icon}
                <span className="flex items-center transition-colors duration-300">
                  {children} <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </Button>
        </Link>
    </div>
);


export default function LandingPage() {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

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

        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 w-full"
          onMouseLeave={() => setHoveredButton(null)}
        >
            {portalButtons.map((button) => (
                <PortalLinkButton 
                    key={button.id}
                    href={button.href} 
                    icon={button.icon}
                    onMouseEnter={() => setHoveredButton(button.id)}
                    className={hoveredButton && hoveredButton !== button.id ? 'opacity-20' : 'opacity-100'}
                >
                    {button.label}
                </PortalLinkButton>
            ))}
        </div>
      </div>

      <footer className="absolute bottom-4 w-full text-center text-xs md:text-sm py-2 z-10" style={{color: 'hsla(20, 100%, 98%, 0.7)'}}>
        © {new Date().getFullYear()} Brick & Bolt. All rights reserved.
      </footer>
    </div>
  );
}
