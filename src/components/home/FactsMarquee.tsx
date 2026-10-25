/** A band of plain facts that drifts by (stops on hover, stands still for reduced motion). */
import { Spark } from '@/components/ui/Spark';

const FACTS = [
  'PM Surya Ghar subsidy up to ₹78,000',
  'Made-in-India DCR panels',
  'A partner in your district',
  'Net meter and subsidy paperwork done for you',
  'A quotation with GST, clear to the rupee',
  'Free site survey',
];

export function FactsMarquee() {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {FACTS.map((f) => (
        <li
          key={f}
          className="flex items-center gap-6 px-6 font-display text-[clamp(1.25rem,2.4vw,2rem)] tracking-tight"
        >
          {f}
          <Spark className="size-4 text-sun" />
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label="Why Orina" className="marquee overflow-hidden border-b border-rule py-7">
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
