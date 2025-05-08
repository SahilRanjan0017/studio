// @/components/bpl/bpl-footer.tsx
import Link from 'next/link';

export function BplFooter() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-8 text-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-xl font-bold text-white mb-4">
            Brick & Bolt Premier League
          </div>
          <p className="text-sm opacity-80 mb-4">
            © {new Date().getFullYear()} Brick & Bolt. All rights reserved.
            <br />
            Innovating construction, one project at a time.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Link href="#" className="text-sm hover:text-white hover:underline opacity-80 transition-opacity">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm hover:text-white hover:underline opacity-80 transition-opacity">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm hover:text-white hover:underline opacity-80 transition-opacity">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
