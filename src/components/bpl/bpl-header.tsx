// @/components/bpl/bpl-header.tsx
'use client';

import Image from 'next/image';
import { Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';

export function BplHeader() {
  const [matchDayText, setMatchDayText] = useState("SEASON 1 • MAY 2025");

  useEffect(() => {
    // Example of updating match day text dynamically if needed in the future
    // For now, it's static based on the HTML
  }, []);

  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-md">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://picsum.photos/1200/300"
          alt="Header background"
          layout="fill"
          objectFit="cover"
          className="opacity-10"
          data-ai-hint="construction cityscape"
          priority
        />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between py-4 md:py-6">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            {/* <Image
              // src="https://picsum.photos/60/60"
              src="https://media.licdn.com/dms/image/v2/D560BAQFxsfYjPCJTDA/company-logo_200_200/company-logo_200_200/0/1712045497210/bricknbolt_logo?e=2147483647&v=beta&t=WTM8-vDChfkD7HvCfOEVZNcN_cEt8gwty5SZrz4noqY"
              alt="BPL Logo"
              width={60}
              height={60}
              className="rounded-full bg-white p-1"
              data-ai-hint="company logo"
            /> */}
            <img
  src="https://media.licdn.com/dms/image/v2/D560BAQFxsfYjPCJTDA/company-logo_200_200/company-logo_200_200/0/1712045497210/bricknbolt_logo?e=2147483647&v=beta&t=WTM8-vDChfkD7HvCfOEVZNcN_cEt8gwty5SZrz4noqY"
  alt="BPL Logo"
  width={60}
  height={60}
  className="rounded-full bg-white p-1"
  data-ai-hint="company logo"
/>
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight ">
                Brick & Bolt Premier League
              </h1>
              <p className="text-sm opacity-90">Construction Champions 2025</p>
            </div>
          </div>
          <div className="bg-accent text-accent-foreground px-6 py-2 rounded-full font-semibold text-lg shadow-lg animate-pulse-scale flex items-center gap-2">
            <Trophy size={20} /> {matchDayText}
          </div>
        </div>
      </div>
    </header>
  );
}
