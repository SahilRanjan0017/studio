// @/components/bpl/bpl-navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LayoutDashboard, ListOrdered, MapPinned, Award, BookOpen, Loader2, BarChartBig } from 'lucide-react';
import { useCityFilter } from '@/contexts/CityFilterContext'; 
import { cn } from '@/lib/utils';

interface NavLink {
  hrefRoot: string;
  label: string;
  icon: React.ReactNode;
}

const opsNavLinks: NavLink[] = [
  { hrefRoot: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18}/> },
  { hrefRoot: "/leaderboard", label: "Leaderboard", icon: <ListOrdered size={18}/> },
  { hrefRoot: "/city-views", label: "City Views", icon: <MapPinned size={18}/> },
  { hrefRoot: "/rewards", label: "Rewards", icon: <Award size={18}/> },
  { hrefRoot: "/rules", label: "Rules", icon: <BookOpen size={18}/> },
];

const salesNavLinks: NavLink[] = [
  { hrefRoot: "", label: "Dashboard", icon: <BarChartBig size={18}/> }, 
  { hrefRoot: "/rules", label: "Rules", icon: <BookOpen size={18}/> },
];

export function BplNavbar() {
  const pathname = usePathname();
  const { 
    selectedCity, 
    setSelectedCity, 
    availableCities, 
    loadingCities, 
    cityError 
  } = useCityFilter(); 

  const isOpsSection = pathname.startsWith('/bpl-ops');
  const isSalesSection = pathname.startsWith('/bpl-sales');
  
  let currentNavLinks: NavLink[] = [];
  let basePath = '';

  if (isOpsSection) {
    currentNavLinks = opsNavLinks;
    basePath = '/bpl-ops';
  } else if (isSalesSection) {
    currentNavLinks = salesNavLinks;
    basePath = '/bpl-sales';
  }

  const activeLink = currentNavLinks.find(link => {
    const fullLinkPath = `${basePath}${link.hrefRoot || ''}`;
    // Handle root path for sales dashboard correctly
    if (link.hrefRoot === "" && basePath === "/bpl-sales") {
      return pathname === basePath || pathname === `${basePath}/`;
    }
    return pathname.startsWith(fullLinkPath) && fullLinkPath !== basePath; // ensure it's not just the base path if hrefRoot is not empty
  }) || (pathname === basePath && currentNavLinks[0]?.hrefRoot === "" ? currentNavLinks[0] : undefined) || (pathname === `${basePath}/` && currentNavLinks[0]?.hrefRoot === "" ? currentNavLinks[0] : undefined) ;
  
  const activeLabel = activeLink?.label || (currentNavLinks[0]?.label || "");


  return (
    <nav className="bg-card shadow-sm sticky top-0 z-40 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-2.5">
          <ul className="flex flex-wrap justify-center md:justify-start gap-1 md:gap-1.5 mb-3 md:mb-0">
            {currentNavLinks.map((link) => {
              const isActive = activeLabel === link.label;
              return (
                <li key={link.label}>
                  <Link
                    href={`${basePath}${link.hrefRoot || ''}`}
                    className={cn(
                      `relative flex items-center gap-2 font-medium px-3.5 py-2.5 rounded-md transition-all duration-200 text-sm group`,
                      isActive
                        ? 'text-primary' // Active text color uses primary (orange)
                        : 'text-foreground hover:bg-muted hover:text-primary'
                    )}
                  >
                    {React.cloneElement(link.icon as React.ReactElement, { className: cn(isActive ? "text-primary" : "") })}
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full animate-fadeInUp" style={{animationDuration: '0.3s'}}></span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
          {isOpsSection && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label htmlFor="city-filter-nav" className="text-sm font-medium text-muted-foreground whitespace-nowrap sr-only md:not-sr-only">
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
                  aria-label="City filter"
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
    </nav>
  );
}

    