/** The first screen: what Orina Grid does, in one line, and the two ways in: a home, an installer. */
import { SunScene } from '@/components/art/SunScene';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Spark } from '@/components/ui/Spark';
import { inr, SOLAR } from '@/lib/solar';

const FACTS = [
  [`Up to ${inr(SOLAR.maxSubsidy)}`, 'PM Surya Ghar subsidy for a home'],
  [`~${SOLAR.unitsPerKwMonth} units`, 'a month from every kW on your roof'],
  ['One partner', 'in your district, from survey to subsidy'],
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-[calc(var(--header-h)+clamp(2.5rem,7vw,6rem))]">
      <div className="wrap">
        <p className="t-eyebrow flex items-center gap-2" data-reveal>
          <Spark className="size-3 text-sun" />
          Rooftop solar · across India
        </p>
        <h1 data-split className="t-display-xl mt-6 max-w-[14ch]">
          Your roof can pay your electricity bill.
        </h1>
        <div className="mt-8 flex flex-col gap-8 md:mt-10 md:flex-row md:items-end md:justify-between">
          <p className="t-lead max-w-xl" data-reveal>
            A free site survey, a clear quotation with the PM Surya Ghar subsidy, then installation, net meter
            and subsidy paperwork, by a trusted Orina Grid partner in your district.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row" data-reveal>
            <ButtonLink href="/contact">Book a free site survey</ButtonLink>
            <ButtonLink href="/partners" tone="ghost">
              Become a partner
            </ButtonLink>
          </div>
        </div>
      </div>

      {/* the viewBox's own shape on wide screens (nothing of the sky is cut), the street's middle on phones */}
      <div className="mx-auto mt-8 max-w-[1680px] md:mt-2 min-[1680px]:[mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
        <SunScene className="block aspect-[1440/530] min-h-[280px] w-full" />
      </div>

      <div className="border-y border-rule bg-surface">
        <dl className="wrap grid divide-y divide-rule sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {FACTS.map(([big, small]) => (
            <div key={big} className="py-6 sm:px-8 sm:first:pl-0 sm:last:pr-0" data-reveal>
              <dt className="t-h3 t-num">{big}</dt>
              <dd className="mt-1 text-sm text-slate">{small}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
