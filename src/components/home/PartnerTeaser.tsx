/**
 * For the solar businesses reading the home page: how a lead reaches a partner in Orina Grid,
 * step by step, over a photograph of the kind of office that runs on it.
 */
import Image from 'next/image';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { PHOTOS } from '@/lib/photos';

const FLOW = [
  ['A home asks', 'Kiran Pawar, PIN 422001, bill ₹4,000'],
  ['Grid reads the PIN', 'Nashik district, Maharashtra'],
  ['To the district’s partner', 'Deshmukh Solar, Nashik'],
  ['To the right salesperson', 'Amit: the fewest open leads'],
];

const POINTS = [
  [
    'Leads by PIN code',
    'Orina campaigns and Orina Care referrals for your district come to you, and only you.',
  ],
  ['Quotations in minutes', 'GST split, the subsidy worked out, a PDF with your logo.'],
  ['Your whole team', 'Owner, sales, site and accounts, each with their own view.'],
];

export function PartnerTeaser() {
  return (
    <section className="section bg-ink text-on-ink">
      <div className="wrap">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="t-eyebrow !text-on-ink-soft" data-reveal>
              For solar installers
            </p>
            <h2 data-split className="t-h2 mt-6 max-w-[17ch]">
              Run your solar business on Orina Grid.
            </h2>
          </div>
          <div data-reveal>
            <ButtonLink href="/partners" tone="on-ink">
              Become a partner
            </ButtonLink>
          </div>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-[1.25fr_1fr]">
          {/* on a phone the steps follow the photograph; from sm up they lie over its foot */}
          <div className="relative overflow-hidden rounded-3xl bg-ink-2 sm:min-h-[26rem]" data-reveal>
            <div className="relative aspect-[16/10] sm:absolute sm:inset-0 sm:aspect-auto">
              <Image
                src={PHOTOS.partner}
                placeholder="blur"
                alt="A small solar business office reviewing leads on a laptop"
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
            </div>
            {/* how one lead travels, as Grid records it */}
            <ol className="relative grid gap-2 p-4 sm:absolute sm:inset-x-6 sm:bottom-6 sm:grid-cols-2 sm:p-0">
              {FLOW.map(([t, d], i) => (
                <li key={t} className="rounded-2xl border border-white/10 bg-ink/70 p-4 backdrop-blur-md">
                  <p className="font-mono text-[0.7rem] uppercase tracking-wider text-sun">
                    0{i + 1} · {t}
                  </p>
                  <p className="mt-1.5 text-sm">{d}</p>
                </li>
              ))}
            </ol>
          </div>
          <ul className="grid gap-4">
            {POINTS.map(([t, d]) => (
              <li key={t} className="rounded-3xl border border-white/10 bg-ink-2 p-6 sm:p-8" data-reveal>
                <p className="t-h3">{t}</p>
                <p className="mt-2 text-on-ink-soft">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
