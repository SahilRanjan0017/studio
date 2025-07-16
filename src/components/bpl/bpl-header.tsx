// @/components/bpl/bpl-header.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
    <header className="bg-gradient-to-r from-[hsl(var(--primary-darker))] to-[hsl(var(--primary-lighter))] text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-4 md:py-5">
          {/* Left side: Logo and Title */}
          <div className="flex items-center gap-4 mb-3 md:mb-0">
            <Link href="/" passHref aria-label="Go to homepage">
              <div className="w-10 h-10 flex-shrink-0 -mt-3 cursor-pointer">
                <CompanyLogo />
              </div>
            </Link>
            <div>
              <Link href="/" passHref>
                <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-primary-foreground cursor-pointer hover:opacity-90 transition-opacity">
                  Brick & Bolt Premier League
                </h1>
              </Link>
              <p className="text-xs opacity-80 font-light text-primary-foreground/90">{championsText}</p>
            </div>
          </div>

          {/* Right side: Date */}
          {currentDate && (
            <div className="text-2xl lg:text-3xl font-extrabold text-primary-foreground/90 mt-2 md:mt-0 self-center md:self-auto">
              {currentDate}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
