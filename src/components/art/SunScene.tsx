'use client';

/**
 * The hero's picture: a street of Indian flat-roofed houses, several with solar panels, and the
 * sun. On load the houses rise, the panels unfold and the sun comes up; on scroll the sun crosses
 * the sky and a glint runs over the panels around noon.
 *
 * Drawn with depth, not as line art: shaded walls, slab shadows, chhajjas over the windows, black
 * water tanks, panels with cells, aluminium frames and steel legs. The sun's whole arc, glow
 * included, lies inside the viewBox, and the frame keeps the viewBox's shape on wide screens, so
 * nothing of it is cut; phones see the middle of the street.
 */
import { useRef } from 'react';
import { gsap, MOTION_OK, useGSAP } from '@/components/motion/gsap';

const W = 1440;
const H = 600;
/** The sky above this is left out: the frame starts here. */
const SKY_TOP = 70;
const GROUND = 560;
/** Low on the left, highest at y≈225, low on the right: halo (r 70) and bloom stay below SKY_TOP. */
const SUN_PATH = 'M 70 540 C 370 120, 1070 120, 1370 540';

interface House {
  x: number;
  w: number;
  h: number;
  /** Wall colour, lit face. */
  wall: string;
  panels?: number;
  /** A water tank: at the left end of a roof with panels, else the right. */
  tank?: boolean;
  /** The stair room on the roof. */
  mumty?: boolean;
  balcony?: boolean;
}

const HOUSES: House[] = [
  { x: -10, w: 150, h: 150, wall: '#E9E2D4' },
  { x: 140, w: 220, h: 236, wall: '#F1ECE2', panels: 3, tank: true, balcony: true },
  { x: 360, w: 140, h: 176, wall: '#E3D9C6', mumty: true },
  { x: 500, w: 262, h: 286, wall: '#EEE8DC', panels: 4, tank: true, balcony: true },
  { x: 762, w: 160, h: 200, wall: '#E7DECD', mumty: true },
  { x: 922, w: 236, h: 252, wall: '#F2EDE4', panels: 4, balcony: true },
  { x: 1158, w: 130, h: 166, wall: '#E5DCCB', tank: true },
  { x: 1288, w: 170, h: 214, wall: '#EFE9DE', panels: 3, mumty: true },
];

/** Crowns showing over the lower roofs, behind them (their trunks are hidden by the houses). */
const TREES = [
  { x: 70, cy: 396, r: 44 },
  { x: 846, cy: 350, r: 50 },
  { x: 1224, cy: 380, r: 40 },
];

const top = (h: House) => GROUND - h.h;

function windows(h: House) {
  const cols = Math.max(2, Math.floor(h.w / 64));
  const rows = Math.max(1, Math.floor((h.h - 70) / 70));
  const gap = h.w / cols;
  const out: { x: number; y: number }[] = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) out.push({ x: h.x + c * gap + gap / 2 - 15, y: top(h) + 40 + r * 70 });
  return out;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** One tilted panel on its legs: the low front edge, the high back edge set back a little. */
function panel(x: number, roof: number) {
  const fl = { x, y: roof - 8 };
  const fr = { x: x + 40, y: roof - 8 };
  const br = { x: x + 48, y: roof - 30 };
  const bl = { x: x + 8, y: roof - 30 };
  const at = (u: number, v: number) => ({
    x: lerp(lerp(fl.x, fr.x, u), lerp(bl.x, br.x, u), v),
    y: lerp(lerp(fl.y, fr.y, u), lerp(bl.y, br.y, u), v),
  });
  const cells: string[] = [];
  for (let i = 1; i < 6; i++) {
    const a = at(i / 6, 0);
    const b = at(i / 6, 1);
    cells.push(`M${a.x} ${a.y}L${b.x} ${b.y}`);
  }
  for (let j = 1; j < 3; j++) {
    const a = at(0, j / 3);
    const b = at(1, j / 3);
    cells.push(`M${a.x} ${a.y}L${b.x} ${b.y}`);
  }
  return {
    face: `${fl.x},${fl.y} ${fr.x},${fr.y} ${br.x},${br.y} ${bl.x},${bl.y}`,
    cells: cells.join(''),
    legs: `M${fl.x + 3} ${fl.y}V${roof}M${fr.x - 3} ${fr.y}V${roof}M${bl.x + 3} ${bl.y}V${roof}M${br.x - 3} ${br.y}V${roof}M${fl.x + 3} ${roof - 2}L${bl.x + 3} ${bl.y + 2}`,
  };
}

function panelsOf(h: House) {
  const n = h.panels ?? 0;
  const span = n * 44 + 8;
  // after the tank (it stands at the left end), else centred
  const start = h.tank ? h.x + 74 : h.x + (h.w - span) / 2;
  return Array.from({ length: n }, (_, i) => panel(start + i * 44, top(h) - 10));
}

