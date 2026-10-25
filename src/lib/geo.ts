/**
 * India's states and districts for the pickers (India Post's directory, built by
 * scripts/build-geo.mjs). PIN codes are looked up on the server: src/lib/pins.server.ts.
 */
import districts from '@/data/districts.json';

export const DISTRICTS: Record<string, string[]> = districts;
export const STATES = Object.keys(DISTRICTS);

export const districtsOf = (state: string) => DISTRICTS[state] ?? [];

/** Where a PIN is, as /api/pin answers. */
export interface Place {
  district: string;
  state: string;
}
