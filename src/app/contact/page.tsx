import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SurveyWizard } from '@/components/forms/SurveyWizard';
import { SurveyFromLink } from '@/components/forms/SurveyFromLink';
import { Motion } from '@/components/motion/Motion';
import { Spark } from '@/components/ui/Spark';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Book a free site survey',
  description: `Book a free rooftop solar site survey with the Orina Grid partner for your district, or call ${SITE.phone}.`,
};

const WAYS = [
  { label: 'Call', value: SITE.phone, href: SITE.phoneHref, external: false },
  { label: 'WhatsApp', value: SITE.phone, href: SITE.whatsappHref, external: true },
  { label: 'Email', value: SITE.email, href: `mailto:${SITE.email}`, external: false },
];

export default function Contact() {
  return (
    <Motion>
      <section className="pb-[var(--sp-section)] pt-[calc(var(--header-h)+clamp(2.5rem,7vw,6rem))]">
        <div className="wrap grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="t-eyebrow flex items-center gap-2" data-reveal>
              <Spark className="size-3 text-sun" />
              Free site survey
            </p>
            <h1 data-split className="t-display mt-6 max-w-[12ch]">
              Let’s look at your roof.
            </h1>
            <p className="t-lead mt-8 max-w-md" data-reveal>
              Leave your number and PIN code. The Orina Grid partner for your district calls you to fix a
              time. The survey and the quotation are free.
            </p>

            <ul className="mt-12 divide-y divide-rule border-y border-rule">
              {WAYS.map((w) => (
                <li key={w.label} data-reveal>
                  <a
                    href={w.href}
                    {...(w.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="group flex items-baseline justify-between gap-6 py-5"
                  >
                    <span className="text-sm text-slate">{w.label}</span>
                    <span className="t-num truncate text-[1.1rem] font-medium transition-colors group-hover:text-accent">
                      {w.value}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-12 grid gap-8 sm:grid-cols-2">
              {SITE.offices.map((o) => (
                <a
                  key={o.name}
                  href={o.map}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group text-sm"
                  data-reveal
                >
                  <span className="block font-medium">{o.name}</span>
                  <address className="mt-2 not-italic text-slate">
                    {o.lines.map((l) => (
                      <span key={l} className="block">
                        {l}
                      </span>
                    ))}
                  </address>
                  <span className="mt-3 inline-block text-accent group-hover:underline">Open in Maps ↗</span>
                </a>
              ))}
            </div>
          </div>

          <div className="lg:pt-4">
            <div
              className="rounded-3xl border border-rule bg-surface p-6 sm:p-10 lg:sticky lg:top-[calc(var(--header-h)+2rem)]"
              data-reveal
            >
              <Suspense fallback={<SurveyWizard />}>
                <SurveyFromLink />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </Motion>
  );
}
