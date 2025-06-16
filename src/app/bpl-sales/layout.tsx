// src/app/bpl-sales/layout.tsx
"use client"; // Add "use client" directive

import type { Metadata } from 'next';
import { BplHeader } from '@/components/bpl/bpl-header';
import { BplNavbar } from '@/components/bpl/bpl-navbar';
import { BplFooter } from '@/components/bpl/bpl-footer';
import { CityFilterProvider } from '@/contexts/CityFilterContext';

export const metadata: Metadata = {
  title: 'BPL Channel Partner | Brick & Bolt',
  description: 'Channel Partner Premier League Portal - Track performance and targets.',
};

export default function BplChannelPartnerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CityFilterProvider>
      <div className="min-h-screen flex flex-col">
        <BplHeader />
        <BplNavbar />
        <main className="flex-grow">
          {children}
        </main>
        <BplFooter />
      </div>
    </CityFilterProvider>
  );
}
