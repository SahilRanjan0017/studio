// src/app/bpl-sales/page.tsx
import { Construction } from 'lucide-react';

export default function BplSalesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-secondary/10 to-accent/10 p-6 text-center">
      <Construction size={64} className="text-primary mb-6" />
      <h1 className="text-4xl font-bold text-primary mb-4">
        BPL Sales Portal
      </h1>
      <p className="text-xl text-muted-foreground mb-8">
        This section is currently under construction. Exciting features coming soon!
      </p>
      <p className="text-md text-foreground">
        Stay tuned for updates on our new Sales Premier League portal.
      </p>
    </div>
  );
}
