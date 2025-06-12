// src/app/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import CompanyLogo from '@/components/CompanyLogo';

export default function LandingPage() {
  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen p-6 bg-cover bg-center"
      style={{ backgroundImage: "url('https://placehold.co/1920x1080.png')" }}
      data-ai-hint="modern construction architectural abstract"
    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full animate-page-fade-in">
        <header className="text-center mb-10 md:mb-12">
          <div className="mb-6 inline-block transform transition-transform hover:scale-105 duration-300 animate-subtle-scale">
            <CompanyLogo />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[hsl(var(--primary-foreground))] mb-3 tracking-tight">
            Welcome to Brick & Bolt
          </h1>
          <p className="text-lg sm:text-xl text-[hsl(var(--primary-foreground))] opacity-80">Choose your portal:</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full max-w-xl md:max-w-2xl">
          <Link href="/bpl-ops/dashboard" passHref>
            <Button
              variant="default"
              size="lg"
              className="w-full h-20 md:h-24 text-lg md:text-xl shadow-lg group font-bold text-[hsl(var(--primary-foreground))] hover:text-[hsl(var(--foreground))]"
            >
              <span className="relative z-10">BPL Operations</span>
              <ArrowRight className="ml-2 h-5 w-5 md:h-6 md:w-6 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
            </Button>
          </Link>
          <Link href="/bpl-sales" passHref>
            <Button
              variant="default"
              size="lg"
              className="w-full h-20 md:h-24 text-lg md:text-xl shadow-lg group font-bold text-[hsl(var(--primary-foreground))] hover:text-[hsl(var(--foreground))]"
            >
              <span className="relative z-10">BPL Channel Partner</span>
              <ArrowRight className="ml-2 h-5 w-5 md:h-6 md:w-6 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
            </Button>
          </Link>
        </div>
      </div>

      <footer className="absolute bottom-4 w-full text-center text-[hsl(var(--muted-foreground))] text-xs md:text-sm py-2 z-10">
        © {new Date().getFullYear()} Brick & Bolt. All rights reserved.
      </footer>
    </div>
  );
}
