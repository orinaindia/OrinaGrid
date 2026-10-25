'use client';

/**
 * "What do I save?": the monthly bill in, the system and the money out. The same rules as an
 * Orina Grid quotation (src/lib/solar.ts); the partner's survey gives the final price.
 */
import { useId, useState } from 'react';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { estimate, inr, inrRange, inrShort, SOLAR } from '@/lib/solar';

const { min: MIN, max: MAX, step: STEP } = SOLAR.bill;

export function Calculator() {
  const [bill, setBill] = useState(2500);
  const e = estimate(bill);
  const id = useId();
  const fill = ((bill - MIN) / (MAX - MIN)) * 100;

  const rows: [string, string][] = [
    ['System size', `${e.kw} kW`],
    ['It makes', `${e.unitsPerMonth.toLocaleString('en-IN')} units a month`],
    ['Price incl. GST', inrRange(e.price.low, e.price.high)],
    ['PM Surya Ghar subsidy', `− ${inr(e.subsidy)}`],
  ];

  return (
    <section id="savings" className="section scroll-mt-[var(--header-h)] bg-ink text-on-ink">
      <div className="wrap grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <div>
          <p className="t-eyebrow !text-on-ink-soft" data-reveal>
            What you save
          </p>
          <h2 data-split className="t-h2 mt-6 max-w-[18ch]">
            Move the bill. See the system, the subsidy and what you pay.
          </h2>
          <p className="mt-6 max-w-md text-on-ink-soft" data-reveal>
            Worked out the way an Orina Grid partner quotes: {SOLAR.unitsPerKwMonth} units a month from each
            kW, about ₹{SOLAR.rupeesPerUnit} a unit, and the PM Surya Ghar subsidy for homes. Your
            partner&apos;s survey gives the final price.
          </p>

          <div className="mt-12" data-reveal>
            <label htmlFor={id} className="flex items-baseline justify-between gap-4">
              <span className="text-on-ink-soft">Your monthly electricity bill</span>
              <output htmlFor={id} className="t-h2 t-num text-on-ink">
                {inr(bill)}
              </output>
            </label>
            <input
              id={id}
              type="range"
              min={MIN}
              max={MAX}
              step={STEP}
              value={bill}
              onChange={(ev) => setBill(Number(ev.target.value))}
              className="range mt-6 w-full"
              style={{ '--fill': `${fill}%` } as React.CSSProperties}
              aria-valuetext={`${inr(bill)} a month`}
            />
            <div className="mt-3 flex justify-between font-mono text-xs text-on-ink-soft">
              <span>{inr(MIN)}</span>
              <span>{inr(MAX)}</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-on-ink p-6 text-ink sm:p-10" data-reveal>
          <dl className="divide-y divide-rule">
            {rows.map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-6 py-4">
                <dt className="text-slate">{k}</dt>
                <dd className="t-num shrink-0 whitespace-nowrap text-right font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 rounded-2xl bg-accent-wash p-6">
            <p className="text-sm text-slate">You pay, after the subsidy</p>
            <p className="t-display t-num mt-2 text-accent">{inrRange(e.net.low, e.net.high)}</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-rule p-5">
              <p className="text-sm text-slate">Saved every month</p>
              <p className="t-h3 t-num mt-2 text-pos">{inr(e.savedPerMonth)}</p>
            </div>
            <div className="rounded-2xl border border-rule p-5">
              <p className="text-sm text-slate">Pays for itself in</p>
              <p className="t-h3 t-num mt-2">about {e.paybackYears} years</p>
            </div>
          </div>
          <p className="mt-6 text-sm text-slate">
            Over {SOLAR.years} years that is about{' '}
            <b className="t-num text-ink">{inrShort(e.lifetimeGain)}</b> more than the system costs.
          </p>
          <ButtonLink href={`/contact?bill=${bill}`} className="mt-8 w-full">
            Get the exact quote, free
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
