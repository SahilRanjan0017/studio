// src/app/bpl-ops/layout.tsx
"use client"; // Add "use client" directive

import type { Metadata } from 'next';
import { BplHeader } from '@/components/bpl/bpl-header';
import { BplNavbar } from '@/components/bpl/bpl-navbar';
import { BplFooter } from '@/components/bpl/bpl-footer';
import { CityFilterProvider } from '@/contexts/CityFilterContext';

export const metadata: Metadata = {
  title: 'BPL Operations | Brick & Bolt',
  description: 'Track performance, celebrate achievements, and compete in the Brick & Bolt Premier League.',
};

export default function BplOpsLayout({
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
