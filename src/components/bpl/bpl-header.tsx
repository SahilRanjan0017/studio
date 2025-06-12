// @/components/bpl/bpl-header.tsx
'use client';

import { useEffect, useState } from 'react';
import CompanyLogo from '../CompanyLogo'; 

export function BplHeader() {
  const [championsText, setChampionsText] = useState("Construction Champions 2025");
  const [currentDate, setCurrentDate] = useState<string | null>(null);

  useEffect(() => {
    // Example: setChampionsText(fetchDynamicText()); 
    // This championsText part is pre-existing and might be intended for future dynamic updates.

    // Set current date on client-side to avoid hydration issues
    const date = new Date();
    setCurrentDate(date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }));
  }, []);

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-4 md:py-5">
          {/* Left side: Logo and Title */}
          <div className="flex items-center gap-4 mb-3 md:mb-0">
            <div className="w-10 h-10 flex-shrink-0 -mt-3">
              <CompanyLogo />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-primary-foreground">
                Brick & Bolt Premier League
              </h1>
              <p className="text-xs opacity-80 font-light text-primary-foreground/90">{championsText}</p>
            </div>
          </div>

          {/* Right side: Date */}
          {currentDate && (
            <div className="text-sm font-medium text-primary-foreground/90 mt-2 md:mt-0 self-center md:self-auto">
              {currentDate}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
