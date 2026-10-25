/**
 * Small drawn scenes for the cards and quiet columns, in the hero's language: Orina's colours,
 * soft shade, a shadow on the ground, panels with cells and frames. Drawn, not photographed, so
 * they stay crisp at any size and weigh a few hundred bytes. Decorative: each is aria-hidden and
 * the words beside it carry the meaning.
 */
import type { ReactNode } from 'react';

const C = {
  ink: '#0B0B0D',
  paper: '#F7F6F2',
  surface: '#FFFFFF',
  sunk: '#F1EFE9',
  rule: '#E3E1DA',
  ruleStrong: '#CFCCC2',
  accent: '#2340E8',
  accentDeep: '#1B33BD',
  wash: '#E9ECFF',
  sun: '#E8A33D',
  pos: '#1C7A5E',
  slate: '#62697A',
  wall: '#EEE8DC',
  wallShade: '#E2D9C8',
  wood: '#8B6B4E',
  navy: '#16224F',
};

function Frame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 200 140" className={className} aria-hidden fill="none">
      {children}
    </svg>
  );
}

const Ground = ({ cx = 100, w = 150 }: { cx?: number; w?: number }) => (
  <ellipse cx={cx} cy={128} rx={w / 2} ry={6} fill={C.ink} opacity="0.06" />
);

/** A row of tilted panels, `n` wide, standing on y. */
function Panels({ x, y, n, w = 22 }: { x: number; y: number; n: number; w?: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const px = x + i * (w + 2);
        return (
          <g key={i}>
            <path
              d={`M${px + 3} ${y}v-4M${px + w - 3} ${y}v-4M${px + 6} ${y}v-12M${px + w} ${y}v-12`}
              stroke="#9AA0A8"
              strokeWidth="1.2"
            />
            <polygon
              points={`${px},${y - 4} ${px + w},${y - 4} ${px + w + 4},${y - 14} ${px + 4},${y - 14}`}
              fill={C.navy}
              stroke="#D5D9DF"
              strokeWidth="1"
            />
            <path
              d={`M${px + w / 3 + 1.3} ${y - 4}l1.4-10M${px + (2 * w) / 3 + 2.6} ${y - 4}l1.4-10M${px + 2} ${y - 9}h${w + 2}`}
              stroke="#4B62B8"
              strokeWidth="0.5"
            />
          </g>
        );
      })}
    </g>
  );
}

function Sun({ cx, cy, r = 12 }: { cx: number; cy: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r * 2.4} fill={C.sun} opacity="0.12" />
      <circle cx={cx} cy={cy} r={r * 1.5} fill={C.sun} opacity="0.2" />
      <circle cx={cx} cy={cy} r={r} fill="#FFE7B8" />
      <circle cx={cx} cy={cy} r={r * 0.6} fill="#FFF8EA" />
    </g>
  );
}

/** A flat-roofed house with panels on it. */
export function SpotHome({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <Sun cx={160} cy={30} />
      <Ground />
      <rect x="48" y="58" width="104" height="70" fill={C.wall} />
      <rect x="140" y="58" width="12" height="70" fill={C.wallShade} />
      <rect x="44" y="52" width="112" height="7" fill={C.surface} />
      <rect x="48" y="59" width="104" height="6" fill={C.ink} opacity="0.06" />
      {[62, 92, 122].map((x) => (
        <g key={x}>
          <rect x={x - 2} y="72" width="20" height="18" fill={C.ruleStrong} />
          <rect x={x} y="74" width="16" height="14" fill="#9DB0C8" />
          <rect x={x - 5} y="69" width="26" height="3" fill={C.surface} />
        </g>
      ))}
      <rect x="90" y="98" width="20" height="30" fill={C.wood} />
      <Panels x={58} y={52} n={4} />
    </Frame>
  );
}

/** The subsidy, paid once: a rupee coin on a small stack, with a tick. */
export function SpotOnce({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <Ground w={120} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <ellipse cx="88" cy={118 - i * 9} rx="34" ry="9" fill={C.sun} />
          <ellipse cx="88" cy={115 - i * 9} rx="34" ry="9" fill="#F3C477" />
        </g>
      ))}
      <circle cx="88" cy="58" r="30" fill="#F3C477" />
      <circle cx="88" cy="58" r="24" fill="#F8D89B" stroke={C.sun} strokeWidth="2" />
      <text
        x="88"
        y="67"
        textAnchor="middle"
        fontSize="26"
        fontWeight="600"
        fill="#9A6416"
        fontFamily="var(--font-display)"
      >
        ₹
      </text>
      <circle cx="140" cy="44" r="16" fill={C.pos} />
      <path
        d="M132 44l6 6 10-12"
        stroke={C.surface}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Frame>
  );
}

