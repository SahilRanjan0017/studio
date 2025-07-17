// src/components/bpl/bpl-header.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import CompanyLogo from '../CompanyLogo'; 

export function BplHeader() {
  const pathname = usePathname();
  const [championsText, setChampionsText] = useState("Presents League of Sales");

  const headerTitle = "Brick & Bolt Premier League";

  useEffect(() => {
    if (pathname.startsWith('/bpl-ops')) {
      setChampionsText("Present League of Operation");
    } else if (pathname.startsWith('/bpl-channel-partner')) {
      setChampionsText("Present League of Channel Partner");
    } else {
      setChampionsText("Presents League of Sales");
    }
  }, [pathname]);

  return (
    <header style={{ backgroundColor: '#5DB996' }} className="text-white shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 md:py-4">
          
          {/* Logos on the left */}
          <Link href="/" passHref aria-label="Go to homepage" className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10">
                <CompanyLogo />
              </div>
              <span className="text-2xl font-light text-white/70">×</span>
              <Image
                src="https://i.postimg.cc/pXt2P0wf/Screenshot-2025-07-17-at-4-51-05-PM.png"
                alt="Collaboration Logo"
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
                data-ai-hint="company logo"
              />
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
          <div className="w-24 flex-shrink-0"></div>

        </div>
      </div>
    </header>
  );
}
