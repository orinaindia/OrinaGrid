/** Who it is for: a home, a housing society, a business. Each with what the subsidy gives it. */
import Image from 'next/image';
import Link from 'next/link';
import { Arrow } from '@/components/ui/ButtonLink';
import { PHOTOS } from '@/lib/photos';
import { inr, SOLAR } from '@/lib/solar';

const KINDS = [
  {
    image: PHOTOS.home,
    title: 'Homes',
    size: '1 to 10 kW',
    text: 'A flat RCC roof or a tin shed. The bill drops from the first month.',
    subsidy: `Up to ${inr(SOLAR.maxSubsidy)} subsidy`,
  },
  {
    image: PHOTOS.society,
    title: 'Housing societies',
    size: '5 to 100+ kW',
    text: 'Lifts, pumps and common lights on the sun, and lower maintenance for every flat.',
    subsidy: '₹18,000 a kW subsidy',
  },
  {
    image: PHOTOS.business,
    title: 'Shops, offices and factories',
    size: '10 kW and up',
    text: 'Day-time power at a fraction of the commercial tariff, on a roof you already have.',
    subsidy: 'Faster payback on business tariffs',
  },
];

export function Segments() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="t-eyebrow" data-reveal>
              Solar for every roof
            </p>
            <h2 data-split className="t-h2 mt-6 max-w-[16ch]">
              Whatever is under your roof, it can run on the sun.
            </h2>
          </div>
          <p className="max-w-sm text-slate" data-reveal>
            On-grid systems with a net meter: what you do not use goes to the grid and comes off your bill.
          </p>
        </div>

        <ul className="mt-14 grid gap-4 md:grid-cols-3">
          {KINDS.map((k) => (
            <li key={k.title} data-reveal>
              <Link
                href="/contact"
                className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-3xl bg-ink-2 text-on-ink"
              >
                <Image
                  src={k.image}
                  alt=""
                  fill
                  placeholder="blur"
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                <div className="relative p-6 sm:p-7">
                  <span className="rounded-full bg-white/15 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-wider backdrop-blur">
                    {k.size}
                  </span>
                  <p className="t-h3 mt-4">{k.title}</p>
                  <p className="mt-2 text-sm text-on-ink/80">{k.text}</p>
                  <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/15 pt-4">
                    <span className="text-sm font-medium text-sun">{k.subsidy}</span>
                    <span className="grid size-9 place-items-center rounded-full bg-on-ink text-ink transition-transform duration-500 group-hover:translate-x-1">
                      <Arrow />
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
