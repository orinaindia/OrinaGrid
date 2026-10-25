/**
 * POST /api/enquiry: the site's forms.
 *
 *   home     forwarded to Orina Grid as a campaign lead (GRID_WEBHOOK_URL, with GRID_WEBHOOK_SECRET
 *            as the bearer): Grid gives it to the partner serving the PIN's district
 *   partner  forwarded to PARTNER_WEBHOOK_URL when set
 *
 * The webhook addresses and secret stay on the server. A form whose destination is not set says
 * so (503) with the phone number, never a false "sent". Bots: a hidden field and a per-address limit.
 */
import { check, mobileOf, parse } from '@/lib/enquiry';
import { placeOf } from '@/lib/pins.server';
import { SITE } from '@/lib/site';
import { sizeForBill } from '@/lib/solar';

const WINDOW_MS = 10 * 60_000;
const PER_WINDOW = 8;
/** Addresses remembered at most: past it, the quiet ones are forgotten (memory stays flat under load). */
const MAX_ADDRESSES = 10_000;
/** A form is a few hundred bytes; anything far larger is not one of ours. */
const MAX_BODY = 8 * 1024;
const seen = new Map<string, number[]>();

/** At most PER_WINDOW tries per address in WINDOW_MS (per server instance: a first wall). */
function tooMany(ip: string): boolean {
  const now = Date.now();
  if (seen.size >= MAX_ADDRESSES)
    for (const [key, times] of seen) if (now - (times.at(-1) ?? 0) >= WINDOW_MS) seen.delete(key);
  const recent = (seen.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  seen.set(ip, recent);
  return recent.length > PER_WINDOW;
}

/** The posted JSON, or null when it is too big or not JSON. */
async function bodyOf(request: Request): Promise<unknown> {
  if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY) return null;
  const text = await request.text().catch(() => '');
  if (!text || text.length > MAX_BODY) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

const answer = (status: number, body: Record<string, unknown>) => Response.json(body, { status });
const notYet = () =>
  answer(503, { message: `We could not send this just now. Please call or WhatsApp us on ${SITE.phone}.` });

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
  if (tooMany(ip)) return answer(429, { message: 'Too many tries. Please wait a few minutes.' });

  const e = parse(await bodyOf(request));
  if (!e) return answer(400, { message: 'The form could not be read.' });
  // a bot filled the hidden field: thank it and drop it
  if (e.website) return answer(202, { ok: true });
  const fields = check(e);
  if (Object.keys(fields).length) return answer(400, { message: 'Please check the form.', fields });

  const phone = mobileOf(e.phone);
  const name = e.name.trim().replace(/\s+/g, ' ');

  if (e.kind === 'home') {
    // the PIN decides the partner in Grid: it has to be in the district they chose
    const place = placeOf(e.pin);
    if (place && place.district !== e.district.trim())
      return answer(400, {
        message: 'Please check the form.',
        fields: {
          pin: `${e.pin.trim()} is in ${place.district}, ${place.state}. Please check the PIN or the district.`,
        },
      });
    const url = process.env.GRID_WEBHOOK_URL;
    const secret = process.env.GRID_WEBHOOK_SECRET;
    if (!url || !secret) return notYet();
    const { bill } = e;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${secret}` },
      body: JSON.stringify({
        id: `web-${crypto.randomUUID()}`,
        name,
        phone,
        pin: e.pin.trim(),
        segment: e.segment,
        campaign: 'Website',
        ...(bill ? { monthlyBill: bill, sizeKw: sizeForBill(bill) } : {}),
      }),
      signal: AbortSignal.timeout(8000),
    }).catch(() => null);
    if (!res?.ok) return notYet();
    return answer(202, { ok: true });
  }

  const url = process.env.PARTNER_WEBHOOK_URL;
  if (!url) return notYet();
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      name,
      phone,
      business: e.business.trim(),
      state: e.state.trim(),
      district: e.district.trim(),
      message: e.message?.trim() ?? '',
    }),
    signal: AbortSignal.timeout(8000),
  }).catch(() => null);
  if (!res?.ok) return notYet();
  return answer(202, { ok: true });
}
