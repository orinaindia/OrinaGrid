'use client';

/**
 * Orina Grid, feature by feature. On a large screen the words scroll and the app's screen stays,
 * changing to the feature being read; below that each feature carries its own screen.
 */
import { useRef, useState, type ReactNode } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/components/motion/gsap';
import { IncomingScreen, LeadsScreen, QuoteScreen, TeamScreen, TodayScreen } from './GridScreens';

const FEATURES: { name: string; title: string; text: string; screen: ReactNode }[] = [
  {
    name: 'Today',
    title: 'Your day, on one screen.',
    text: 'New leads, calls due, surveys and quotes waiting: what needs doing today opens first, on the phone or the laptop.',
    screen: <TodayScreen />,
  },
  {
    name: 'Leads',
    title: 'Every lead, and what happened with it.',
    text: 'New, contacted, survey, quote sent, negotiation, won. Each call, visit and WhatsApp is noted, so anyone in the team can pick it up.',
    screen: <LeadsScreen />,
  },
  {
    name: 'From Orina',
    title: 'Leads from Orina, by PIN code.',
    text: 'Orina Grid’s campaigns and Orina Care referrals for your district arrive in Grid on their own, each given to the salesperson with the fewest open leads.',
    screen: <IncomingScreen />,
  },
  {
    name: 'Quotations',
    title: 'A GST quotation in minutes.',
    text: 'From your own catalogue: material and work split for GST, the PM Surya Ghar subsidy worked out, a PDF with your logo. A discount above someone’s limit waits for the owner.',
    screen: <QuoteScreen />,
  },
  {
    name: 'Team',
    title: 'Everyone sees what their work needs.',
    text: 'Owner, sales, site and accounts: invite your people and give each a role. Sign-in is a code by email, no passwords to share.',
    screen: <TeamScreen />,
  },
];

export function GridShowcase() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      gsap.matchMedia().add('(min-width: 1024px)', () => {
        gsap.utils.toArray<HTMLElement>('[data-feature]').forEach((el, i) =>
          ScrollTrigger.create({
            trigger: el,
            start: 'top center',
            end: 'bottom center',
            onToggle: (self) => self.isActive && setActive(i),
          }),
        );
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="grid grid-cols-1 gap-16 *:min-w-0 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
      <ol>
        {FEATURES.map((f, i) => (
          <li
            key={f.name}
            data-feature
            className="py-6 first:pt-0 lg:flex lg:min-h-[78svh] lg:flex-col lg:justify-center lg:py-0"
          >
            <p className="font-mono text-sm text-accent">
              0{i + 1} · {f.name}
            </p>
            <h3 className="t-h2 mt-4 max-w-[16ch] !text-[clamp(1.75rem,3.4vw,3rem)]">{f.title}</h3>
            <p className="mt-5 max-w-md text-slate">{f.text}</p>
            <div className="mt-8 h-[23rem] lg:hidden">{f.screen}</div>
          </li>
        ))}
      </ol>

      {/* the screen that stays: only on large screens, the words above carry the meaning */}
      <div aria-hidden className="hidden lg:block">
        <div className="sticky top-[calc(50svh-13rem)] h-[26rem]">
          <div className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-accent-wash" />
          {FEATURES.map((f, i) => (
            <div
              key={f.name}
              className={`absolute inset-0 transition-[opacity,transform] duration-700 ease-out-expo motion-reduce:transition-none ${
                i === active ? 'opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
              }`}
            >
              {f.screen}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
