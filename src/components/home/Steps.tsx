'use client';

/**
 * The five steps. On a large screen with motion the section holds still while the steps slide
 * across (a pinned horizontal scroll); on phones and tablets, or without motion, a plain list.
 */
import Image from 'next/image';
import { useRef } from 'react';
import { gsap, MOTION_OK, useGSAP } from '@/components/motion/gsap';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { STEPS } from '@/lib/steps';

export function Steps() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`(min-width: 1024px) and ${MOTION_OK}`, () => {
        const el = track.current;
        if (!el) return;
        const distance = () => el.scrollWidth - el.clientWidth;
        gsap.to(el, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        gsap.to('[data-steps-progress]', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            scrub: true,
          },
        });
      });
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      className="relative overflow-hidden bg-sunk py-[var(--sp-section)] lg:flex lg:min-h-svh lg:flex-col lg:justify-center lg:py-16"
    >
      <div className="wrap flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="t-eyebrow" data-reveal>
            How it works
          </p>
          <h2 data-split className="t-h2 mt-6 max-w-[16ch]">
            From your first call to the subsidy in your bank.
          </h2>
        </div>
        <ButtonLink href="/how-it-works" tone="ghost">
          The whole process
        </ButtonLink>
      </div>

      <div className="wrap mt-10 hidden lg:block">
        <div className="h-px w-full bg-rule-strong">
          <div data-steps-progress className="h-px origin-left scale-x-0 bg-accent" />
        </div>
      </div>

      <ol
        ref={track}
        className="wrap mt-12 grid gap-4 sm:grid-cols-2 lg:mt-10 lg:flex lg:max-w-none lg:gap-6 lg:pr-[var(--gutter)]"
      >
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            data-reveal
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-rule bg-paper lg:w-[min(26rem,34vw)] lg:shrink-0"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={s.image}
                alt=""
                fill
                placeholder="blur"
                sizes="(min-width: 1024px) 26rem, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-105"
              />
              <span className="absolute left-4 top-4 rounded-full bg-paper/90 px-3 py-1 font-mono text-xs text-accent backdrop-blur">
                0{i + 1}
              </span>
              <span className="absolute right-4 top-4 rounded-full bg-ink/70 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-wider text-on-ink backdrop-blur">
                {s.when}
              </span>
            </div>
            <div className="flex flex-1 flex-col justify-between gap-6 p-6 lg:p-7">
              <div>
                <h3 className="t-h3">{s.title}</h3>
                <p className="mt-3 text-slate">{s.text}</p>
              </div>
              <p className="border-t border-rule pt-4 text-sm">
                <span className="text-slate">You get: </span>
                {s.gets}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
