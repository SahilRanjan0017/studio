
// src/app/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import CompanyLogo from '@/components/CompanyLogo';

export default function LandingPage() {
  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen p-6 bg-cover bg-center"
      style={{ backgroundImage: "url('https://i.postimg.cc/Y9vyjM7V/contractors-playing-cricket-at-construction-site-dark-theme-with-orange-and-slate-grey.jpg')" }}
      data-ai-hint="architectural velocity abstract dark charcoal silver-grey burnt orange"
    >
      <div className="absolute inset-0 bg-black/70 z-0"></div> {/* Slightly increased overlay for better contrast if needed */}

      <div className="relative z-10 flex flex-col items-center justify-center w-full animate-page-fade-in">
        <div className="mb-8 md:mb-10 transition-transform duration-300 ease-out hover:scale-105">
          {/* CompanyLogo styling might need adjustment if it's an SVG to use theme colors, for now it's an image */}
          <CompanyLogo />
        </div>

        <header className="text-center mb-10 md:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[hsl(20,100%,98%)] mb-3 tracking-tight" style={{color: 'hsl(20, 100%, 98%)'}}> {/* #fff6f4 */}
            Welcome to Brick & Bolt Premier League
          </h1>
          <p className="text-lg sm:text-xl text-[hsl(20,100%,98%)] opacity-90" style={{color: 'hsl(20, 100%, 98%)'}}> {/* #fff6f4 */}
            Choose your portal
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full max-w-xl md:max-w-2xl">
          <Link href="/bpl-ops/dashboard" passHref>
            <Button
              variant="outline" // Using outline to get transparent bg by default
              size="lg"
              className="w-full h-20 md:h-24 text-lg md:text-xl font-bold 
                         border-2 border-[hsl(var(--primary))] text-[hsl(20,100%,98%)] /* #fff6f4 text */
                         hover:text-[hsl(258,82%,18%)] /* #1F0756 text on hover */
                         focus-visible:ring-[hsl(var(--primary))]
                         before:content-[''] before:absolute before:inset-0 before:w-full before:h-full 
                         before:bg-gradient-to-r before:from-[hsl(var(--primary-darker))] before:to-[hsl(var(--primary-lighter))] 
                         before:transition-transform before:duration-500 before:ease-out 
                         before:scale-x-0 before:origin-left group-hover:before:scale-x-100 
                         before:z-[-1] hover:border-transparent hover:shadow-xl group"
            >
              <span className="relative z-10">BPL Operations</span>
              <ArrowRight className="ml-2 h-5 w-5 md:h-6 md:w-6 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
            </Button>
          </Link>
          <Link href="/bpl-sales" passHref>
            <Button
              variant="outline" // Using outline to get transparent bg by default
              size="lg"
              className="w-full h-20 md:h-24 text-lg md:text-xl font-bold
                         border-2 border-[hsl(var(--primary))] text-[hsl(20,100%,98%)] /* #fff6f4 text */
                         hover:text-[hsl(258,82%,18%)] /* #1F0756 text on hover */
                         focus-visible:ring-[hsl(var(--primary))]
                         before:content-[''] before:absolute before:inset-0 before:w-full before:h-full 
                         before:bg-gradient-to-r before:from-[hsl(var(--primary-darker))] before:to-[hsl(var(--primary-lighter))] 
                         before:transition-transform before:duration-500 before:ease-out 
                         before:scale-x-0 before:origin-left group-hover:before:scale-x-100 
                         before:z-[-1] hover:border-transparent hover:shadow-xl group"
            >
              <span className="relative z-10">BPL Channel Partner</span>
              <ArrowRight className="ml-2 h-5 w-5 md:h-6 md:w-6 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
            </Button>
          </Link>
        </div>
      </div>

      <footer className="absolute bottom-4 w-full text-center text-xs md:text-sm py-2 z-10" style={{color: 'hsla(20, 100%, 98%, 0.7)'}}> {/* #fff6f4 with opacity */}
        © {new Date().getFullYear()} Brick & Bolt. All rights reserved.
      </footer>
    </div>
  );
}