/** A panel with its made-in-India mark. */
export function SpotDcr({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <Sun cx={44} cy={30} r={10} />
      <Ground w={130} />
      <path d="M70 126l6-34M130 126l-6-34M100 126V96" stroke="#9AA0A8" strokeWidth="2.5" />
      <polygon points="52,96 148,96 162,40 66,40" fill={C.navy} stroke="#D5D9DF" strokeWidth="2" />
      {[1, 2, 3, 4, 5].map((i) => (
        <path key={i} d={`M${52 + i * 16} 96L${66 + i * 16} 40`} stroke="#4B62B8" strokeWidth="0.8" />
      ))}
      {[1, 2].map((i) => (
        <path
          key={i}
          d={`M${52 + (14 * i) / 3} ${96 - (56 * i) / 3}H${148 + (14 * i) / 3}`}
          stroke="#4B62B8"
          strokeWidth="0.8"
        />
      ))}
      <path d="M80 44l20 0-4 14 20 0" stroke="#fff" strokeOpacity="0.18" strokeWidth="10" />
      {/* the tag: saffron, white, green */}
      <g transform="rotate(-8 150 104)">
        <rect x="128" y="94" width="44" height="26" rx="5" fill={C.surface} stroke={C.rule} />
        <rect x="134" y="100" width="14" height="4" fill="#F29A38" />
        <rect x="134" y="104" width="14" height="4" fill={C.surface} stroke={C.rule} strokeWidth="0.5" />
        <rect x="134" y="108" width="14" height="4" fill="#2F8F4E" />
        <path d="M152 103h14M152 109h10" stroke={C.slate} strokeWidth="2" strokeLinecap="round" />
      </g>
    </Frame>
  );
}

/** A housing society block with an array on its roof. */
export function SpotSociety({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <Ground w={160} />
      <rect x="24" y="64" width="40" height="64" fill={C.wallShade} />
      <rect x="136" y="72" width="44" height="56" fill={C.wallShade} />
      <rect x="62" y="36" width="76" height="92" fill={C.wall} />
      <rect x="128" y="36" width="10" height="92" fill={C.wallShade} />
      <rect x="58" y="30" width="84" height="7" fill={C.surface} />
      {[0, 1, 2, 3, 4].map((r) =>
        [0, 1, 2].map((c) => (
          <rect key={`${r}-${c}`} x={70 + c * 22} y={46 + r * 15} width="14" height="9" fill="#9DB0C8" />
        )),
      )}
      {[0, 1, 2].map((r) => (
        <rect key={r} x="30" y={74 + r * 16} width="28" height="8" fill="#B6C3D4" opacity="0.8" />
      ))}
      <Panels x={64} y={30} n={3} w={20} />
    </Frame>
  );
}

/** The papers to keep ready: a bill, an ID card, a passbook. */
export function SpotPapers({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <Ground w={140} />
      <g transform="rotate(-10 70 80)">
        <rect x="34" y="34" width="62" height="84" rx="4" fill={C.surface} stroke={C.rule} />
        <rect x="42" y="44" width="30" height="5" rx="2" fill={C.accent} />
        <path
          d="M42 58h44M42 66h38M42 74h44M42 82h30"
          stroke={C.ruleStrong}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <rect x="42" y="96" width="44" height="12" rx="2" fill={C.wash} />
      </g>
      <g transform="rotate(6 130 92)">
        <rect x="98" y="66" width="64" height="40" rx="5" fill={C.surface} stroke={C.rule} />
        <rect x="98" y="66" width="64" height="9" rx="4" fill="#F29A38" opacity="0.85" />
        <circle cx="115" cy="90" r="8" fill={C.sunk} stroke={C.ruleStrong} />
        <path d="M130 86h24M130 94h18" stroke={C.ruleStrong} strokeWidth="3" strokeLinecap="round" />
      </g>
      <g transform="rotate(-3 120 118)">
        <rect x="88" y="104" width="58" height="20" rx="3" fill={C.accentDeep} />
        <path d="M96 114h24" stroke="#fff" strokeOpacity="0.6" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </Frame>
  );
}

