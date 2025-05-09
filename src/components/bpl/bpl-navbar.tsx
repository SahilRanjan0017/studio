// @/components/bpl/bpl-navbar.tsx
'use client';

import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from 'react';

const navLinks = [
  { href: "#", label: "Dashboard", active: true },
  { href: "#leaderboard", label: "Leaderboard" },
  { href: "#rules", label: "Rules" },
];

export function BplNavbar() {
  const [activeLink, setActiveLink] = useState("Dashboard");
  const [cityFilter, setCityFilter] = useState("pan_india");

  return (
    <nav className="bg-card shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-3">
          <ul className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-8 mb-3 md:mb-0">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setActiveLink(link.label)}
                  className={`font-semibold px-3 py-2 rounded-md transition-colors duration-300
                    ${activeLink === link.label
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-primary/10 hover:text-primary'
                    }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label htmlFor="city-filter" className="text-sm font-medium text-muted-foreground whitespace-nowrap">Filter by City:</label>
            <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger id="city-filter" className="w-full sm:w-[180px] bg-card h-9">
                <SelectValue placeholder="Select City" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="pan_india">Pan India</SelectItem>
                <SelectItem value="BLR_A">BLR_A</SelectItem>
                <SelectItem value="BLR_B">BLR_B</SelectItem>
                <SelectItem value="CHN">CHN</SelectItem>
                <SelectItem value="NCR">NCR</SelectItem>
                <SelectItem value="HYD">HYD</SelectItem>
            </SelectContent>
            </Select>
        </div>
        </div>
      </div>
    </nav>
  );
}
