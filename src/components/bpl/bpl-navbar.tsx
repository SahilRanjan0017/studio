// @/components/bpl/bpl-navbar.tsx
'use client';

import React, { useEffect, useState } from 'react'; 
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LayoutDashboard, Award, BookOpen, Loader2, BarChartBig, ShoppingCart, Briefcase, Building } from 'lucide-react';
import { useCityFilter } from '@/contexts/CityFilterContext'; 
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface NavLink {
  hrefRoot: string;
  label: string;
  icon: React.ReactNode;
}

const navConfig: Record<string, { links: NavLink[]; basePath: string }> = {
  'bpl-ops': {
    basePath: '/bpl-ops',
    links: [
      { hrefRoot: "/dashboard", label: "Dashboard", icon: <Building size={18}/> },
      { hrefRoot: "/rewards", label: "Rewards", icon: <Award size={18}/> },
      { hrefRoot: "/rules", label: "Rules", icon: <BookOpen size={18}/> },
    ],
  },
  'bpl-sales': {
    basePath: '/bpl-sales',
    links: [
      { hrefRoot: "/dashboard", label: "Dashboard", icon: <Briefcase size={18}/> },
      { hrefRoot: "/rewards", label: "Rewards", icon: <Award size={18}/> },
      { hrefRoot: "/rules", label: "Rules", icon: <BookOpen size={18}/> },
    ],
  },
  'bpl-scm': {
    basePath: '/bpl-scm',
    links: [
      { hrefRoot: "/dashboard", label: "Dashboard", icon: <ShoppingCart size={18}/> },
      { hrefRoot: "/rewards", label: "Rewards", icon: <Award size={18}/> },
      { hrefRoot: "/rules", label: "Rules", icon: <BookOpen size={18}/> },
    ],
  },
};


export function BplNavbar() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const { 
    selectedCity, 
    setSelectedCity, 
    availableCities, 
    loadingCities, 
    cityError 
  } = useCityFilter(); 

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const currentSectionKey = isMounted ? Object.keys(navConfig).find(key => pathname.startsWith(`/${key}`)) : undefined;
  const currentNav = currentSectionKey ? navConfig[currentSectionKey] : navConfig['bpl-ops'];
  const { links: currentNavLinks, basePath } = currentNav;
  
  const isChannelPartnerSection = isMounted && basePath === '/bpl-channel-partner';

  const activeLink = isMounted ? currentNavLinks.find(link => {
    const fullLinkPath = `${basePath}${link.hrefRoot || ''}`;
    if (link.hrefRoot === "") {
      return pathname === basePath || pathname === `${basePath}/`;
    }
    return pathname.startsWith(fullLinkPath) && fullLinkPath !== basePath;
  }) || (pathname === basePath && currentNavLinks[0]?.hrefRoot === "" ? currentNavLinks[0] : undefined) || (pathname === `${basePath}/` && currentNavLinks[0]?.hrefRoot === "" ? currentNavLinks[0] : undefined) : undefined;
  
  const activeLabel = activeLink?.label || (currentNavLinks[0]?.label || "");

  const renderNavLinks = () => {
    if (!isMounted) {
      return (
        <ul className="flex flex-wrap justify-center md:justify-start gap-1 md:gap-1.5">
          <li className="flex items-center gap-2 font-medium px-3.5 py-2.5 rounded-md text-sm">
            <Skeleton className="h-5 w-5 rounded-sm" />
            <Skeleton className="h-4 w-20" />
          </li>
          <li className="flex items-center gap-2 font-medium px-3.5 py-2.5 rounded-md text-sm">
            <Skeleton className="h-5 w-5 rounded-sm" />
            <Skeleton className="h-4 w-20" />
          </li>
        </ul>
      );
    }

    return (
      <ul className="flex flex-wrap justify-center md:justify-start gap-1 md:gap-1.5">
        {currentNavLinks.map((link) => {
          const isActive = activeLabel === link.label;
          return (
            <li key={link.label}>
              <Link
                href={`${basePath}${link.hrefRoot || ''}`}
                className={cn(
                  `relative flex items-center gap-2 font-medium px-3.5 py-2.5 rounded-md transition-all duration-200 text-sm group`,
                  isActive
                    ? 'text-primary'
                    : 'text-foreground hover:bg-muted hover:text-primary'
                )}
              >
                {React.cloneElement(link.icon as React.ReactElement, { className: cn(isActive ? "text-primary" : "") })}
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full animate-fadeInUp" style={{animationDuration: '0.3s'}}></span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <nav className="bg-card shadow-sm sticky top-0 z-40 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-end py-2.5">
          <div className="flex items-center justify-center md:justify-end gap-4 w-full">
            {renderNavLinks()}
            
            {isChannelPartnerSection && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label htmlFor="city-filter-nav" className="text-sm font-semibold text-foreground whitespace-nowrap sr-only md:not-sr-only">
                  City:
                </label>
                <Select 
                  value={selectedCity} 
                  onValueChange={setSelectedCity}
                  disabled={loadingCities || !!cityError}
                >
                  <SelectTrigger 
                    id="city-filter-nav" 
                    className="w-full sm:w-[170px] bg-background h-9 text-sm focus:ring-primary/50"
                  >
                    {loadingCities ? (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                        <span>Loading...</span>
                      </div>
                    ) : cityError ? (
                       <span className="text-destructive text-xs">Error</span>
                    ) : (
                      <SelectValue placeholder="Select City" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {!loadingCities && !cityError && (
                      <>
                        <SelectItem value="Pan India">Pan India</SelectItem>
                        {availableCities.map((city, index) => (
                          <SelectItem key={index} value={city}>{city}</SelectItem>
                        ))}
                      </>
                    )}
                     {cityError && <SelectItem value="Error" disabled>Error loading cities</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