/** A phone ringing, and a day marked on a calendar: the partner calls to fix the survey. */
export function SpotCall({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <Ground w={140} />
      <rect x="104" y="34" width="62" height="70" rx="8" fill={C.surface} stroke={C.rule} />
      <rect x="104" y="34" width="62" height="16" rx="8" fill={C.accent} />
      <rect x="104" y="44" width="62" height="6" fill={C.accent} />
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3].map((c) => (
          <rect
            key={`${r}-${c}`}
            x={112 + c * 12}
            y={58 + r * 13}
            width="8"
            height="8"
            rx="2"
            fill={r === 1 && c === 2 ? C.sun : C.sunk}
          />
        )),
      )}
      <rect x="40" y="26" width="46" height="96" rx="9" fill={C.ink} />
      <rect x="44" y="34" width="38" height="78" rx="5" fill={C.navy} />
      <circle cx="63" cy="62" r="11" fill={C.pos} />
      <path d="M58 58c2 6 5 9 10 10l2-3-3-2-2 1c-2-1-3-3-4-4l1-2-2-3z" fill={C.surface} />
      <path d="M50 88h26M54 96h18" stroke="#fff" strokeOpacity="0.4" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M26 46c-6 8-6 22 0 30M18 40c-10 12-10 30 0 42"
        stroke={C.pos}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.5"
      />
    </Frame>
  );
}

/** A pin on a district, with its neighbours around it. */
export function SpotDistrict({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <Ground w={150} />
      <path d="M30 96l38-22 40 10 34-18 30 14-10 34-44 8-44-6z" fill={C.sunk} stroke={C.ruleStrong} />
      <path d="M68 74l6 40M108 84l-6 38M142 66l-8 48" stroke={C.ruleStrong} />
      <path d="M68 74l40 10 -6 38-28-8z" fill={C.wash} stroke={C.accent} strokeWidth="1.5" />
      <path d="M90 34c-12 0-20 9-20 20 0 15 20 36 20 36s20-21 20-36c0-11-8-20-20-20z" fill={C.accent} />
      <circle cx="90" cy="54" r="7" fill={C.surface} />
      <circle cx="46" cy="98" r="3" fill={C.slate} opacity="0.4" />
      <circle cx="152" cy="92" r="3" fill={C.slate} opacity="0.4" />
      <circle cx="126" cy="112" r="3" fill={C.slate} opacity="0.4" />
    </Frame>
  );
}

/** A quotation sheet with the total circled. */
export function SpotQuote({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <Ground w={120} />
      <rect x="56" y="20" width="88" height="106" rx="5" fill={C.surface} stroke={C.rule} />
      <rect x="64" y="30" width="34" height="6" rx="2" fill={C.ink} />
      <path
        d="M64 48h72M64 58h60M64 68h72M64 78h52"
        stroke={C.ruleStrong}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <rect x="64" y="92" width="72" height="22" rx="4" fill={C.wash} />
      <path d="M72 103h20" stroke={C.accent} strokeWidth="3" strokeLinecap="round" />
      <path d="M110 103h18" stroke={C.accent} strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="119" cy="103" rx="17" ry="9" stroke={C.sun} strokeWidth="2" />
      <path d="M150 54l16-16" stroke={C.wood} strokeWidth="5" strokeLinecap="round" />
      <path d="M148 56l4-1-3-3z" fill={C.ink} />
    </Frame>
  );
}

/** A stamped form: the paperwork, done. */
export function SpotStamp({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <Ground w={130} />
      <rect x="40" y="30" width="80" height="96" rx="5" fill={C.surface} stroke={C.rule} />
      <path
        d="M50 44h50M50 54h60M50 64h44M50 74h56"
        stroke={C.ruleStrong}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="92" cy="100" r="16" stroke={C.pos} strokeWidth="2.5" />
      <path d="M85 100l5 5 9-10" stroke={C.pos} strokeWidth="2.5" strokeLinecap="round" />
      <rect x="132" y="70" width="28" height="12" rx="3" fill={C.ink} />
      <rect x="140" y="40" width="12" height="30" rx="5" fill={C.wood} />
      <rect x="128" y="82" width="36" height="6" rx="2" fill={C.pos} opacity="0.8" />
    </Frame>
  );
}

