/** What goes on the roof and the wall, part by part, in plain words. */
import Image from 'next/image';
import type { ReactNode } from 'react';
import { PHOTOS } from '@/lib/photos';

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinejoin: 'round' as const };

const PARTS: { name: string; text: string; icon: ReactNode }[] = [
  {
    name: 'Solar panels',
    text: 'Made-in-India DCR panels, which the PM Surya Ghar subsidy asks for. They turn sunlight into DC power.',
    icon: (
      <g {...stroke}>
        <path d="M8 34 14 12h28l6 22z" />
        <path d="M11 23h34M19 12l-3 22M28 12v22M37 12l3 22" />
        <path d="M28 34v8M20 42h16" />
      </g>
    ),
  },
  {
    name: 'Inverter',
    text: 'Turns the panels’ DC into the AC your home uses, and shows the day’s units on your phone.',
    icon: (
      <g {...stroke}>
        <rect x="14" y="8" width="28" height="38" rx="3" />
        <path d="M20 18h16M20 24h10" />
        <circle cx="28" cy="36" r="4" />
      </g>
    ),
  },
  {
    name: 'Mounting structure',
    text: 'Galvanised steel, fixed to your RCC roof or tin shed and angled to the sun, built for the wind on your roof.',
    icon: (
      <g {...stroke}>
        <path d="M8 18 40 10M10 46l6-30M24 46l4-32M38 46l2-36M6 46h44" />
      </g>
    ),
  },
  {
    name: 'Net meter',
    text: 'Fitted by your electricity company. It counts both ways, so units you do not use go to the grid and come off your bill.',
    icon: (
      <g {...stroke}>
        <rect x="12" y="8" width="32" height="40" rx="4" />
        <rect x="18" y="15" width="20" height="9" rx="1" />
        <path d="M20 34h6l-3-4M36 38h-6l3 4" />
      </g>
    ),
  },
  {
    name: 'Wiring and protection',
    text: 'Solar cables, DC and AC boxes with fuses and breakers, so a fault switches off safely.',
    icon: (
      <g {...stroke}>
        <rect x="10" y="12" width="36" height="30" rx="3" />
        <path d="M30 17l-6 10h8l-6 10" />
      </g>
    ),
  },
  {
    name: 'Earthing and lightning arrester',
    text: 'Earth pits and an arrester on the roof, to keep the system and the people in the house safe.',
    icon: (
      <g {...stroke}>
        <path d="M28 8v24M16 32h24M20 38h16M24 44h8" />
        <path d="M22 14l6-6 6 6" />
      </g>
    ),
  },
];

const SHOTS = [
  {
    src: PHOTOS.panel,
    alt: 'Close view of monocrystalline solar panels in the sun',
    caption: 'Made-in-India DCR panels',
  },
  {
    src: PHOTOS.inverter,
    alt: 'A wall-mounted solar inverter in a home',
    caption: 'An inverter with an app',
  },
];

export function SystemParts() {
  return (
    <section className="section border-t border-rule">
      <div className="wrap">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="t-eyebrow" data-reveal>
              What you get
            </p>
            <h2 data-split className="t-h2 mt-6 max-w-[16ch]">
              Everything that goes on your roof.
            </h2>
          </div>
          <p className="max-w-md text-slate" data-reveal>
            Your quotation names the brand and the size of each part, so you know exactly what you are paying
            for.
          </p>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-[1.4fr_1fr]">
          {SHOTS.map(({ src, alt, caption }) => (
            <figure key={caption} className="relative aspect-[3/2] overflow-hidden rounded-3xl" data-reveal>
              <Image
                src={src}
                alt={alt}
                fill
                placeholder="blur"
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
              <figcaption className="absolute bottom-4 left-4 rounded-full bg-paper/90 px-4 py-2 text-sm font-medium backdrop-blur">
                {caption}
              </figcaption>
            </figure>
          ))}
        </div>
        <ul className="mt-4 grid gap-px overflow-hidden rounded-3xl border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
          {PARTS.map((p) => (
            <li key={p.name} className="bg-paper p-7 md:p-9" data-reveal>
              <svg viewBox="0 0 56 56" className="size-12 text-accent" aria-hidden>
                {p.icon}
              </svg>
              <h3 className="t-h3 mt-8">{p.name}</h3>
              <p className="mt-3 text-slate">{p.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
