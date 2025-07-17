// src/components/bpl/bpl-header.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CompanyLogo from '../CompanyLogo'; 

export function BplHeader() {
  const [championsText, setChampionsText] = useState("Construction Champions 2025");
  const [currentDate, setCurrentDate] = useState<string | null>(null);
  const pathname = usePathname();

  const isSalesSection = pathname.startsWith('/bpl-sales');
  const headerTitle = isSalesSection ? "Brick & Bolt Sales Premier League" : "Brick & Bolt Premier League";

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
    <header style={{ backgroundColor: '#5DB996' }} className="text-white shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center py-4 md:py-5 text-center">
          {/* Logo */}
          <Link href="/" passHref aria-label="Go to homepage" className="mb-2">
            <div className="w-10 h-10 flex-shrink-0 cursor-pointer">
              <CompanyLogo />
            </div>
          </Link>

          {/* Title and Subtitle */}
          <Link href="/" passHref>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white cursor-pointer hover:opacity-90 transition-opacity">
              {headerTitle}
            </h1>
          </Link>
          <p className="text-sm opacity-80 font-light text-white/90">{championsText}</p>
          
          {/* Date */}
          {currentDate && (
            <div className="text-2xl lg:text-3xl font-bold text-white/90 mt-2">
              {currentDate}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
