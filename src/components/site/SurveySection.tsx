/** "Book a free site survey": the home form, with what happens after it is sent. */
import { SpotCall } from '@/components/art/Spots';
import { SurveyWizard } from '@/components/forms/SurveyWizard';
import { SITE } from '@/lib/site';

const NEXT = [
  'The Orina Grid partner for your PIN calls you, usually within a working day.',
  'They visit, check the roof and the connection, and take the measurements.',
  'You get a written quotation with the GST and the subsidy. No charge, no pressure.',
];

export function SurveySection({ id = 'survey' }: { id?: string }) {
  return (
    <section id={id} className="section scroll-mt-[var(--header-h)] border-t border-rule">
      <div className="wrap grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <p className="t-eyebrow" data-reveal>
            Free site survey
          </p>
          <h2 data-split className="t-h2 mt-6 max-w-[14ch]">
            Start with a visit, not a sales pitch.
          </h2>
          <ol className="mt-10 space-y-6">
            {NEXT.map((t, i) => (
              <li key={t} className="grid grid-cols-[2.5rem_1fr] gap-3" data-reveal>
                <span className="font-mono text-sm text-accent">0{i + 1}</span>
                <p className="text-slate">{t}</p>
              </li>
            ))}
          </ol>
          <SpotCall className="mt-10 h-36 w-auto" />
          <p className="mt-8 text-sm text-slate" data-reveal>
            Rather talk now?{' '}
            <a
              href={SITE.phoneHref}
              className="t-num font-medium text-ink underline-offset-4 hover:underline"
            >
              {SITE.phone}
            </a>
          </p>
        </div>
        <div className="rounded-3xl border border-rule bg-surface p-6 sm:p-10" data-reveal>
          <SurveyWizard />
        </div>
      </div>
    </section>
  );
}
