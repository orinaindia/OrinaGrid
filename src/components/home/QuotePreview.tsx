/**
 * "A quotation you can read": the customer's copy as Orina Grid makes it, for a 3 kW home on a
 * tin-shed roof (the real numbers such a quote gives: GST split 70/30, the PM Surya Ghar subsidy).
 */
import { Spark } from '@/components/ui/Spark';

const LINES = [
  {
    n: 1,
    title: 'Solar system material',
    detail: 'Panels, inverter and structure, with cables, protection and earthing',
    code: '8541',
    taxable: '97,126',
    gst: '5%',
    amount: '1,01,982',
  },
  {
    n: 2,
    title: 'Installation, testing and start-up',
    detail: 'Fitting, wiring, testing, net meter and subsidy paperwork',
    code: '9954',
    taxable: '41,625',
    gst: '18%',
    amount: '49,118',
  },
];

const POINTS = [
  ['Every rupee shown', 'Material and work as separate lines, with HSN and SAC codes and the GST on each.'],
  ['The subsidy, worked out', 'What PM Surya Ghar credits to your bank, and what you pay after it.'],
  ['Yours to keep', 'A PDF on WhatsApp, valid for 21 days, with the brands and the terms.'],
];

export function QuotePreview() {
  return (
    <section className="section overflow-hidden">
      <div className="wrap grid grid-cols-1 items-center gap-14 *:min-w-0 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <p className="t-eyebrow" data-reveal>
            No surprises
          </p>
          <h2 data-split className="t-h2 mt-6 max-w-[15ch]">
            A quotation you can actually read.
          </h2>
          <ul className="mt-10 space-y-7">
            {POINTS.map(([t, d]) => (
              <li key={t} className="flex gap-4" data-reveal>
                <Spark className="mt-1.5 size-3.5 shrink-0 text-accent" />
                <div>
                  <p className="font-medium">{t}</p>
                  <p className="mt-1 text-slate">{d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* the paper, slightly turned, as it would lie on a table */}
        <div className="relative" data-reveal>
          <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-accent-wash" aria-hidden />
          <figure
            className="rounded-2xl border border-rule bg-surface p-5 shadow-[0_30px_80px_-30px_rgba(11,11,13,0.35)] sm:p-8 lg:-rotate-1"
            aria-label="An example quotation for a 3 kW home"
          >
            <div className="flex items-start justify-between gap-4 border-b-2 border-ink pb-4">
              <div>
                <p className="font-display text-lg font-medium">Your district partner</p>
                <p className="text-xs text-slate">Orina Grid partner</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-xs tracking-[0.18em] text-accent">QUOTATION</p>
                <p className="mt-1 font-mono text-xs text-slate">QT-0001</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-rule bg-rule text-xs">
              <div className="bg-surface p-3">
                <p className="font-mono text-[0.65rem] uppercase tracking-wider text-slate">Quotation for</p>
                <p className="mt-1 font-medium">A home in Nashik</p>
              </div>
              <div className="bg-surface p-3">
                <p className="font-mono text-[0.65rem] uppercase tracking-wider text-slate">System</p>
                <p className="mt-1 font-medium">3 kWp, home, tin shed</p>
              </div>
            </div>
            {/* on a phone: #, item and amount; the tax columns from sm up */}
            <div className="mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-sunk text-[0.65rem] uppercase tracking-wider text-slate">
                    <th className="p-2 font-medium">#</th>
                    <th className="p-2 font-medium">Item</th>
                    <th className="hidden p-2 font-medium sm:table-cell">HSN/SAC</th>
                    <th className="hidden p-2 text-right font-medium sm:table-cell">Taxable</th>
                    <th className="hidden p-2 text-right font-medium sm:table-cell">GST</th>
                    <th className="p-2 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {LINES.map((l) => (
                    <tr key={l.n} className="border-b border-rule align-top">
                      <td className="p-2 text-slate">{l.n}</td>
                      <td className="p-2">
                        <p className="font-medium">{l.title}</p>
                        <p className="text-[0.7rem] text-slate">{l.detail}</p>
                      </td>
                      <td className="hidden p-2 sm:table-cell">{l.code}</td>
                      <td className="t-num hidden p-2 text-right sm:table-cell">{l.taxable}</td>
                      <td className="hidden p-2 text-right sm:table-cell">{l.gst}</td>
                      <td className="t-num whitespace-nowrap p-2 text-right font-medium">{l.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-between text-sm">
              <span className="text-slate">Total incl. GST</span>
              <span className="t-num font-medium">₹1,51,100</span>
            </div>
            <div className="mt-4 rounded-lg bg-accent-wash p-4">
              <div className="flex justify-between gap-4 text-xs text-pos">
                <span>PM Surya Ghar subsidy, to your bank</span>
                <span className="t-num shrink-0 whitespace-nowrap">− ₹78,000</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between gap-4">
                <span className="font-medium">You pay, after the subsidy</span>
                <span className="t-h3 t-num shrink-0 text-accent">₹73,100</span>
              </div>
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}
