// src/app/dashboard/page.tsx
import { redirect } from 'next/navigation';

/**
 * This page redirects to the BPL Operations Dashboard page.
 * The root /dashboard page was causing build errors as it was not wrapped
 * by the CityFilterProvider.
 */
export default function DashboardRedirectPage() {
  redirect('/bpl-ops/dashboard');
  // redirect() throws an error to stop rendering, so this return is mostly for type completeness.
  return null;
}
