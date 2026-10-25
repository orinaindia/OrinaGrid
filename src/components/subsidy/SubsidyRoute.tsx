'use client';

/**
 * How the subsidy reaches you: the five stops in words, and beside them (on large screens) a
 * winding road through the same five places. The stop being read lights up on the road.
 */
import { useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/components/motion/gsap';

const ROUTE = [
  [
    'Apply on the portal',
    'Your partner registers your connection on pmsuryaghar.gov.in with your consumer number and mobile.',
  ],
  ['Feasibility', 'Your electricity company checks the connection and approves the solar size.'],
  ['Installation', 'Your partner installs the system with DCR panels and uploads the details.'],
  ['Net meter and inspection', 'The electricity company fits the net meter and inspects the system.'],
  [
    'Subsidy to your bank',
    'After the commissioning report, the subsidy is credited to the bank account you gave.',
  ],
];

/** Where each stop stands on the road (viewBox 360×420). */
const STOPS = [
  { x: 70, y: 60 },
  { x: 270, y: 120 },
  { x: 90, y: 210 },
  { x: 270, y: 290 },
  { x: 110, y: 370 },
];
const ROAD = 'M70 60 C 200 40, 300 70, 270 120 S 60 160, 90 210 S 320 240, 270 290 S 80 330, 110 370';

function Place({ i }: { i: number }) {
  // each stop's own small picture, drawn about its centre
  switch (i) {
    case 0: // the portal on a laptop
      return (
        <g>
          <rect x="-20" y="-16" width="40" height="26" rx="3" fill="#0B0B0D" />
          <rect x="-17" y="-13" width="34" height="20" rx="1.5" fill="#E9ECFF" />
          <path d="M-12 -7h16M-12 -1h24" stroke="#2340E8" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M-26 10h52l-4 6h-44z" fill="#CFCCC2" />
        </g>
      );
    case 1: // the electricity company: a pylon
      return (
        <g stroke="#62697A" strokeWidth="2" strokeLinejoin="round">
          <path d="M-12 18L0 -20 12 18M-8 6h16M-5 -6h10M-16 -12h32M-12 -2h24" fill="none" />
        </g>
      );
    case 2: // the house with its panels
      return (
        <g>
          <rect x="-20" y="-6" width="40" height="24" fill="#EEE8DC" />
          <rect x="-22" y="-9" width="44" height="4" fill="#FFFFFF" />
          <rect x="-5" y="6" width="10" height="12" fill="#8B6B4E" />
          <polygon points="-16,-9 -2,-9 0,-17 -14,-17" fill="#16224F" />
          <polygon points="2,-9 16,-9 18,-17 4,-17" fill="#16224F" />
        </g>
      );
    case 3: // the net meter
      return (
        <g>
          <rect x="-14" y="-18" width="28" height="36" rx="4" fill="#FFFFFF" stroke="#CFCCC2" />
          <rect x="-9" y="-12" width="18" height="9" rx="1.5" fill="#16224F" />
          <path d="M-6 6h6l-3-3M6 12H0l3 3" stroke="#1C7A5E" strokeWidth="2" fill="none" />
        </g>
      );
    default: // the bank
      return (
        <g>
          <path d="M-22 -6L0 -20 22 -6z" fill="#1B33BD" />
          <rect x="-20" y="-6" width="40" height="4" fill="#E3E1DA" />
          {[-14, -5, 4, 13].map((x) => (
            <rect key={x} x={x} y="-2" width="3" height="16" fill="#CFCCC2" />
          ))}
          <rect x="-22" y="14" width="44" height="5" fill="#E3E1DA" />
          <text x="0" y="-8" textAnchor="middle" fontSize="9" fontWeight="700" fill="#FFFFFF">
            ₹
          </text>
        </g>
      );
  }
}

export function SubsidyRoute() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      gsap.matchMedia().add('(min-width: 1024px)', () => {
        gsap.utils.toArray<HTMLElement>('[data-stop]').forEach((el, i) =>
          ScrollTrigger.create({
            trigger: el,
            start: 'top 60%',
            end: 'bottom 60%',
            onToggle: (self) => self.isActive && setActive(i),
          }),
        );
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="wrap grid grid-cols-1 gap-12 *:min-w-0 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
      <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
        <p className="t-eyebrow" data-reveal>
          How it reaches you
        </p>
        <h2 data-split className="t-h2 mt-6 max-w-[14ch]">
          Five stops. Your partner handles each.
        </h2>
        <svg viewBox="0 0 360 420" className="mt-10 hidden w-full max-w-md lg:block" aria-hidden>
          <path d={ROAD} stroke="#E3E1DA" strokeWidth="22" strokeLinecap="round" fill="none" />
          <path d={ROAD} stroke="#FFFFFF" strokeWidth="2" strokeDasharray="8 10" fill="none" />
          {STOPS.map((s, i) => {
            const on = i === active;
            const done = i < active;
            return (
              <g key={i} transform={`translate(${s.x} ${s.y})`}>
                <circle
                  r="34"
                  fill={on ? '#E9ECFF' : '#F7F6F2'}
                  stroke={on ? '#2340E8' : done ? '#1C7A5E' : '#CFCCC2'}
                  strokeWidth={on ? 2.5 : 1.5}
                  className="transition-[fill,stroke] duration-500"
                />
                <g className={`transition-opacity duration-500 ${on || done ? 'opacity-100' : 'opacity-55'}`}>
                  <Place i={i} />
                </g>
                <g transform="translate(26 -26)">
                  <circle
                    r="10"
                    fill={on ? '#2340E8' : done ? '#1C7A5E' : '#FFFFFF'}
                    stroke={on || done ? 'none' : '#CFCCC2'}
                  />
                  <text
                    y="3.5"
                    textAnchor="middle"
                    fontSize="10"
                    fontFamily="var(--font-mono)"
                    fill={on || done ? '#FFFFFF' : '#62697A'}
                  >
                    {done ? '✓' : i + 1}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>
      <ol className="divide-y divide-rule border-y border-rule">
        {ROUTE.map(([t, d], i) => (
          <li
            key={t}
            data-stop
            className="grid grid-cols-[3rem_1fr] gap-4 py-7 md:py-9 lg:min-h-[34svh] lg:items-center"
            data-reveal
          >
            <span
              className={`font-mono text-sm ${i === active ? 'text-accent' : 'text-slate'} transition-colors`}
            >
              0{i + 1}
            </span>
            <div>
              <p className="t-h3">{t}</p>
              <p className="mt-2 text-slate">{d}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
