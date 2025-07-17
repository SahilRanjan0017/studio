// src/components/bpl/bpl-header.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CompanyLogo from '../CompanyLogo'; 

export function BplHeader() {
  const [championsText, setChampionsText] = useState("Games of Champions");
  const pathname = usePathname();

  const isSalesSection = pathname.startsWith('/bpl-sales');
  const headerTitle = isSalesSection ? "Brick & Bolt Sales Premier League" : "Brick & Bolt Premier League";

  useEffect(() => {
    // This championsText part is pre-existing and might be intended for future dynamic updates.
  }, []);

  return (
    <header style={{ backgroundColor: '#5DB996' }} className="text-white shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 md:py-4">
          
          {/* Logo on the left */}
          <Link href="/" passHref aria-label="Go to homepage" className="flex-shrink-0">
            <div className="w-10 h-10">
              <CompanyLogo />
            </div>
          </Link>

          {/* Centered Title and Subtitle */}
          <div className="flex-grow text-center">
            <Link href="/" passHref>
              <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white cursor-pointer hover:opacity-90 transition-opacity">
                {headerTitle}
              </h1>
            </Link>
            <p className="text-sm opacity-80 font-light text-white/90">{championsText}</p>
          </div>
          
          {/* Empty div for spacing, ensures title stays centered */}
          <div className="w-10 flex-shrink-0"></div>

        </div>
      </div>
    </header>
  );
}
