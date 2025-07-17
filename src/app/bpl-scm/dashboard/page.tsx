// @/app/bpl-scm/dashboard/page.tsx
import { ShoppingCart } from 'lucide-react';

export default function BplScmDashboardPage() {
  return (
    <div 
      className="relative min-h-screen py-6 bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('https://i.postimg.cc/7Yp1qt0n/Gemini-Generated-Image-krvb48krvb48krvb.jpg')" }}
      data-ai-hint="warehouse logistics"
    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
            <ShoppingCart size={48} className="mx-auto text-primary-foreground/50 mb-4" />
            <h1 className="text-4xl font-bold text-primary-foreground">SCM Dashboard</h1>
            <p className="text-center text-primary-foreground/80 mt-2">
              Content and leaderboards are coming soon.
            </p>
        </div>
      </div>
    </div>
  );
}
