// src/app/city-views/page.tsx
import { redirect } from 'next/navigation';

/**
 * This page redirects to the City Views page located under the BPL Operations section.
 * The original /city-views page was causing build errors as it was not wrapped
 * by the CityFilterProvider, unlike /bpl-ops/city-views.
 */
export default function CityViewsRedirectPage() {
  redirect('/bpl-ops/city-views');
  // redirect() throws an error to stop rendering, so this return is mostly for type completeness.
  return null;
}
