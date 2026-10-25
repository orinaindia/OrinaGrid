/** Why a local partner: one business near you does all of it, and stays. */
import { SpotDistrict } from '@/components/art/Spots';
import { ButtonLink } from '@/components/ui/ButtonLink';

const DOES = [
  ['Surveys your roof', 'Shade, strength, direction and your connection, before any price.'],
  ['Quotes it clearly', 'One quotation with the brands, GST and subsidy, line by line.'],
  [
    'Installs with their own team',
    'Structure, panels, inverter, wiring and earthing, tested before handover.',
  ],
  [
    'Handles the paperwork',
    'The net meter with your electricity company, and the subsidy on the national portal.',
  ],
  ['Stays nearby', 'Cleaning and service from someone in your district, not a call centre.'],
];

export function PartnerPromise() {
  return (
    <section className="section border-t border-rule">
      <div className="wrap grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
          <p className="t-eyebrow" data-reveal>
            Your district partner
          </p>
          <h2 data-split className="t-h2 mt-6 max-w-[14ch]">
            One business near you. From survey to subsidy.
          </h2>
          <p className="mt-6 max-w-md text-slate" data-reveal>
            Orina works with one solar business in each district. Your PIN code decides who: the partner who
            serves your district, and only them.
          </p>
          <div className="mt-8" data-reveal>
            <ButtonLink href="/how-it-works" tone="ghost">
              How it works
            </ButtonLink>
          </div>
          <SpotDistrict className="mt-12 hidden h-44 w-auto lg:block" />
        </div>
        <ol className="divide-y divide-rule border-y border-rule">
          {DOES.map(([t, d], i) => (
            <li key={t} className="grid grid-cols-[3rem_1fr] gap-4 py-7 md:py-9" data-reveal>
              <span className="font-mono text-sm text-accent">0{i + 1}</span>
              <div>
                <p className="t-h3">{t}</p>
                <p className="mt-2 text-slate">{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
