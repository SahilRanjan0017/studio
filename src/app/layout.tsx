import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { BplHeader } from '@/components/bpl/bpl-header';
import { BplNavbar } from '@/components/bpl/bpl-navbar';
import { BplFooter } from '@/components/bpl/bpl-footer';


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Brick & Bolt Premier League | Construction Champions',
  description: 'Track performance, celebrate achievements, and compete for the top spot in our construction championship.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-background text-foreground`}>
        <div className="min-h-screen flex flex-col">
          <BplHeader />
          <BplNavbar />
          <main className="flex-grow">
            {children}
          </main>
          <BplFooter />
          <Toaster />
        </div>
      </body>
    </html>
  );
}
