// src/app/rules/page.tsx
import { redirect } from 'next/navigation';

/**
 * This page redirects to the BPL Operations Rules page.
 * The root /rules page might cause issues if any future component uses
 * context not available at this level.
 */
export default function RulesRedirectPage() {
  redirect('/bpl-ops/rules');
  // redirect() throws an error to stop rendering, so this return is mostly for type completeness.
  return null;
}
