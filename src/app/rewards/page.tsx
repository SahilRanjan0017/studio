// src/app/rewards/page.tsx
import { redirect } from 'next/navigation';

/**
 * This page redirects to the BPL Operations Rewards page.
 * The root /rewards page might cause issues if any future component uses
 * context not available at this level.
 */
export default function RewardsRedirectPage() {
  redirect('/bpl-ops/rewards');
  // redirect() throws an error to stop rendering, so this return is mostly for type completeness.
  return null;
}
