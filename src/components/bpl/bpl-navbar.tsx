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
import { LayoutDashboard, ListOrdered, MapPinned, Award, BookOpen, Loader2 } from 'lucide-react';
import { useCityFilter } from '@/contexts/CityFilterContext'; // Import the context hook

const navLinksConfig = [
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18}/> },
  { href: "/leaderboard", label: "Leaderboard", icon: <ListOrdered size={18}/> },
  { href: "/city-views", label: "City Views", icon: <MapPinned size={18}/> },
  { href: "/rewards", label: "Rewards", icon: <Award size={18}/> },
  { href: "/rules", label: "Rules", icon: <BookOpen size={18}/> },
];

export function BplNavbar() {
  const pathname = usePathname();
  const { 
    selectedCity, 
    setSelectedCity, 
    availableCities, 
    loadingCities, 
    cityError 
  } = useCityFilter(); // Use the context

  // Determine active link based on current path
  const activeLabel = navLinksConfig.find(link => pathname.startsWith(link.href))?.label || "Dashboard";

  return (
    <nav className="bg-card shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-3">
          <ul className="flex flex-wrap justify-center md:justify-start gap-1 md:gap-2 mb-3 md:mb-0">
            {navLinksConfig.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-2 font-medium px-3 py-2 rounded-md transition-colors duration-200 text-sm
                    ${activeLabel === link.label
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-primary/10 hover:text-primary'
                    }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label htmlFor="city-filter-nav" className="text-sm font-medium text-muted-foreground whitespace-nowrap sr-only md:not-sr-only">
              Filter by City:
            </label>
            <Select 
              value={selectedCity} 
              onValueChange={setSelectedCity}
              disabled={loadingCities || !!cityError}
            >
              <SelectTrigger 
                id="city-filter-nav" 
                className="w-full sm:w-[180px] bg-background h-9"
                aria-label="City filter"
              >
                {loadingCities ? (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
        </div>
      </div>
    </nav>
  );
}
