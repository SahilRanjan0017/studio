// src/app/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingCart, Users, Briefcase, Building } from 'lucide-react';
import CompanyLogo from '@/components/CompanyLogo';
import { cn } from '@/lib/utils';
import { PopupBanner } from '@/components/bpl/PopupBanner';

const portalButtons = [
    {
        href: "/bpl-ops/dashboard",
        icon: <Building size={24} />,
        label: "Operations",
        id: "ops",
    },
    {
        href: "/bpl-channel-partner",
        icon: <Users size={24} />,
        label: "Channel Partner",
        id: "cp",
    },
    {
        href: "/bpl-sales/dashboard",
        icon: <Briefcase size={24} />,
        label: "Orange Club",
        id: "sales",
    },
    {
        href: "/bpl-scm/dashboard",
        icon: <ShoppingCart size={24} />,
        label: "SCM",
        id: "scm",
    }
];

const unifiedColorClasses = `
  border-white/30 text-white/80
  hover:border-transparent hover:text-white
  before:absolute before:inset-0
  before:bg-gradient-to-r before:from-primary before:to-red-600
  before:transition-transform before:duration-300 before:ease-in-out
  before:scale-x-0 before:origin-left
  hover:before:scale-x-100
`;

const PortalLinkButton = ({ href, children, icon, className, colorClasses }: { href: string, children: React.ReactNode, icon: React.ReactNode, className?: string, colorClasses?: string }) => (
    <div className={cn("transition-opacity duration-300", className)}>
        <Link href={href} passHref>
            <Button
              variant="outline"
              size="lg"
              className={cn(`w-full h-28 md:h-32 text-lg md:text-xl font-bold p-4
                         border-2
                         focus-visible:ring-ring
                         relative group overflow-hidden
                         bg-black/20 backdrop-blur-sm
                         transition-all duration-300 ease-in-out
                         hover:shadow-lg hover:shadow-current`, colorClasses)}
            >
              <div className="flex flex-col items-center justify-center text-center gap-2 relative z-10">
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
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  return (
    <>
      <PopupBanner 
        imageUrl="https://i.postimg.cc/nLJfZ68B/Final-Alert.png"
        linkHref="/bpl-sales/dashboard"
      />
      <div
        className="relative flex flex-col items-center justify-center min-h-screen p-6 bg-cover bg-center"
        style={{ backgroundImage: "url('https://i.postimg.cc/zfcXMH2H/mario-klassen-70-Yx-STWa2-Zw-unsplash.jpg')" }}
        data-ai-hint="cricket stadium floodlights"
      >
        <div className="absolute inset-0 bg-black/60 z-0"></div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl animate-page-fade-in">
          <div className="mb-4 md:mb-6 transition-transform duration-300 ease-out hover:scale-105">
            <Link href="/" aria-label="Home">
                <CompanyLogo />
            </Link>
          </div>

          <header className="text-center mb-10 md:mb-12">
            <h1 className={cn(
                "text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white transition-all duration-300",
                isButtonHovered 
                  ? 'bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(240,90,41,0.5)]'
                  : 'animate-glow'
                )}
                style={{ textShadow: isButtonHovered ? 'none' : '0 0 8px rgba(255,255,255,0.3), 0 0 20px rgba(240,90,41,0.4)' }}
            >
              Brick &amp; Bolt Premier League
            </h1>
            <p className="text-lg sm:text-xl text-white/80 mt-2">
              Drill Down into Team Stats
            </p>
          </header>

          <div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 w-full"
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
              {portalButtons.map((button) => (
                  <PortalLinkButton 
                      key={button.id}
                      href={button.href} 
                      icon={button.icon}
                      className={'opacity-100'}
                      colorClasses={unifiedColorClasses}
                  >
                      {button.label}
                  </PortalLinkButton>
              ))}
          </div>
        </div>

        <footer className="absolute bottom-4 w-full text-center text-xs md:text-sm py-2 z-10 text-white/60">
          © {new Date().getFullYear()} Brick & Bolt. All rights reserved.
        </footer>
      </div>
    </>
  );
}
