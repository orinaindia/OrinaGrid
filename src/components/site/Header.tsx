'use client';

/**
 * The bar on every page. Clear over the top of the page, paper with a blur once scrolled; it slides
 * away while reading down and comes back on the way up. On phones a full-screen menu.
 */
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { gsap, MOTION_OK, useGSAP } from '@/components/motion/gsap';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { NAV, SITE } from '@/lib/site';
import { Logo } from './Logo';

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 400 && y > last);
      last = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // a link was followed: close the menu (set during render, not in an effect)
  const [shownPath, setShownPath] = useState(pathname);
  if (shownPath !== pathname) {
    setShownPath(pathname);
    setOpen(false);
  }

  // the page behind the menu does not scroll
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useGSAP(
    () => {
      if (!open || !menu.current || !window.matchMedia(MOTION_OK).matches) return;
      gsap.from(menu.current.querySelectorAll('[data-menu-item]'), {
        yPercent: 120,
        opacity: 0,
        duration: 0.9,
        stagger: 0.06,
      });
    },
    { dependencies: [open] },
  );

  const isHere = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-500 ease-out-expo ${
          hidden && !open ? '-translate-y-full' : 'translate-y-0'
        } ${scrolled && !open ? 'border-b border-rule bg-paper/80 backdrop-blur-md' : 'border-b border-transparent'}`}
      >
        <div className="wrap flex h-[var(--header-h)] items-center justify-between gap-6">
          <Link href="/" className="relative z-10 shrink-0" aria-label="Orina Grid, home">
            <Logo light={open} />
          </Link>
          <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
            {/* the partnership has its own button beside the survey's */}
            {NAV.filter((item) => item.href !== '/partners').map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isHere(item.href) ? 'page' : undefined}
                className="relative text-[0.95rem] text-ink/80 transition-colors hover:text-ink aria-[current=page]:text-ink after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-ink after:transition-transform after:duration-500 hover:after:scale-x-100 aria-[current=page]:after:scale-x-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {/* both audiences, side by side: installers to the partnership, homes to the survey */}
            <div className="hidden md:block">
              <ButtonLink href="/partners" tone="ghost" arrow={false}>
                Become a partner
              </ButtonLink>
            </div>
            <div className="hidden sm:block">
              <ButtonLink href="/contact">Free site survey</ButtonLink>
            </div>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? 'Close the menu' : 'Open the menu'}
              className={`relative z-10 flex size-12 items-center justify-center rounded-full lg:hidden ${
                open ? 'text-on-ink' : 'text-ink'
              }`}
            >
              <span className="relative block h-3 w-6" aria-hidden>
                <span
                  className={`absolute left-0 h-px w-6 bg-current transition-transform duration-500 ease-out-expo ${
                    open ? 'top-1.5 rotate-45' : 'top-0'
                  }`}
                />
                <span
                  className={`absolute left-0 h-px w-6 bg-current transition-transform duration-500 ease-out-expo ${
                    open ? 'top-1.5 -rotate-45' : 'top-3'
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="site-menu"
        ref={menu}
        hidden={!open}
        data-lenis-prevent
        className="fixed inset-0 z-40 overflow-y-auto bg-ink text-on-ink lg:hidden"
      >
        <div className="wrap flex min-h-full flex-col justify-between pb-10 pt-[calc(var(--header-h)+2rem)]">
          <nav aria-label="Menu" className="flex flex-col">
            {[{ href: '/', label: 'Home' }, ...NAV, { href: '/contact', label: 'Contact' }].map((item) => (
              <div key={item.href} className="overflow-hidden border-b border-white/10">
                <Link
                  data-menu-item
                  href={item.href}
                  aria-current={pathname === item.href ? 'page' : undefined}
                  className="block py-4 font-display text-[clamp(2rem,9vw,3rem)] leading-none tracking-tight aria-[current=page]:text-sun"
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </nav>
          <div data-menu-item className="mt-10 flex flex-col gap-3">
            <ButtonLink href="/contact" tone="on-ink" className="w-full">
              Book a free site survey
            </ButtonLink>
            <div className="flex gap-3">
              <a
                href={SITE.phoneHref}
                className="flex min-h-12 flex-1 items-center justify-center rounded-full border border-white/20"
              >
                Call
              </a>
              <a
                href={SITE.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-12 flex-1 items-center justify-center rounded-full border border-white/20"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
