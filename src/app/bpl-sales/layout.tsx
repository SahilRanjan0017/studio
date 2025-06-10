// src/app/bpl-sales/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BPL Sales | Brick & Bolt',
  description: 'Sales Premier League Portal - Coming Soon.',
};

export default function BplSalesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* You can add a specific header/footer for BPL Sales here if needed later */}
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
}
