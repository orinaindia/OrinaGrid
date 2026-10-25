import type { Metadata } from 'next';
import { SpotDcr, SpotHome, SpotOnce, SpotSociety } from '@/components/art/Spots';
import { Calculator } from '@/components/home/Calculator';
import { Faq } from '@/components/home/Faq';
import { Motion } from '@/components/motion/Motion';
import { PageHero } from '@/components/site/PageHero';
import { SurveySection } from '@/components/site/SurveySection';
import { SubsidyBars } from '@/components/subsidy/SubsidyBars';
import { SubsidyRoute } from '@/components/subsidy/SubsidyRoute';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { PHOTOS } from '@/lib/photos';
import { inr, SOLAR } from '@/lib/solar';

export const metadata: Metadata = {
  title: 'PM Surya Ghar subsidy',
  description: `The PM Surya Ghar: Muft Bijli Yojana subsidy for rooftop solar: up to ${inr(SOLAR.maxSubsidy)} for a home, who can get it, and how your Orina Grid partner files it for you.`,
};

const WHO = [
  {
    art: SpotHome,
    title: 'Your own home',
    text: 'A house with a roof you own or have the right to use, and an electricity connection in the family’s name.',
  },
  {
    art: SpotOnce,
    title: 'A first solar subsidy',
    text: 'The connection has not had a central solar subsidy before.',
  },
  {
    art: SpotDcr,
    title: 'Made-in-India panels',
    text: 'DCR panels, installed by a vendor registered on the portal. Orina Grid partners install exactly this.',
  },
  {
    art: SpotSociety,
    title: 'Housing societies too',
    text: '₹18,000 a kW for the society’s common areas: lifts, lights, pumps.',
  },
];

const SUBSIDY_FAQ: [string, string][] = [
  [
    'Do I pay the full price first?',
    'Yes. You pay your partner the price in the quotation, and the government credits the subsidy to your bank account after the system is inspected. Your quotation shows both: the full price, and what it comes to after the subsidy.',
  ],
  [
    'How long does the subsidy take?',
    'It is released after the net meter is fitted and the system is inspected, usually a few weeks after installation. It depends on your electricity company and the portal.',
  ],
  [
    'Can I get a loan?',
    'Banks offer solar loans under the scheme. Your partner can help you apply; the rate and the approval are the bank’s.',
  ],
  [
    'Is a bigger system worth it if the subsidy stops at 3 kW?',
    'If your bill is high, yes: every extra kW makes about 120 more units a month. The calculator above shows what you save for your bill.',
  ],
];

export default function Subsidy() {
  return (
    <Motion>
      <PageHero
        eyebrow="PM Surya Ghar: Muft Bijli Yojana"
        title={`Up to ${inr(SOLAR.maxSubsidy)} back, straight to your bank.`}
        image={[PHOTOS.home, 'A home terrace with a row of solar panels']}
        lead="The Government of India pays part of a home’s rooftop solar. Your Orina Grid partner files the application, does the installation the scheme asks for, and follows it until the money reaches you."
      >
        <ButtonLink href="#savings" tone="ghost" arrow={false}>
          Work out yours
        </ButtonLink>
      </PageHero>

      <section className="section border-t border-rule">
        <div className="wrap grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <p className="t-eyebrow" data-reveal>
              How much
            </p>
            <h2 data-split className="t-h2 mt-6 max-w-[15ch]">
              ₹30,000 a kW, then ₹18,000 for the third.
            </h2>
            <p className="mt-6 max-w-md text-slate" data-reveal>
              For a home: {inr(30_000)} for each of the first two kW and {inr(18_000)} for the third, so{' '}
              {inr(SOLAR.maxSubsidy)} for 3 kW or more.
            </p>
          </div>
          <div data-reveal>
            <SubsidyBars />
          </div>
        </div>
      </section>

      <section className="section bg-sunk">
        <div className="wrap">
          <p className="t-eyebrow" data-reveal>
            Who can get it
          </p>
          <h2 data-split className="t-h2 mt-6 max-w-[18ch]">
            Most homes with their own roof.
          </h2>
          <ul className="mt-14 grid gap-4 sm:grid-cols-2">
            {WHO.map(({ art: Art, title, text }) => (
              <li
                key={title}
                className="flex flex-col gap-6 rounded-3xl border border-rule bg-paper p-7 sm:flex-row sm:items-center md:p-9"
                data-reveal
              >
                <Art className="h-28 w-auto shrink-0 self-start sm:h-32" />
                <div>
                  <h3 className="t-h3">{title}</h3>
                  <p className="mt-3 text-slate">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <SubsidyRoute />
      </section>

      <Calculator />
      <Faq items={SUBSIDY_FAQ} title="Subsidy questions" />
      <SurveySection />
    </Motion>
  );
}
