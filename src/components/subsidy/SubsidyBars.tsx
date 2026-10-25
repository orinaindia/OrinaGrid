'use client';

/** The home subsidy by system size, as bars that grow when they come into view. */
import { useRef } from 'react';
import { gsap, MOTION_OK, useGSAP } from '@/components/motion/gsap';
import { inr, SOLAR, subsidyFor } from '@/lib/solar';

const SIZES = [1, 2, 3, 4, 5];

export function SubsidyBars() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from('[data-bar]', {
          scaleY: 0,
          duration: 1.4,
          stagger: 0.12,
          scrollTrigger: { trigger: root.current, start: 'top 75%', once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <ul className="grid h-[clamp(16rem,36vw,24rem)] grid-cols-5 items-end gap-2 border-b border-ink sm:gap-4">
        {SIZES.map((kw) => {
          const s = subsidyFor(kw);
          const capped = s === SOLAR.maxSubsidy && kw > 3;
          return (
            <li key={kw} className="flex h-full flex-col justify-end">
              <p className="t-num mb-3 text-center text-[clamp(0.7rem,1.6vw,1rem)] font-medium">{inr(s)}</p>
              <div
                data-bar
                className={`origin-bottom rounded-t-xl ${capped ? 'bg-accent/35' : 'bg-accent'}`}
                style={{ height: `${(s / SOLAR.maxSubsidy) * 80}%` }}
              />
            </li>
          );
        })}
      </ul>
      <ul className="mt-3 grid grid-cols-5 gap-2 text-center font-mono text-xs text-slate sm:gap-4">
        {SIZES.map((kw) => (
          <li key={kw}>{kw} kW</li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-slate">
        Above 3 kW the subsidy stays at {inr(SOLAR.maxSubsidy)}; the bigger system still saves more on the
        bill.
      </p>
    </div>
  );
}
