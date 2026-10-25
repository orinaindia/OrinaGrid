'use client';

/**
 * The five steps in full, down a line that fills as you read; each step's dot lights when the
 * line reaches it. Without motion the line is simply full.
 */
import { useRef } from 'react';
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from '@/components/motion/gsap';
import { STEPS } from '@/lib/steps';

export function Timeline() {
  const root = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          '[data-line]',
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top 60%', end: 'bottom 60%', scrub: 0.4 },
          },
        );
        const dots = gsap.utils.toArray<HTMLElement>('[data-dot]');
        dots.forEach((dot) => {
          dot.classList.add('is-off');
          ScrollTrigger.create({
            trigger: dot,
            start: 'top 60%',
            onEnter: () => dot.classList.remove('is-off'),
            onLeaveBack: () => dot.classList.add('is-off'),
          });
        });
        return () => dots.forEach((dot) => dot.classList.remove('is-off'));
      });
    },
    { scope: root },
  );

  return (
    <ol ref={root} className="relative">
      {/* the line, behind the dots: rule colour, and the accent filling it */}
      <span
        aria-hidden
        className="absolute bottom-6 left-[0.6875rem] top-6 w-px bg-rule-strong md:left-[calc(12rem+0.6875rem)]"
      />
      <span
        aria-hidden
        data-line
        className="absolute bottom-6 left-[0.6875rem] top-6 w-px origin-top bg-accent md:left-[calc(12rem+0.6875rem)]"
      />
      {STEPS.map((s, i) => (
        <li
          key={s.title}
          className="relative grid gap-4 pb-16 pl-12 last:pb-0 md:grid-cols-[12rem_1fr] md:gap-0 md:pl-0"
        >
          <div className="md:pr-10 md:pt-1 md:text-right">
            <p className="font-mono text-xs uppercase tracking-wider text-slate">{s.when}</p>
          </div>
          <span
            aria-hidden
            data-dot
            className="absolute left-0 top-0.5 size-[1.375rem] rounded-full border-2 border-accent bg-accent transition-colors duration-500 md:left-[12rem] [&.is-off]:border-rule-strong [&.is-off]:bg-paper"
          />
          <div className="md:pl-14" data-reveal>
            <p className="font-mono text-sm text-accent">Step 0{i + 1}</p>
            <h2 className="t-h2 mt-3 !text-[clamp(1.75rem,3.4vw,3rem)]">{s.title}</h2>
            <p className="mt-4 max-w-2xl text-slate">{s.text}</p>
            <dl className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-rule bg-rule sm:grid-cols-3">
              {[
                ['You', s.you],
                ['Your partner', s.partner],
                ['You get', s.gets],
              ].map(([k, v]) => (
                <div key={k} className="bg-surface p-5">
                  <dt className="font-mono text-[0.7rem] uppercase tracking-wider text-slate">{k}</dt>
                  <dd className="mt-2 text-[0.95rem]">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </li>
      ))}
    </ol>
  );
}
