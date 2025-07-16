// src/components/icons/TrophyIcon.tsx
import type React from 'react';
import { cn } from '@/lib/utils';

interface TrophyIconProps extends React.SVGProps<SVGSVGElement> {}

export function TrophyIcon({ className, ...props }: TrophyIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-8 w-8", className)}
      {...props}
    >
      <path d="M12.75 21a.75.75 0 0 1-.75-.75V18a.75.75 0 0 1 1.5 0v2.25a.75.75 0 0 1-.75.75Z" />
      <path
        fillRule="evenodd"
        d="M16.5 3.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0V3.75Zm-9 0a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0V3.75Z"
        clipRule="evenodd"
      />
      <path d="M12 2.25a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75Z" />
      <path
        fillRule="evenodd"
        d="M6.375 5.625a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75H7.125a.75.75 0 0 1-.75-.75v-.75ZM6 9.75A.75.75 0 0 1 6.75 9h10.5a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V9.75Z"
        clipRule="evenodd"
      />
      <path
        fillRule="evenodd"
        d="M12 1.5a5.25 5.25 0 0 1 5.25 5.25c0 1.638-1.02 3.034-2.484 3.865a.75.75 0 0 1-.532 1.294c-1.223.385-2.033.49-2.234.52-.02.002-.04.004-.06.007-.021.003-.042.005-.064.007a.75.75 0 0 1-.14 0c-.022-.002-.043-.004-.064-.007a5.043 5.043 0 0 1-.06-.007c-.201-.03-.984-.13-2.234-.52a.75.75 0 0 1-.532-1.294A5.234 5.234 0 0 1 6.75 6.75 5.25 5.25 0 0 1 12 1.5ZM8.281 9.043a3.75 3.75 0 0 1 7.438 0c.937-.598 1.531-1.637 1.531-2.793a3.75 3.75 0 1 0-7.5 0c0 1.156.594 2.195 1.531 2.793Z"
        clipRule="evenodd"
      />
      <path d="M14.25 18a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75Zm-5.25-.75a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75Z" />
    </svg>
  );
}
