/** PIN code → district and state, on the server only (the table is ~700 kB; the browser asks /api/pin). */
import 'server-only';
import pins from '@/data/pins.json';
import type { Place } from './geo';

// JSON arrays type as string[]; the build script writes [district, state]
const PINS = pins as unknown as Record<string, [string, string]>;

export function placeOf(pin: string): Place | null {
  const hit = PINS[pin.trim()];
  return hit ? { district: hit[0], state: hit[1] } : null;
}
