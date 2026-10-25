/** GET /api/pin/383215 → { district, state }, or 404 for a PIN India Post does not list. */
import { isPin } from '@/lib/enquiry';
import { placeOf } from '@/lib/pins.server';

export async function GET(_request: Request, { params }: { params: Promise<{ pin: string }> }) {
  const { pin } = await params;
  const place = isPin(pin) ? placeOf(pin) : null;
  if (!place) return Response.json({ message: 'We do not know this PIN code.' }, { status: 404 });
  // India Post's table changes a few times a year: let browsers and the CDN keep the answer
  return Response.json(place, { headers: { 'cache-control': 'public, max-age=86400, s-maxage=604800' } });
}
