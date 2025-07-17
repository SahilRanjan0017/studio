// src/components/bpl/PopupBanner.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PopupBannerProps {
  imageUrl: string;
  linkHref: string;
}

export function PopupBanner({ imageUrl, linkHref }: PopupBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show the popup after a short delay to ensure the page has loaded
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/70 transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={handleClose} // Close if clicking on the overlay
    >
      <div
        className={cn(
          "relative transform transition-all duration-300",
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        )}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the popup itself
      >
        <button
          onClick={handleClose}
          className="absolute -top-3 -right-3 z-10 p-1.5 bg-white rounded-full text-gray-800 hover:bg-gray-200 transition-colors shadow-lg"
          aria-label="Close popup"
        >
          <X size={20} />
        </button>
        <Link href={linkHref} passHref>
          <div className="block cursor-pointer rounded-lg overflow-hidden shadow-2xl">
            <Image
              src={imageUrl}
              alt="Promotional Banner"
              width={600}
              height={400}
              className="max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl"
              unoptimized // Use unoptimized for external images like from i.postimg.cc
            />
          </div>
        </Link>
      </div>
    </div>
  );
}
