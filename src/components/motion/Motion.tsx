'use client';

/**
 * Scroll reveals for what it wraps (a page, the footer), so sections stay plain markup:
 *   [data-reveal]        rises and fades in when it enters (siblings in a batch, staggered)
 *   [data-split]         a heading whose lines rise from behind a mask (SplitText)
 *   [data-parallax="n"]  drifts by n% of its height while it crosses the screen
 * Without JS, or with reduced motion, everything simply shows.
 *
 * It wraps the content it animates (never a layout around a page): the content is then hydrated
 * with it, before its effect changes that content (SplitText, inline styles).
 */
import { useRef, type ReactNode } from 'react';
import { gsap, MOTION_OK, ScrollTrigger, SplitText, useGSAP } from './gsap';

export function Motion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        ScrollTrigger.batch(q('[data-reveal]'), {
          start: 'top 88%',
          once: true,
          onEnter: (items) =>
            gsap.to(items, { opacity: 1, y: 0, duration: 1.1, stagger: 0.08, overwrite: true }),
        });

        // autoSplit: split again once the web font has loaded or the width changes (lines move);
        // the animation returned from onSplit carries its progress over
        const splits = q('[data-split]').map((el) =>
          SplitText.create(el, {
            type: 'lines',
            mask: 'lines',
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                // below the mask's extra room for descenders too
                yPercent: 125,
                duration: 1.2,
                stagger: 0.09,
                scrollTrigger: { trigger: el, start: 'top 90%', once: true },
              }),
          }),
        );

        q('[data-parallax]').forEach((el) => {
          const amount = Number(el.dataset.parallax) || 10;
          gsap.fromTo(
            el,
            { yPercent: -amount / 2 },
            {
              yPercent: amount / 2,
              ease: 'none',
              scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          );
        });

        return () => splits.forEach((s) => s.revert());
      });
      // no motion: show at once what would have animated in
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(q('[data-reveal]'), { opacity: 1, y: 0 });
      });
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
