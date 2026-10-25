'use client';

/**
 * The survey form as a dialog, a moment after the site is opened or reloaded: a sheet that rises
 * from the bottom on a phone, a centred card on a wide screen. Its picture follows the form: a pin
 * over a house, then panels on its roof, then a call at the door (PopupScene).
 *
 * Closed, it stays closed while they move between pages (until the next load); sent, it stays
 * away for SENT_DAYS. Never on the pages that already carry the form, never over an open menu.
 * A native <dialog>: focus stays inside, Escape closes it, the page behind is inert.
 */
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { PopupScene } from '@/components/art/PopupScene';
import { gsap, MOTION_OK } from '@/components/motion/gsap';
import { SurveyWizard, type Progress } from './SurveyWizard';

const DELAY_MS = 1200;
const SENT = 'orina-enquiry-sent';
const SENT_DAYS = 30;
const NOT_ON = ['/contact', '/find-a-partner', '/partners'];
const WIDE = '(min-width: 768px)';

/** Closed in this page load: module state, so moving between pages keeps it and a reload clears it. */
let closedThisLoad = false;

/** When they sent the form, if within SENT_DAYS. Storage can be refused (private windows): then it asks again. */
function sentLately(): boolean {
  try {
    const at = Number(window.localStorage.getItem(SENT));
    return Number.isFinite(at) && Date.now() - at < SENT_DAYS * 86_400_000;
  } catch {
    return false;
  }
}

function markSent() {
  try {
    window.localStorage.setItem(SENT, String(Date.now()));
  } catch {}
}

export function EnquiryPopup() {
  const dialog = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    if (NOT_ON.includes(pathname) || closedThisLoad || sentLately()) return;
    const t = window.setTimeout(() => {
      // not over the mobile menu or another dialog
      if (document.querySelector('dialog[open], #site-menu:not([hidden])')) return;
      setMounted(true);
    }, DELAY_MS);
    return () => window.clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    const d = dialog.current;
    if (!mounted || !d || d.open) return;
    d.showModal();
    // start where the form starts, not on the close button
    d.querySelector<HTMLElement>('[name="pin"]')?.focus({ preventScroll: true });
    if (!window.matchMedia(MOTION_OK).matches) return;
    if (window.matchMedia(WIDE).matches)
      gsap.fromTo(
        d,
        { opacity: 0, y: 24, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'expo.out' },
      );
    else gsap.fromTo(d, { yPercent: 100 }, { yPercent: 0, duration: 0.55, ease: 'expo.out' });
  }, [mounted]);

  const close = () => {
    closedThisLoad = true;
    const d = dialog.current;
    if (!d) return;
    if (!window.matchMedia(MOTION_OK).matches) return d.close();
    gsap.to(d, {
      ...(window.matchMedia(WIDE).matches ? { opacity: 0, y: 16 } : { yPercent: 100 }),
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => d.close(),
    });
  };

  if (!mounted) return null;

  return (
    <dialog
      ref={dialog}
      data-lenis-prevent
      aria-labelledby="enquiry-title"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => e.target === dialog.current && close()}
      className="mb-0 mt-auto max-h-[94svh] w-full max-w-none overflow-y-auto overscroll-contain rounded-t-[1.75rem] thin-scroll bg-surface p-0 text-ink shadow-[0_-20px_80px_-30px_rgba(11,11,13,0.5)] backdrop:bg-ink/50 backdrop:backdrop-blur-sm md:m-auto md:max-h-[calc(100svh-2rem)] md:w-[min(34rem,calc(100vw-2rem))] md:rounded-[1.75rem] md:shadow-[0_40px_120px_-30px_rgba(11,11,13,0.55)]"
    >
      {/* the picture, with the title in its sky */}
      <div className="relative h-44 overflow-hidden md:h-48">
        <PopupScene p={progress} className="absolute inset-0 size-full" />
        {/* the handle a sheet has */}
        <div
          aria-hidden
          className="absolute left-1/2 top-2.5 h-1.5 w-12 -translate-x-1/2 rounded-full bg-ink/15 md:hidden"
        />
        <div className="relative px-5 pt-7 sm:px-8 md:pt-8">
          <p id="enquiry-title" className="t-h2 max-w-[11ch] !text-[clamp(1.5rem,3vw,2rem)] !leading-[1.05]">
            Book a free site survey
          </p>
          <p className="mt-2 max-w-[22ch] text-sm text-slate">A partner in your district calls you back.</p>
        </div>
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-white/70 text-ink backdrop-blur transition-colors hover:bg-white md:right-4 md:top-4"
        >
          <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </button>
      </div>
      <div className="px-5 pb-6 pt-5 sm:px-8 md:pb-7">
        <SurveyWizard onSent={markSent} onProgress={setProgress} />
      </div>
    </dialog>
  );
}
