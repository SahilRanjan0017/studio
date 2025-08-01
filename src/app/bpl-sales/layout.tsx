// src/app/bpl-sales/layout.tsx
"use client";

import { BplHeader } from '@/components/bpl/bpl-header';
import { BplNavbar } from '@/components/bpl/bpl-navbar';
import { BplFooter } from '@/components/bpl/bpl-footer';
import { CityFilterProvider } from '@/contexts/CityFilterContext';

export default function BplSalesLayout({
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
