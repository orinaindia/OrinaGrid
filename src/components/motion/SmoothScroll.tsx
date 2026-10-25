'use client';

/**
 * Smooth scrolling (Lenis) driven by GSAP's ticker, so ScrollTrigger and the scroll always agree.
 * Off for people who ask their device to reduce motion (they get the browser's own scrolling).
 * A new page starts at the top.
 */
import { useEffect, useRef, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { gsap, MOTION_OK, ScrollTrigger } from './gsap';

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenis = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!window.matchMedia(MOTION_OK).matches) return;
    const l = new Lenis({ lerp: 0.1, wheelMultiplier: 1, touchMultiplier: 1.2 });
    lenis.current = l;
    l.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => l.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      l.destroy();
      lenis.current = null;
    };
  }, []);

  // a new page: back to the top at once, and measure the triggers again
  useEffect(() => {
    lenis.current?.scrollTo(0, { immediate: true });
    ScrollTrigger.refresh();
  }, [pathname]);

  return <>{children}</>;
}
