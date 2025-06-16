// src/app/leaderboard/page.tsx
import { redirect } from 'next/navigation';

/**
 * This page redirects to the BPL Operations Leaderboard page.
 * The root /leaderboard page was causing build errors as it was not wrapped
 * by the CityFilterProvider.
 */
export default function LeaderboardRedirectPage() {
  redirect('/bpl-ops/leaderboard');
  // redirect() throws an error to stop rendering, so this return is mostly for type completeness.
  return null;
}
