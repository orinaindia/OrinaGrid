/**
 * What the site's forms send to /api/enquiry, and the checks both sides share.
 *   home     a home, society or business asking for a site survey: forwarded to Orina Grid as a
 *            campaign lead (its PIN decides the district partner)
 *   partner  a solar business asking to become an Orina Grid partner
 */
/** The kinds of place Orina Grid quotes for (Grid's lead segments). */
export const SEGMENTS = [
  { key: 'residential', label: 'Home', hint: 'A house or a flat with its own roof' },
  { key: 'group_housing', label: 'Housing society', hint: 'Common areas of a society or RWA' },
  { key: 'commercial', label: 'Shop, office or factory', hint: 'A business roof or a shed' },
] as const;

export type Segment = (typeof SEGMENTS)[number]['key'];

export interface HomeEnquiry {
  kind: 'home';
  name: string;
  phone: string;
  state: string;
  district: string;
  pin: string;
  segment: Segment;
  /** The monthly bill in rupees, if they gave it (the slider, or the calculator's). */
  bill?: number;
  consent: boolean;
  /** Left empty by people; bots fill it. */
  website?: string;
}

export interface PartnerEnquiry {
  kind: 'partner';
  name: string;
  phone: string;
  business: string;
  state: string;
  district: string;
  message?: string;
  consent: boolean;
  website?: string;
}

export type Enquiry = HomeEnquiry | PartnerEnquiry;

export type Field = 'name' | 'phone' | 'state' | 'district' | 'pin' | 'business' | 'consent';
export type FieldErrors = Partial<Record<Field, string>>;

/** "+91 98250 12345", "098250 12345" → "9825012345"; '' when it is not an Indian mobile. */
export function mobileOf(raw: string): string {
  const all = raw.replace(/\D/g, '');
  const d = all.length > 10 ? all.replace(/^(91|0)/, '') : all;
  return /^[6-9]\d{9}$/.test(d) ? d : '';
}

export const isPin = (s: string) => /^[1-9]\d{5}$/.test(s.trim());

/** A posted body as an Enquiry, every field the type it should be; null when it is not a form of ours. */
export function parse(body: unknown): Enquiry | null {
  if (!body || typeof body !== 'object') return null;
  const b = body as Record<string, unknown>;
  const text = (v: unknown, max = 200) => (typeof v === 'string' ? v.slice(0, max) : '');
  const common = {
    name: text(b.name),
    phone: text(b.phone, 30),
    state: text(b.state, 100),
    district: text(b.district, 100),
    consent: b.consent === true,
    website: text(b.website),
  };
  if (b.kind === 'home') {
    const bill =
      typeof b.bill === 'number' && Number.isFinite(b.bill) && b.bill > 0 ? Math.round(b.bill) : undefined;
    const segment = SEGMENTS.find((s) => s.key === b.segment)?.key ?? 'residential';
    return {
      kind: 'home',
      ...common,
      pin: text(b.pin, 10),
      segment,
      ...(bill ? { bill: Math.min(bill, 1_000_000) } : {}),
    };
  }
  if (b.kind === 'partner')
    return { kind: 'partner', ...common, business: text(b.business), message: text(b.message, 1000) };
  return null;
}

/** The checks one step of a form needs (the home form asks in steps), or all of them. */
export function check(e: Enquiry, only?: Field[]): FieldErrors {
  const errors: FieldErrors = {};
  const name = e.name.trim();
  if (name.length < 2 || name.length > 100) errors.name = 'Please enter your name';
  if (!mobileOf(e.phone)) errors.phone = 'Please enter a 10-digit mobile number';
  if (!e.state.trim()) errors.state = 'Please choose your state';
  if (!e.district.trim()) errors.district = 'Please choose your district';
  if (e.kind === 'home' && !isPin(e.pin)) errors.pin = 'Please enter the 6-digit PIN code';
  if (e.kind === 'partner' && e.business.trim().length < 2)
    errors.business = 'Please enter your business name';
  if (!e.consent) errors.consent = 'Please agree so we can call you';
  if (!only) return errors;
  return Object.fromEntries(Object.entries(errors).filter(([k]) => only.includes(k as Field)));
}
