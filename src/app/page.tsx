
// src/app/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import CompanyLogo from '@/components/CompanyLogo';

export default function LandingPage() {
  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen p-6 bg-cover bg-center"
      style={{ backgroundImage: "url('https://i.postimg.cc/HLfQVfQL/sports-in-construction-dark-theme-with-orange-and-slate-grey.jpg')" }}
      data-ai-hint="architectural velocity abstract dark charcoal silver-grey burnt orange"
    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full animate-page-fade-in">
        <div className="mb-8 md:mb-10 transition-transform duration-300 ease-out hover:scale-105">
          <CompanyLogo />
        </div>

        <header className="text-center mb-10 md:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[hsl(var(--primary-foreground))] mb-3 tracking-tight" style={{color: 'hsl(96, 67%, 96%)'}}> {/* #f1faee */}
            Welcome to Brick & Bolt
          </h1>
          <p className="text-lg sm:text-xl text-[hsl(var(--primary-foreground))] opacity-80" style={{color: 'hsl(96, 67%, 96%)'}}> {/* #f1faee */}
            Choose your portal
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full max-w-xl md:max-w-2xl">
          <Link href="/bpl-ops/dashboard" passHref>
            <Button
              variant="outline" 
              size="lg"
              className="w-full h-20 md:h-24 text-lg md:text-xl font-bold 
                         bg-transparent border-2 border-[hsl(var(--primary))] text-[hsl(96,67%,96%)] /* #f1faee text */
                         hover:text-[hsl(96,67%,96%)] /* #f1faee text on hover */
                         focus-visible:ring-[hsl(var(--primary))]
                         before:content-[''] before:absolute before:inset-0 before:w-full before:h-full 
                         before:bg-gradient-to-r before:from-[hsl(var(--primary-darker))] before:to-[hsl(var(--primary-lighter))] 
                         before:transition-transform before:duration-500 before:ease-out 
                         before:scale-x-0 before:origin-left group-hover:before:scale-x-100 
                         before:z-[-1] hover:border-primary/80 hover:shadow-xl group"
            >
              <span className="relative z-10">BPL Operations</span>
              <ArrowRight className="ml-2 h-5 w-5 md:h-6 md:w-6 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
            </Button>
          </Link>
          <Link href="/bpl-sales" passHref>
            <Button
              variant="outline" 
              size="lg"
              className="w-full h-20 md:h-24 text-lg md:text-xl font-bold
                         bg-transparent border-2 border-[hsl(var(--primary))] text-[hsl(96,67%,96%)] /* #f1faee text */
                         hover:text-[hsl(96,67%,96%)] /* #f1faee text on hover */
                         focus-visible:ring-[hsl(var(--primary))]
                         before:content-[''] before:absolute before:inset-0 before:w-full before:h-full 
                         before:bg-gradient-to-r before:from-[hsl(var(--primary-darker))] before:to-[hsl(var(--primary-lighter))] 
                         before:transition-transform before:duration-500 before:ease-out 
                         before:scale-x-0 before:origin-left group-hover:before:scale-x-100 
                         before:z-[-1] hover:border-primary/80 hover:shadow-xl group"
            >
              <span className="relative z-10">BPL Channel Partner</span>
              <ArrowRight className="ml-2 h-5 w-5 md:h-6 md:w-6 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
            </Button>
          </Link>
        </div>
      </div>

      <footer className="absolute bottom-4 w-full text-center text-xs md:text-sm py-2 z-10" style={{color: 'hsla(96, 67%, 96%, 0.7)'}}> {/* #f1faee with opacity */}
        © {new Date().getFullYear()} Brick & Bolt. All rights reserved.
      </footer>
    </div>
  );
}
