/** Plain answers to what homes ask before going solar. */
import { SpotAsk } from '@/components/art/Spots';
import { SOLAR } from '@/lib/solar';

export const FAQ: [string, string][] = [
  [
    'How much does rooftop solar cost?',
    `For a home, usually ₹${(SOLAR.pricePerKw.low / 1000).toFixed(0)},000 to ₹${(SOLAR.pricePerKw.high / 1000).toFixed(0)},000 a kW including GST, before the subsidy. The roof, the brands and the distance change it; your partner's quotation gives the exact price after the survey.`,
  ],
  [
    'How much is the PM Surya Ghar subsidy?',
    'For a home: ₹30,000 a kW for the first 2 kW and ₹18,000 for the third, so up to ₹78,000. It is credited to your bank account after the system is installed and inspected. Housing societies get ₹18,000 a kW for common areas.',
  ],
  [
    'Is my roof right for solar?',
    'Most flat RCC roofs and tin sheds are. You need a shade-free area of about 100 square feet for each kW, facing the sun for most of the day. The free survey checks this before any price.',
  ],
  [
    'What happens in a power cut?',
    'A grid-connected system switches itself off when the grid goes down, so no power flows to lines being repaired. If you want power during cuts, ask your partner about a battery.',
  ],
  [
    'How long does it take?',
    'The survey within a few days, installation usually in the first three weeks, and the net meter and subsidy over the following weeks, depending on your electricity company.',
  ],
  [
    'Does it need much care?',
    'Wash the dust off the panels every few weeks and keep the area around them clear. Your partner is in your district for service when you need it.',
  ],
  [
    'Can I pay in instalments?',
    'Your partner can help you apply for a solar loan with a bank. The rate and approval are the bank’s.',
  ],
];

export function Faq({
  items = FAQ,
  title = 'Questions homes ask',
}: {
  items?: [string, string][];
  title?: string;
}) {
  return (
    <section className="section">
      <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div>
          <p className="t-eyebrow" data-reveal>
            FAQ
          </p>
          <h2 data-split className="t-h2 mt-6 max-w-[12ch]">
            {title}
          </h2>
          <SpotAsk className="mt-10 hidden h-40 w-auto lg:block" />
        </div>
        <div className="border-t border-rule">
          {items.map(([q, a]) => (
            <details key={q} className="faq group border-b border-rule" data-reveal>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left text-[1.1rem] font-medium md:text-[1.2rem]">
                {q}
                <span
                  aria-hidden
                  className="relative size-4 shrink-0 before:absolute before:left-0 before:top-1/2 before:h-px before:w-4 before:bg-ink after:absolute after:left-1/2 after:top-0 after:h-4 after:w-px after:bg-ink after:transition-transform after:duration-500 group-open:after:scale-y-0"
                />
              </summary>
              <p className="max-w-[60ch] pb-7 text-slate">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
