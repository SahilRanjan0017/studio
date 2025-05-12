// @/components/bpl/bpl-footer.tsx

export function BplFooter() {
  return (
    <footer className="bg-slate-100 text-slate-600 py-6 text-center border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sm">
          © {new Date().getFullYear()} Brick & Bolt. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
