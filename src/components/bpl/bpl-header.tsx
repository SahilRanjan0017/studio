// @/components/bpl/bpl-header.tsx
'use client';

import { useEffect, useState } from 'react';
import CompanyLogo from '../CompanyLogo'; 

export function BplHeader() {
  const [championsText, setChampionsText] = useState("Construction Champions 2025");

  useEffect(() => {
    // Example: setChampionsText(fetchDynamicText()); 
  }, []);

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-4 md:py-5">
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
          {/* Season text display removed */}
        </div>
      </div>
    </header>
  );
}