export function SunScene({ className = '' }: { className?: string }) {
  const root = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const arc = root.current?.querySelector<SVGPathElement>('[data-arc]');
      if (!arc) return;
      const along = (start: number, end: number) => ({
        path: arc,
        align: arc,
        alignOrigin: [0.5, 0.5] as [number, number],
        start,
        end,
      });
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.set('[data-sun]', { motionPath: along(0, 0) });
        gsap
          .timeline({ defaults: { ease: 'expo.out' } })
          .from('[data-house]', { y: 70, opacity: 0, duration: 1.4, stagger: 0.06 })
          .from(
            '[data-tree]',
            { scale: 0.6, opacity: 0, transformOrigin: '50% 100%', duration: 1.2, stagger: 0.1 },
            '-=1.2',
          )
          .from(
            '[data-panel]',
            { scaleY: 0, transformOrigin: '50% 100%', duration: 0.9, stagger: 0.03 },
            '-=0.9',
          )
          .fromTo(
            '[data-sun]',
            { opacity: 0 },
            { opacity: 1, motionPath: along(0, 0.2), duration: 2.2, ease: 'power3.out' },
            '-=1.4',
          );

        // the day goes by as the page scrolls: the sun crosses, a glint runs over the panels at noon
        gsap
          .timeline({
            scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'bottom top', scrub: 0.8 },
          })
          .to('[data-sun]', { motionPath: along(0.2, 0.8), ease: 'none', duration: 1 })
          .fromTo('[data-glint]', { x: -1600 }, { x: 1600, ease: 'sine.inOut', duration: 0.6 }, 0.2);
      });
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('[data-sun]', { motionPath: along(0.36, 0.36), opacity: 1 });
      });
    },
    { scope: root },
  );

  return (
    <svg
      ref={root}
      viewBox={`0 ${SKY_TOP} ${W} ${H - SKY_TOP}`}
      preserveAspectRatio="xMidYMax slice"
      className={className}
      role="img"
      aria-label="A street of flat-roofed houses with solar panels, and the sun crossing the sky"
    >
      <defs>
        <radialGradient id="sun-bloom">
          <stop offset="0%" stopColor="#FFD58A" stopOpacity="0.55" />
          <stop offset="35%" stopColor="#F5B85A" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#E8A33D" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sun-halo">
          <stop offset="0%" stopColor="#FFF8E6" stopOpacity="1" />
          <stop offset="45%" stopColor="#FFE3A6" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#F7BE5C" stopOpacity="0" />
        </radialGradient>
        <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
        <linearGradient id="cell" x1="0" y1="1" x2="0.3" y2="0">
          <stop offset="0%" stopColor="#111A3D" />
          <stop offset="55%" stopColor="#1C2C66" />
          <stop offset="100%" stopColor="#2A3F8A" />
        </linearGradient>
        <linearGradient id="wall-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.07" />
        </linearGradient>
        <linearGradient id="slab-shadow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B3326" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#3B3326" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A9BCD3" />
          <stop offset="60%" stopColor="#7E93AE" />
          <stop offset="100%" stopColor="#5E718A" />
        </linearGradient>
        <linearGradient id="tank" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1A1A1C" />
          <stop offset="40%" stopColor="#3A3A3E" />
          <stop offset="100%" stopColor="#141416" />
        </linearGradient>
        <linearGradient id="glint-g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D9D3C6" />
          <stop offset="100%" stopColor="#E9E5DC" />
        </linearGradient>
        {/* the panels, as a clip for the glint that crosses them */}
        <clipPath id="panel-faces">
          {HOUSES.flatMap((h) => panelsOf(h).map((p) => <polygon key={p.face} points={p.face} />))}
        </clipPath>
      </defs>

      {/* the sun's way across the sky */}
      <path
        data-arc
        d={SUN_PATH}
        fill="none"
        stroke="#CFCCC2"
        strokeWidth="1"
        strokeDasharray="2 8"
        opacity="0.8"
      />

      <g data-sun opacity="0">
        <circle r="150" fill="url(#sun-bloom)" />
        <circle r="70" fill="url(#sun-halo)" filter="url(#soft)" />
        <circle r="30" fill="#FFFCF2" filter="url(#soft)" />
      </g>

      {TREES.map((t) => (
        <g key={t.x} data-tree>
          <circle cx={t.x} cy={t.cy} r={t.r} fill="#7E9670" />
          <circle cx={t.x - t.r * 0.5} cy={t.cy + t.r * 0.3} r={t.r * 0.72} fill="#8DA57E" />
          <circle cx={t.x + t.r * 0.55} cy={t.cy + t.r * 0.25} r={t.r * 0.64} fill="#6F8862" />
          <circle cx={t.x - t.r * 0.15} cy={t.cy - t.r * 0.35} r={t.r * 0.45} fill="#9AB28A" opacity="0.7" />
        </g>
      ))}

      {HOUSES.map((h) => {
        const y = top(h);
        return (
          <g key={h.x} data-house>
            {h.mumty ? (
              <g>
                <rect x={h.x + 16} y={y - 50} width="58" height="50" fill={h.wall} />
                <rect x={h.x + 16} y={y - 50} width="58" height="50" fill="url(#wall-shade)" />
                <rect x={h.x + 12} y={y - 56} width="66" height="7" fill="#F6F3EC" />
                <rect x={h.x + 32} y={y - 38} width="22" height="38" fill="#8B6B4E" />
              </g>
            ) : null}
            {h.tank ? (
              <g transform={h.panels ? `translate(${80 - h.w} 0)` : undefined}>
                <rect x={h.x + h.w - 62} y={y - 46} width="40" height="44" rx="6" fill="url(#tank)" />
                {[0, 1, 2, 3].map((i) => (
                  <line
                    key={i}
                    x1={h.x + h.w - 62}
                    x2={h.x + h.w - 22}
                    y1={y - 36 + i * 9}
                    y2={y - 36 + i * 9}
                    stroke="#55555A"
                    strokeWidth="1"
                  />
                ))}
                <ellipse cx={h.x + h.w - 42} cy={y - 46} rx="20" ry="4" fill="#2B2B2F" />
                <rect x={h.x + h.w - 47} y={y - 54} width="10" height="7" rx="2" fill="#1E1E21" />
              </g>
            ) : null}

            {/* walls, lit, with the fall of shade toward the street */}
            <rect x={h.x} y={y} width={h.w} height={h.h} fill={h.wall} />
            <rect x={h.x} y={y} width={h.w} height={h.h} fill="url(#wall-shade)" />
            <rect x={h.x + h.w - 6} y={y} width="6" height={h.h} fill="#000" opacity="0.06" />
            {/* parapet and slab, and its shadow on the wall */}
            <rect x={h.x - 5} y={y - 12} width={h.w + 10} height="12" fill="#F7F4EE" />
            <rect x={h.x - 5} y={y - 12} width={h.w + 10} height="2" fill="#fff" opacity="0.8" />
            <rect x={h.x} y={y} width={h.w} height="16" fill="url(#slab-shadow)" />

            {windows(h).map((w) => (
              <g key={`${w.x}-${w.y}`}>
                <rect x={w.x - 3} y={w.y - 3} width="36" height="40" fill="#CFC6B6" />
                <rect x={w.x} y={w.y} width="30" height="34" fill="url(#glass)" />
                <path
                  d={`M${w.x + 15} ${w.y}V${w.y + 34}M${w.x} ${w.y + 12}H${w.x + 30}M${w.x} ${w.y + 23}H${w.x + 30}`}
                  stroke="#4A4238"
                  strokeWidth="1.2"
                  opacity="0.7"
                />
                {/* the chhajja over it, and its shadow */}
                <rect x={w.x - 8} y={w.y - 9} width="46" height="5" fill="#F4F0E8" />
                <rect x={w.x - 3} y={w.y - 4} width="36" height="9" fill="url(#slab-shadow)" />
              </g>
            ))}

            {h.balcony ? (
              <g>
                <rect x={h.x + h.w * 0.18} y={y + h.h * 0.5} width={h.w * 0.64} height="5" fill="#F4F0E8" />
                {Array.from({ length: 12 }, (_, i) => (
                  <line
                    key={i}
                    x1={h.x + h.w * 0.18 + 4 + i * ((h.w * 0.64 - 8) / 11)}
                    x2={h.x + h.w * 0.18 + 4 + i * ((h.w * 0.64 - 8) / 11)}
                    y1={y + h.h * 0.5 - 22}
                    y2={y + h.h * 0.5}
                    stroke="#5E564C"
                    strokeWidth="1.2"
                  />
                ))}
                <rect
                  x={h.x + h.w * 0.18}
                  y={y + h.h * 0.5 - 24}
                  width={h.w * 0.64}
                  height="3"
                  fill="#5E564C"
                />
              </g>
            ) : null}

            {/* the door, in wood */}
            <rect x={h.x + h.w / 2 - 19} y={GROUND - 60} width="38" height="60" fill="#CFC6B6" />
            <rect x={h.x + h.w / 2 - 15} y={GROUND - 56} width="30" height="56" fill="#8B6B4E" />
            <path d={`M${h.x + h.w / 2} ${GROUND - 56}V${GROUND}`} stroke="#6E543C" strokeWidth="1.5" />

            {panelsOf(h).map((p) => (
              <g key={p.face} data-panel>
                <path d={p.legs} stroke="#9AA0A8" strokeWidth="2" fill="none" />
                <polygon points={p.face} fill="url(#cell)" />
                <path d={p.cells} stroke="#4B62B8" strokeWidth="0.6" opacity="0.6" fill="none" />
                <polygon
                  points={p.face}
                  fill="none"
                  stroke="#D5D9DF"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </g>
            ))}
          </g>
        );
      })}

      {/* a glint of sun running over the glass, kept to the panels */}
      <g clipPath="url(#panel-faces)">
        <g data-glint transform="translate(-1600 0)">
          <rect x="-120" y="0" width="240" height={H} fill="url(#glint-g)" transform="skewX(-20)" />
        </g>
      </g>

      {/* the street */}
      <rect x="0" y={GROUND} width={W} height={H - GROUND} fill="url(#road)" />
      <rect x="0" y={GROUND} width={W} height="3" fill="#000" opacity="0.08" />
    </svg>
  );
}