/** A question and an answer, as two speech bubbles. */
export function SpotAsk({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <Sun cx={160} cy={32} r={10} />
      <Ground w={130} />
      <path
        d="M36 38h76a10 10 0 0110 10v28a10 10 0 01-10 10H62l-14 12v-12H36a10 10 0 01-10-10V48a10 10 0 0110-10z"
        fill={C.surface}
        stroke={C.rule}
      />
      <text
        x="74"
        y="72"
        textAnchor="middle"
        fontSize="30"
        fontWeight="600"
        fill={C.accent}
        fontFamily="var(--font-display)"
      >
        ?
      </text>
      <path
        d="M88 76h66a10 10 0 0110 10v18a10 10 0 01-10 10h-8v10l-12-10H88a10 10 0 01-10-10V86a10 10 0 0110-10z"
        fill={C.accent}
      />
      <path d="M92 90h46M92 100h30" stroke="#fff" strokeOpacity="0.7" strokeWidth="3" strokeLinecap="round" />
    </Frame>
  );
}

/** Leads arriving on a phone. */
export function SpotLeads({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <Ground w={130} />
      <rect x="70" y="16" width="60" height="110" rx="10" fill={C.ink} />
      <rect x="75" y="24" width="50" height="94" rx="6" fill={C.paper} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="80" y={32 + i * 26} width="40" height="20" rx="4" fill={C.surface} stroke={C.rule} />
          <circle cx="88" cy={42 + i * 26} r="4" fill={i === 0 ? C.sun : C.wash} />
          <path
            d={`M96 ${39 + i * 26}h18M96 ${45 + i * 26}h12`}
            stroke={C.ruleStrong}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>
      ))}
      <rect x="132" y="30" width="44" height="22" rx="11" fill={C.accent} />
      <path d="M142 41h24" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <path d="M130 46l-8 6" stroke={C.accent} strokeWidth="2" />
    </Frame>
  );
}

/** Orina Grid on a laptop. */
export function SpotGrid({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <Ground w={160} />
      <rect x="40" y="28" width="120" height="78" rx="6" fill={C.ink} />
      <rect x="46" y="34" width="108" height="66" rx="3" fill={C.paper} />
      <rect x="46" y="34" width="26" height="66" fill={C.sunk} />
      <rect x="51" y="40" width="16" height="16" rx="3" fill={C.accent} />
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x="78"
          y={42 + i * 13}
          width={i === 0 ? 50 : 68}
          height="8"
          rx="2"
          fill={i === 0 ? C.ink : C.rule}
        />
      ))}
      <rect x="132" y="42" width="16" height="8" rx="4" fill={C.accent} />
      <path d="M28 106h144l-8 12H36z" fill={C.ruleStrong} />
      <path d="M88 106h24" stroke={C.slate} strokeWidth="2" />
    </Frame>
  );
}

/** A shed with its roof covered in panels: a shop, office or factory. */
export function SpotShed({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <Sun cx={164} cy={26} r={10} />
      <Ground w={170} />
      <polygon points="22,72 100,44 178,72 178,128 22,128" fill={C.wall} />
      <polygon points="150,62 178,72 178,128 150,128" fill={C.wallShade} />
      <polygon points="16,74 100,42 184,74 184,80 100,48 16,80" fill={C.ruleStrong} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <polygon
          key={i}
          points={`${30 + i * 12},${70 - i * 4.4} ${41 + i * 12},${66 - i * 4.4} ${41 + i * 12},${58 - i * 4.4} ${30 + i * 12},${62 - i * 4.4}`}
          fill={C.navy}
          stroke="#D5D9DF"
          strokeWidth="0.8"
        />
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <polygon
          key={`r${i}`}
          points={`${104 + i * 12},${48 + i * 4.4} ${115 + i * 12},${52 + i * 4.4} ${115 + i * 12},${44 + i * 4.4} ${104 + i * 12},${40 + i * 4.4}`}
          fill={C.navy}
          stroke="#D5D9DF"
          strokeWidth="0.8"
          opacity="0.9"
        />
      ))}
      <rect x="44" y="92" width="44" height="36" fill={C.ruleStrong} />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M44 ${98 + i * 8}h44`} stroke={C.slate} strokeOpacity="0.35" />
      ))}
      <rect x="108" y="92" width="18" height="14" fill="#9DB0C8" />
      <rect x="134" y="92" width="18" height="14" fill="#9DB0C8" />
    </Frame>
  );
}
