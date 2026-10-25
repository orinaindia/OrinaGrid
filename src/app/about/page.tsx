import type { Metadata } from 'next';
import { SpotCall, SpotDistrict, SpotQuote, SpotStamp } from '@/components/art/Spots';
import { Motion } from '@/components/motion/Motion';
import { PageHero } from '@/components/site/PageHero';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { PHOTOS } from '@/lib/photos';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About Orina',
  description:
    'Orina Grid, by Orina LLP of Talod and Gandhinagar: rooftop solar across India through one trusted partner in each district, and the software they run on.',
};

const BELIEF_ART = [SpotQuote, SpotDistrict, SpotStamp, SpotCall];

const BELIEFS = [
  [
    'A price you can read',
    'Every quotation shows the material, the work, the GST on each and the subsidy, before you pay anything.',
  ],
  [
    'Someone nearby',
    'Solar lasts 25 years. The business that installs it should be in your district, not a call centre away.',
  ],
  [
    'The paperwork is ours',
    'The net meter and the subsidy are where homes get stuck. Your partner does them for you.',
  ],
  [
    'Orina Grid stays in the loop',
    `If something is not right with your partner, call Orina Grid on ${SITE.phone}.`,
  ],
];

export default function About() {
  return (
    <Motion>
      <PageHero
        eyebrow="About Orina"
        title="One trusted solar partner in every district of India."
        image={[PHOTOS.hero, 'Rooftops of an Indian neighbourhood with solar panels']}
        lead="Orina Grid is built by Orina LLP, which has worked with businesses for over 13 years across manufacturing, finance and government projects. It brings homes and local installers together, and gives every installer the same clear way of working."
      />

      <section className="section border-t border-rule">
        <div className="wrap">
          <p className="t-eyebrow" data-reveal>
            Why a partner in each district
          </p>
          <p data-split className="t-display mt-6 max-w-[22ch]">
            Rooftop solar is a 25-year decision. It should be made with someone you can find.
          </p>
        </div>
      </section>

      <section className="section bg-sunk">
        <div className="wrap">
          <p className="t-eyebrow" data-reveal>
            What we hold to
          </p>
          <ul className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-rule bg-rule sm:grid-cols-2">
            {BELIEFS.map(([t, d], i) => {
              const Art = BELIEF_ART[i]!;
              return (
                <li key={t} className="bg-paper p-7 md:p-10" data-reveal>
                  <Art className="mb-8 h-28 w-auto" />
                  <h2 className="t-h3">{t}</h2>
                  <p className="mt-3 max-w-md text-slate">{d}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div>
            <p className="t-eyebrow" data-reveal>
              Who is behind it
            </p>
            <h2 data-split className="t-h2 mt-6 max-w-[14ch]">
              Built by people who have run businesses.
            </h2>
          </div>
          <div className="space-y-6 text-[1.05rem]" data-reveal>
            <p>
              Orina was founded by <b className="font-medium">Saurabh Rameshchandra Patel</b>, its Managing
              Director, after more than 13 years in manufacturing, corporate finance, government tender
              projects and general management.
            </p>
            <p className="text-slate">
              The same work, helping businesses decide where to grow and what to fix, led Orina to rooftop
              solar: good local installers, and homes that did not know whom to trust. Orina Grid connects the
              two, and gives every partner the same software to run on.
            </p>
          </div>
        </div>
      </section>

      <section className="section border-t border-rule">
        <div className="wrap">
          <p className="t-eyebrow" data-reveal>
            Offices
          </p>
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {SITE.offices.map((o) => (
              <li key={o.name} data-reveal>
                <a
                  href={o.map}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col justify-between gap-10 rounded-3xl border border-rule bg-surface p-7 transition-colors duration-300 hover:border-ink md:p-10"
                >
                  <div>
                    <p className="t-h3">{o.name}</p>
                    <address className="mt-4 not-italic text-slate">
                      {o.lines.map((l) => (
                        <span key={l} className="block">
                          {l}
                        </span>
                      ))}
                    </address>
                  </div>
                  <span className="text-sm font-medium text-accent">
                    Open in Maps <span aria-hidden>↗</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-14 flex flex-col gap-3 sm:flex-row" data-reveal>
            <ButtonLink href="/contact">Talk to us</ButtonLink>
            <ButtonLink href="/partners" tone="ghost">
              Become a partner
            </ButtonLink>
          </div>
        </div>
      </section>
    </Motion>
  );
}
