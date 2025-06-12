// src/app/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import CompanyLogo from '@/components/CompanyLogo';

export default function LandingPage() {
  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen p-6 bg-cover bg-center"
      style={{ backgroundImage: "url('https://placehold.co/1920x1080.png')" }} // Placeholder, to be replaced with a high-quality abstract image
      data-ai-hint="modern construction architectural abstract" // Guiding AI for image selection
    >
      {/* Dark Overlay for better text readability and premium feel */}
      <div className="absolute inset-0 bg-black/60 z-0"></div> {/* Using primary text color for overlay: bg-[hsl(var(--foreground))]/60 */}

      {/* Content container, z-index to be above overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full animate-page-fade-in">
        <header className="text-center mb-10 md:mb-12">
          <div className="mb-6 inline-block transform transition-transform hover:scale-105 duration-300 animate-subtle-scale">
            {/* Logo: Consider slightly larger, styled with accent colors (if SVG) */}
            <CompanyLogo /> 
          </div>
          {/* Heading: Strong, modern sans-serif (e.g., Montserrat Bold or Inter Extra Bold) */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-neutral-50 mb-3 tracking-tight">
            Welcome to Brick & Bolt
          </h1>
          {/* Sub-heading: Lighter weight, readable sans-serif */}
          <p className="text-lg sm:text-xl text-neutral-200">Choose your portal:</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full max-w-xl md:max-w-2xl">
          {/* Buttons: Transparent background, accent border, Liquid Fill Gradient Shift on hover */}
          <Link href="/bpl-ops/dashboard" passHref>
            <Button
              variant="default" // This will use the new "Liquid Fill Gradient Shift"
              size="lg"
              className="w-full h-20 md:h-24 text-lg md:text-xl shadow-lg group text-[hsl(var(--neutral-50))] hover:text-[hsl(var(--foreground))]" // Initial text color for dark bg
            >
              <span className="relative z-10">BPL Operations</span>
              <ArrowRight className="ml-2 h-5 w-5 md:h-6 md:w-6 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
            </Button>
          </Link>
          <Link href="/bpl-sales" passHref>
            <Button
              variant="default" // This will use the new "Liquid Fill Gradient Shift"
              size="lg"
              className="w-full h-20 md:h-24 text-lg md:text-xl shadow-lg group text-[hsl(var(--neutral-50))] hover:text-[hsl(var(--foreground))]" // Initial text color for dark bg
            >
              <span className="relative z-10">BPL Channel Partner</span>
              <ArrowRight className="ml-2 h-5 w-5 md:h-6 md:w-6 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer: Subtle, elegant */}
      <footer className="absolute bottom-4 w-full text-center text-gray-400 text-xs md:text-sm py-2 z-10">
        © {new Date().getFullYear()} Brick & Bolt. All rights reserved.
      </footer>
    </div>
  );
}

    