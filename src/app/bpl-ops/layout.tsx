// src/app/bpl-ops/layout.tsx
"use client"; // Add "use client" directive

import { BplHeader } from '@/components/bpl/bpl-header';
import { BplNavbar } from '@/components/bpl/bpl-navbar';
import { BplFooter } from '@/components/bpl/bpl-footer';
import { CityFilterProvider } from '@/contexts/CityFilterContext';

// Removed metadata export as it's not allowed in "use client" components
// If metadata is needed, it should be defined in the respective page.tsx files or a parent Server Component.

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
