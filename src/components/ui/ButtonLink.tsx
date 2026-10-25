'use client';

/**
 * The site's call to action: a link that looks like a button. On a fine pointer (a mouse) it
 * leans toward the cursor a little; on touch it is a plain, large target.
 */
import Link from 'next/link';
import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP } from '@/components/motion/gsap';

export type Tone = 'primary' | 'ghost' | 'on-ink';

const TONES: Record<Tone, string> = {
  primary: 'bg-accent text-on-ink hover:bg-accent-deep',
  ghost: 'border border-ink/15 text-ink hover:border-ink',
  'on-ink': 'bg-on-ink text-ink hover:bg-white',
};

/** The pill's look, for a real <button> that has to match the links. */
export const buttonClass = (tone: Tone = 'primary') =>
  `group inline-flex min-h-12 items-center justify-center gap-3 rounded-full px-6 text-[0.95rem] font-medium transition-colors duration-300 ${TONES[tone]}`;

export function Arrow() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
      aria-hidden
    >
      <path d="M1 8h13M9 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function ButtonLink({
  href,
  children,
  tone = 'primary',
  className = '',
  arrow = true,
}: {
  href: string;
  children: ReactNode;
  tone?: Tone;
  className?: string;
  arrow?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches)
        return;
      const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
      const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        x((e.clientX - (r.left + r.width / 2)) * 0.18);
        y((e.clientY - (r.top + r.height / 2)) * 0.28);
      };
      const leave = () => {
        x(0);
        y(0);
      };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      return () => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
      };
    },
    { scope: ref },
  );

  return (
    <Link ref={ref} href={href} className={`${buttonClass(tone)} ${className}`}>
      <span>{children}</span>
      {arrow ? <Arrow /> : null}
    </Link>
  );
}
