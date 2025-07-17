// src/app/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

const PortalLinkButton = ({ href, children, icon, className, colorClasses, onMouseEnter, onMouseLeave }: { href: string, children: React.ReactNode, icon: React.ReactNode, className?: string, colorClasses?: string, onMouseEnter?: () => void, onMouseLeave?: () => void }) => (
    <div 
        className={cn("transition-all duration-300", className)}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
    >
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
  const [hoveredButtonId, setHoveredButtonId] = useState<string | null>(null);

  return (
    <>
      <PopupBanner 
        imageUrl="https://i.postimg.cc/nLJfZ68B/Final-Alert.png"
        linkHref="/bpl-sales/dashboard"
      />
      <div
        className="relative flex flex-col items-center justify-center min-h-screen p-6 bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: "url('https://i.postimg.cc/zfcXMH2H/mario-klassen-70-Yx-STWa2-Zw-unsplash.jpg')" }}
        data-ai-hint="cricket stadium floodlights"
      >
        <div className="absolute inset-0 bg-black/60 z-0"></div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl animate-page-fade-in">
          <div className={cn(
              "mb-4 md:mb-6 transition-all duration-300 ease-out hover:scale-105",
              hoveredButtonId && "animate-logo-glow"
            )}
          >
            <Link href="/" aria-label="Home" className="flex items-center gap-2">
                <CompanyLogo />
                <span className="text-2xl font-light text-white/70">×</span>
                <Image
                  src="https://i.postimg.cc/pXt2P0wf/Screenshot-2025-07-17-at-4-51-05-PM.png"
                  alt="Collaboration Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10 object-contain"
                  data-ai-hint="company logo"
                />
            </Link>
          </div>

          <header className="text-center mb-10 md:mb-12">
            <h1 className={cn(
                "text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white transition-all duration-300",
                hoveredButtonId 
                  ? 'bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(240,90,41,0.5)]'
                  : 'animate-glow'
                )}
                style={{ textShadow: hoveredButtonId ? 'none' : '0 0 8px rgba(255,255,255,0.3), 0 0 20px rgba(240,90,41,0.4)' }}
            >
              Brick &amp; Bolt Premier League
            </h1>
            <p className={cn(
              "text-lg sm:text-xl text-white/80 mt-2 relative",
              hoveredButtonId && "animate-glitter"
              )}>
              {/* Drill Down into Team Stats */}
              Feel the fire. Play with heart. Win with honor.            </p>
          </header>

          <div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 w-full"
            onMouseLeave={() => setHoveredButtonId(null)}
          >
              {portalButtons.map((button) => (
                  <PortalLinkButton 
                      key={button.id}
                      href={button.href} 
                      icon={button.icon}
                      className={cn(
                        'transition-all duration-300',
                        hoveredButtonId && hoveredButtonId !== button.id 
                          ? 'opacity-0 scale-95' 
                          : 'opacity-100 scale-100',
                        hoveredButtonId === button.id && 'scale-105 -translate-y-2'
                      )}
                      colorClasses={unifiedColorClasses}
                      onMouseEnter={() => setHoveredButtonId(button.id)}
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
