import type { Metadata } from 'next';
import { SpotDistrict, SpotGrid, SpotLeads } from '@/components/art/Spots';
import { PartnerForm } from '@/components/forms/PartnerForm';
import { Motion } from '@/components/motion/Motion';
import { GridShowcase } from '@/components/partners/GridShowcase';
import { PageHero } from '@/components/site/PageHero';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Spark } from '@/components/ui/Spark';
import { PHOTOS } from '@/lib/photos';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'For solar partners',
  description:
    'Install rooftop solar? Become the Orina Grid partner for your district: leads by PIN code, and the Orina Grid software to run leads, quotations and your team.',
};

const DEAL_ART = [SpotDistrict, SpotLeads, SpotGrid];

const DEAL = [
  [
    'Your district, only yours',
    'One partner a district. Every home in it that comes to Orina Grid comes to you.',
  ],
  [
    'Leads by PIN code',
    'Orina Grid’s campaigns and Orina Care referrals, sent to your team the moment they come in.',
  ],
  [
    'Orina Grid for your team',
    'The software for leads, surveys, GST quotations with the subsidy, and roles for your people.',
  ],
];

const LOOK_FOR = [
  'Your own installation team, and rooftop systems already running in your area',
  'Experience with net metering and the PM Surya Ghar portal, or the will to learn it',
  'GST registration, and a vendor registration on the portal (or ready to apply)',
  'Service after the sale: you will be the name homes in your district call',
];

const JOIN = [
  ['Apply', 'The form below, or a call. Two minutes.'],
  ['We talk', 'Your work, your area, your team. Orina Grid calls within a few working days.'],
  ['We visit', 'Your office and a few of your installations.'],
  ['Your district', 'The agreement, and your district on the Orina map.'],
  ['Grid, set up', 'Your catalogue, prices and team in Orina Grid. Leads start coming.'],
];

export default function Partners() {
  return (
    <Motion>
      <PageHero
        eyebrow="For solar businesses"
        title="Be the Orina Grid partner for your district."
        image={[PHOTOS.partner, 'A solar installation business reviewing its leads on a laptop']}
        lead="Orina brings the homes. You bring the installation. And Orina Grid runs everything in between: leads, surveys, quotations and your team."
      >
        <ButtonLink href="#apply">Apply for your district</ButtonLink>
      </PageHero>

      <section className="section border-t border-rule">
        <div className="wrap">
          <ul className="grid gap-px overflow-hidden rounded-3xl border border-rule bg-rule md:grid-cols-3">
            {DEAL.map(([t, d], i) => {
              const Art = DEAL_ART[i]!;
              return (
                <li key={t} className="bg-paper p-7 md:p-10" data-reveal>
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-mono text-sm text-accent">0{i + 1}</span>
                    <Art className="h-28 w-auto" />
                  </div>
                  <h2 className="t-h3 mt-6">{t}</h2>
                  <p className="mt-3 text-slate">{d}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="section bg-sunk">
        <div className="wrap">
          <div className="max-w-3xl">
            <p className="t-eyebrow" data-reveal>
              Orina Grid
            </p>
            <h2 data-split className="t-h2 mt-6 max-w-[18ch]">
              The software your solar business runs on.
            </h2>
            <p className="mt-6 max-w-xl text-slate" data-reveal>
              Built for Indian rooftop solar: PIN codes, GST, the PM Surya Ghar subsidy, WhatsApp. Included
              for every Orina Grid partner.
            </p>
          </div>
          <div className="mt-16 lg:mt-8">
            <GridShowcase />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="t-eyebrow" data-reveal>
              Who we look for
            </p>
            <h2 data-split className="t-h2 mt-6 max-w-[14ch]">
              Installers homes can trust.
            </h2>
            <ul className="mt-10 space-y-5">
              {LOOK_FOR.map((t) => (
                <li key={t} className="flex gap-4" data-reveal>
                  <Spark className="mt-1.5 size-3.5 shrink-0 text-accent" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="t-eyebrow" data-reveal>
              How joining works
            </p>
            <ol className="mt-6 divide-y divide-rule border-y border-rule">
              {JOIN.map(([t, d], i) => (
                <li key={t} className="grid grid-cols-[3rem_1fr] gap-4 py-6" data-reveal>
                  <span className="font-mono text-sm text-accent">0{i + 1}</span>
                  <div>
                    <p className="font-medium">{t}</p>
                    <p className="mt-1 text-slate">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="apply" className="section scroll-mt-[var(--header-h)] bg-ink text-on-ink">
        <div className="wrap grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="t-eyebrow !text-on-ink-soft" data-reveal>
              Apply
            </p>
            <h2 data-split className="t-h2 mt-6 max-w-[14ch]">
              Is your district still open?
            </h2>
            <p className="mt-6 max-w-md text-on-ink-soft" data-reveal>
              Tell us who you are and where you work. If your district has no partner yet, we will call to
              talk it through.
            </p>
            <p className="mt-10 text-sm text-on-ink-soft" data-reveal>
              Or call{' '}
              <a
                href={SITE.phoneHref}
                className="t-num font-medium text-on-ink underline-offset-4 hover:underline"
              >
                {SITE.phone}
              </a>
            </p>
          </div>
          <div className="rounded-3xl bg-surface p-6 text-ink sm:p-10" data-reveal>
            <PartnerForm />
          </div>
        </div>
      </section>
    </Motion>
  );
}
