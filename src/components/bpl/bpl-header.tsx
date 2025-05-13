// @/components/bpl/bpl-header.tsx
'use client';

import { useEffect, useState } from 'react';
import CompanyLogo from '../CompanyLogo'; 

export function BplHeader() {
  const [seasonText, setSeasonText] = useState("SEASON 1 - 2025");

  useEffect(() => {
    // Example: setSeasonText(fetchCurrentSeason());
  }, []);

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-4 md:py-6">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="w-10 h-10"> {/* Container to control size */}
              <CompanyLogo />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-primary-foreground">
                Brick & Bolt Premier League
              </h1>
              <p className="text-sm opacity-90">Construction Champions 2025</p>
            </div>
          </div>
          <div className="bg-accent text-accent-foreground px-6 py-2 rounded-md font-semibold text-lg shadow-lg flex items-center gap-2">
            {seasonText}
          </div>
        </div>
      </div>
    </header>
  );
}
