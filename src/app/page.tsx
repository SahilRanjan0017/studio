// src/app/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import CompanyLogo from '@/components/CompanyLogo'; // Import the CompanyLogo component

export default function LandingPage() {
  return (
    <div 
      className="relative flex flex-col items-center justify-center min-h-screen p-6 bg-cover bg-center"
      style={{ backgroundImage: "url('https://i.ibb.co/Kgq9rmH/pexels-tomfisk-2101137.jpg')" }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Content container, z-index to be above overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full">
        <header className="text-center mb-12">
          <div className="mb-6">
            <CompanyLogo />
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-2"> {/* Changed text color to white for contrast */}
            Welcome to Brick & Bolt
          </h1>
          <p className="text-xl text-gray-200">Choose your portal:</p> {/* Adjusted text color */}
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
          <Link href="/bpl-ops/dashboard" passHref>
            <Button
              variant="default"
              size="lg"
              className="w-full h-24 text-xl shadow-lg hover:shadow-xl transition-shadow duration-300 group bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-primary-foreground"
            >
              BPL Operations
              <ArrowRight className="ml-2 h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/bpl-sales" passHref>
            <Button
              variant="secondary"
              size="lg"
              className="w-full h-24 text-xl shadow-lg hover:shadow-xl transition-shadow duration-300 group bg-gradient-to-r from-secondary to-amber-500 hover:from-secondary/90 hover:to-amber-500/90 text-secondary-foreground"
            >
              BPL Channel Partner {/* Changed text here */}
              <ArrowRight className="ml-2 h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <footer className="absolute bottom-8 text-center text-gray-300 text-sm"> {/* Adjusted text color */}
          © {new Date().getFullYear()} Brick & Bolt. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
