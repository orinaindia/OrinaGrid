import type { Metadata } from 'next';
import { PartnerPromise } from '@/components/home/PartnerPromise';
import { Motion } from '@/components/motion/Motion';
import { PartnerFinder } from '@/components/partners/PartnerFinder';
import { PageHero } from '@/components/site/PageHero';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { STATES } from '@/lib/geo';

export const metadata: Metadata = {
  title: 'Find your district partner',
  description:
    'Choose your state and district and book a free rooftop solar survey with the Orina Grid partner who serves it.',
};

export default function FindAPartner() {
  return (
    <Motion>
      <PageHero
        eyebrow="Find a partner"
        title="The solar business that serves your district."
        lead={`One Orina Grid partner a district, across ${STATES.length} states and union territories. Choose yours and book the free survey.`}
      />

      <section className="pb-[var(--sp-section)]">
        <div className="wrap" data-reveal>
          <PartnerFinder />
        </div>
      </section>

      <PartnerPromise />

      <section className="section bg-ink text-on-ink">
        <div className="wrap flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="t-eyebrow !text-on-ink-soft" data-reveal>
              For solar installers
            </p>
            <h2 data-split className="t-h2 mt-6 max-w-[18ch]">
              No partner in your district yet? It could be you.
            </h2>
          </div>
          <div data-reveal>
            <ButtonLink href="/partners" tone="on-ink">
              Become a partner
            </ButtonLink>
          </div>
        </div>
      </section>
    </Motion>
  );
}
