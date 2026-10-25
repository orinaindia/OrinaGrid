import type { Metadata } from 'next';
import { SpotPapers } from '@/components/art/Spots';
import { Faq, FAQ } from '@/components/home/Faq';
import { SystemParts } from '@/components/how/SystemParts';
import { Timeline } from '@/components/how/Timeline';
import { Motion } from '@/components/motion/Motion';
import { PageHero } from '@/components/site/PageHero';
import { SurveySection } from '@/components/site/SurveySection';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Spark } from '@/components/ui/Spark';
import { PHOTOS } from '@/lib/photos';

export const metadata: Metadata = {
  title: 'How it works',
  description:
    'From your first call to the subsidy in your bank: the free survey, the quotation, installation, the net meter and the PM Surya Ghar subsidy, step by step.',
};

const PAPERS = [
  'A recent electricity bill (it has your consumer number)',
  'Aadhaar card of the person the connection is in the name of',
  'Bank passbook or a cancelled cheque, for the subsidy',
  'Proof the roof is yours: a property tax bill or the sale deed',
  'A mobile number and an email for the national portal',
];

export default function HowItWorks() {
  return (
    <Motion>
      <PageHero
        eyebrow="How it works"
        title="Five steps, one partner, nothing left to you."
        image={[PHOTOS.install, 'Two installers fixing a solar panel onto its frame on a flat roof']}
        lead="You tell us where the roof is. The Orina Grid partner for your district does the rest: survey, quotation, installation, the net meter and the subsidy paperwork."
      >
        <ButtonLink href="#survey">Book a free site survey</ButtonLink>
      </PageHero>

      <section className="section border-t border-rule">
        <div className="wrap">
          <Timeline />
        </div>
      </section>

      <SystemParts />

      <section className="section bg-sunk">
        <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div>
            <p className="t-eyebrow" data-reveal>
              Papers
            </p>
            <h2 data-split className="t-h2 mt-6 max-w-[14ch]">
              Keep these ready. That is all you do.
            </h2>
            <p className="mt-6 max-w-md text-slate" data-reveal>
              Your partner fills the forms with your electricity company and on the PM Surya Ghar portal, and
              tells you if anything else is needed for your connection.
            </p>
            <SpotPapers className="mt-10 h-44 w-auto" />
          </div>
          <ul className="divide-y divide-rule border-y border-rule">
            {PAPERS.map((p) => (
              <li key={p} className="flex items-start gap-4 py-6" data-reveal>
                <Spark className="mt-1.5 size-3.5 shrink-0 text-accent" />
                <span className="text-[1.05rem]">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Faq items={FAQ.slice(2, 6)} title="Before you start" />
      <SurveySection />
    </Motion>
  );
}
