/** The end of every page: one last invitation, the pages, how to reach Orina, the small print. */
import Link from 'next/link';
import { Motion } from '@/components/motion/Motion';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Spark } from '@/components/ui/Spark';
import { NAV, SITE } from '@/lib/site';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="bg-ink text-on-ink">
      <Motion>
        <div className="wrap pb-10 pt-[var(--sp-section)]">
          <div className="flex flex-col gap-10 border-b border-white/10 pb-16 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="t-eyebrow !text-on-ink-soft">Free site survey</p>
              <h2 data-split className="t-display mt-5">
                Let the sun pay your <span className="text-sun">electricity bill.</span>
              </h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/contact" tone="on-ink">
                Book a survey
              </ButtonLink>
              <a
                href={SITE.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-6 text-[0.95rem] transition-colors hover:border-white"
              >
                WhatsApp us
              </a>
            </div>
          </div>

          <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Logo light className="h-14 w-auto" />
              <p className="mt-5 max-w-xs text-sm text-on-ink-soft">{SITE.tagline}</p>
            </div>
            <div>
              <p className="t-eyebrow !text-on-ink-soft">Pages</p>
              <ul className="mt-4 space-y-2.5">
                {[{ href: '/', label: 'Home' }, ...NAV, { href: '/contact', label: 'Contact' }].map(
                  (item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="text-on-ink/85 transition-colors hover:text-white">
                        {item.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>
            <div>
              <p className="t-eyebrow !text-on-ink-soft">Talk to us</p>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <a href={SITE.phoneHref} className="t-num text-on-ink/85 hover:text-white">
                    {SITE.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${SITE.email}`} className="text-on-ink/85 hover:text-white">
                    {SITE.email}
                  </a>
                </li>
                <li>
                  <a
                    href={SITE.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-on-ink/85 hover:text-white"
                  >
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="t-eyebrow !text-on-ink-soft">Offices</p>
              <ul className="mt-4 space-y-5">
                {SITE.offices.map((o) => (
                  <li key={o.name}>
                    <a
                      href={o.map}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block text-sm text-on-ink/85 hover:text-white"
                    >
                      <span className="block font-medium text-on-ink">{o.name}</span>
                      {o.lines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-on-ink-soft sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl">
              Savings and prices on this site are estimates. Your local partner surveys your roof and gives
              the final quotation. Subsidy as per PM Surya Ghar: Muft Bijli Yojana rules. PIN codes and
              districts: India Post, data.gov.in (GODL-India).
            </p>
            <p className="flex items-center gap-2">
              <Spark className="size-3 text-sun" />
              Orina Grid · by Orina LLP
            </p>
          </div>
        </div>
      </Motion>
    </footer>
  );
}
