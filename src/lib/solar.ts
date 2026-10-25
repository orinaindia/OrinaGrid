/**
 * The savings estimate the site shows. The same rules as Orina Grid's quotes
 * (OrinaBackend/src/modules/quotes: subsidy.ts, pricing.ts), so a visitor's estimate and the
 * partner's quote speak the same numbers:
 *
 *   PM Surya Ghar (homes): ₹30,000 per kW for the first 2 kW, ₹18,000 for the 3rd, up to ₹78,000
 *   generation in most of India: about 4 units per kW a day (120 a month)
 *   a unit of electricity: about ₹7
 *
 * The price is a range, not a quote: the local partner surveys the roof and quotes the final one.
 */
export const SOLAR = {
  unitsPerKwMonth: 120,
  rupeesPerUnit: 7,
  /** Homes, supply and installation incl. GST, per kW (Grid's default quotes land in this range). */
  pricePerKw: { low: 50_000, high: 60_000 },
  subsidySlabs: [
    { uptoKw: 2, perKw: 30_000 },
    { uptoKw: 3, perKw: 18_000 },
  ],
  maxSubsidy: 78_000,
  /** The monthly bill the sliders take, in rupees. */
  bill: { min: 500, max: 12_000, step: 100 },
  minKw: 1,
  maxKw: 10,
  /** Panels keep making power for 25 years (performance warranty of DCR modules). */
  years: 25,
} as const;

/** PM Surya Ghar for a home of `kw`. */
export function subsidyFor(kw: number): number {
  let left = kw;
  let from = 0;
  let total = 0;
  for (const slab of SOLAR.subsidySlabs) {
    const here = Math.max(0, Math.min(left, slab.uptoKw - from));
    total += here * slab.perKw;
    left -= here;
    from = slab.uptoKw;
  }
  return Math.round(total);
}

/** The size that covers a monthly bill, in half-kW steps (1 to 10 kW). */
export function sizeForBill(bill: number): number {
  const kw = bill / SOLAR.rupeesPerUnit / SOLAR.unitsPerKwMonth;
  return Math.min(SOLAR.maxKw, Math.max(SOLAR.minKw, Math.ceil(kw * 2) / 2));
}

export interface Estimate {
  kw: number;
  unitsPerMonth: number;
  price: { low: number; high: number };
  subsidy: number;
  /** What the home pays after the subsidy. */
  net: { low: number; high: number };
  /** The bill it saves each month (at most the bill itself). */
  savedPerMonth: number;
  /** Years until the savings pay back the net price (on the higher price). */
  paybackYears: number;
  /** Savings over the panels' life, less the net price (on the higher price). */
  lifetimeGain: number;
}

const round100 = (n: number) => Math.round(n / 100) * 100;

export function estimate(bill: number, kw = sizeForBill(bill)): Estimate {
  const unitsPerMonth = Math.round(kw * SOLAR.unitsPerKwMonth);
  const price = { low: round100(kw * SOLAR.pricePerKw.low), high: round100(kw * SOLAR.pricePerKw.high) };
  const subsidy = subsidyFor(kw);
  const net = { low: Math.max(0, price.low - subsidy), high: Math.max(0, price.high - subsidy) };
  const savedPerMonth = Math.min(bill, unitsPerMonth * SOLAR.rupeesPerUnit);
  const perYear = savedPerMonth * 12;
  return {
    kw,
    unitsPerMonth,
    price,
    subsidy,
    net,
    savedPerMonth,
    paybackYears: perYear > 0 ? Math.round((net.high / perYear) * 10) / 10 : 0,
    lifetimeGain: Math.max(0, perYear * SOLAR.years - net.high),
  };
}

/** ₹1,56,100 */
export const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

const lakhs = (n: number) => (n / 1e5).toFixed(2).replace(/\.?0+$/, '');

/** ₹1.56 L, ₹78,000 */
export function inrShort(n: number): string {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2).replace(/\.?0+$/, '')} Cr`;
  if (n >= 1e5) return `₹${lakhs(n)} L`;
  return inr(n);
}

/** One unit for both ends: ₹45,000–60,000, or ₹0.72–1.02 L once the top reaches a lakh. */
export const inrRange = (low: number, high: number) =>
  high >= 1e5
    ? `₹${lakhs(low)}–${lakhs(high)} L`
    : `₹${Math.round(low).toLocaleString('en-IN')}–${Math.round(high).toLocaleString('en-IN')}`;
