/**
 * The survey popup's picture: a street under a morning sky that follows the form. A pin bobs
 * over "your" house while they give the PIN; the sun climbs and panels open on its roof (as many
 * as their bill's system has kW) while they describe the place; a call rings at the door when
 * they give their number; and once sent, the panels catch the light.
 *
 * Everything moves by CSS transitions on state, so it costs nothing between steps and simply
 * jumps into place for reduced motion.
 */
import type { Progress } from '@/components/forms/SurveyWizard';

const W = 560;
const H = 176;
const GROUND = 172;

/** The sun's place for each step (and for sent), across the right of the sky. */
const SUN = [
  { x: 380, y: 96 },
  { x: 450, y: 46 },
  { x: 510, y: 66 },
];
const SUN_SENT = { x: 440, y: 40 };

/** Low on the left, under the title; "yours" in the middle stands a little taller. */
const HOUSES = [
  { x: -10, w: 110, h: 48, wall: '#E7DECD' },
  { x: 100, w: 96, h: 58, wall: '#EFE9DE' },
  // yours
  { x: 214, w: 132, h: 80, wall: '#F3EEE5' },
  { x: 364, w: 100, h: 62, wall: '#E5DCCB' },
  { x: 464, w: 110, h: 72, wall: '#EEE8DC' },
];
const YOURS = HOUSES[2]!;
const ROOF = GROUND - YOURS.h;

const ease = 'cubic-bezier(0.16, 1, 0.3, 1)';
const move = (ms: number, delay = 0) =>
  ({ transition: `transform ${ms}ms ${ease} ${delay}ms, opacity ${ms}ms ${ease} ${delay}ms` }) as const;

export function PopupScene({ p, className = '' }: { p: Progress | null; className?: string }) {
  const step = p?.step ?? 0;
  const sent = !!p?.sent;
  const sun = sent ? SUN_SENT : SUN[step]!;
  // panels from the second step: one a kW, 2 to 6, three until they give the bill
  const panels = step >= 1 || sent ? Math.max(2, Math.min(6, Math.round(p?.kw ?? 3))) : 0;
  const span = 6 * 20;
  const start = YOURS.x + (YOURS.w - span) / 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" className={className} aria-hidden>
      <defs>
        <linearGradient id="ps-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#DFE6FF" />
          <stop offset="62%" stopColor="#F2F1F8" />
          <stop offset="100%" stopColor="#FBF3E3" />
        </linearGradient>
        <radialGradient id="ps-sun">
          <stop offset="0%" stopColor="#FFFDF5" />
          <stop offset="35%" stopColor="#FFE7B0" />
          <stop offset="70%" stopColor="#F7C46A" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#F7C46A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ps-cell" x1="0" y1="1" x2="0.3" y2="0">
          <stop offset="0%" stopColor="#111A3D" />
          <stop offset="100%" stopColor="#2A3F8A" />
        </linearGradient>
        <linearGradient id="ps-glint" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id="ps-panels">
          {Array.from({ length: 6 }, (_, i) => (
            <rect key={i} x={start + i * 20} y={ROOF - 18} width="18" height="12" />
          ))}
        </clipPath>
      </defs>

      <rect width={W} height={H} fill="url(#ps-sky)" />
      {/* clouds */}
      <g fill="#fff" opacity="0.85">
        <ellipse cx="300" cy="40" rx="34" ry="8" />
        <ellipse cx="318" cy="34" rx="20" ry="9" />
        <ellipse cx="520" cy="110" rx="26" ry="6" />
      </g>

      <g
        style={{ transform: `translate(${sun.x}px, ${sun.y}px)`, ...move(1100) }}
        className="motion-reduce:!transition-none"
      >
        <circle r="64" fill="url(#ps-sun)" />
        <circle r="15" fill="#FFFCF0" />
      </g>

      {HOUSES.map((h, i) => {
        const y = GROUND - h.h;
        const mine = i === 2;
        return (
          <g key={h.x}>
            <rect x={h.x} y={y} width={h.w} height={h.h} fill={h.wall} />
            <rect x={h.x + h.w - 5} y={y} width="5" height={h.h} fill="#000" opacity="0.05" />
            <rect x={h.x - 3} y={y - 6} width={h.w + 6} height="6" fill="#FBF9F4" />
            <rect x={h.x} y={y} width={h.w} height="8" fill="#3B3326" opacity="0.08" />
            {Array.from({ length: Math.floor(h.w / 34) }, (_, c) =>
              Array.from({ length: Math.max(1, Math.floor((h.h - 36) / 30)) }, (_, r) => (
                <g key={`${c}-${r}`}>
                  <rect x={h.x + 12 + c * 34} y={y + 16 + r * 30} width="16" height="16" fill="#CFC6B6" />
                  <rect
                    x={h.x + 14 + c * 34}
                    y={y + 18 + r * 30}
                    width="12"
                    height="12"
                    fill={mine && sent ? '#FFE3A6' : '#9DB0C8'}
                    style={move(600)}
                  />
                  <rect x={h.x + 9 + c * 34} y={y + 13 + r * 30} width="22" height="2.5" fill="#FBF9F4" />
                </g>
              )),
            )}
            <rect x={h.x + h.w / 2 - 9} y={GROUND - 28} width="18" height="28" fill="#8B6B4E" />
            {/* a tank on the far roof, clear of the title */}
            {i === 4 ? (
              <g>
                <rect x={h.x + h.w - 30} y={y - 26} width="20" height="20" rx="3" fill="#232326" />
                <ellipse cx={h.x + h.w - 20} cy={y - 26} rx="10" ry="2" fill="#3A3A3E" />
              </g>
            ) : null}
          </g>
        );
      })}

      {/* your panels: they open one after another */}
      {Array.from({ length: 6 }, (_, i) => {
        const x = start + i * 20;
        const on = i < panels;
        return (
          <g
            key={i}
            style={{
              transform: on ? 'scaleY(1)' : 'scaleY(0)',
              transformOrigin: `${x + 9}px ${ROOF - 6}px`,
              opacity: on ? 1 : 0,
              ...move(700, on ? i * 70 : 0),
            }}
            className="motion-reduce:!transition-none"
          >
            <path
              d={`M${x + 3} ${ROOF - 6}V${ROOF}M${x + 15} ${ROOF - 14}V${ROOF}`}
              stroke="#9AA0A8"
              strokeWidth="1.4"
            />
            <polygon
              points={`${x},${ROOF - 6} ${x + 16},${ROOF - 6} ${x + 19},${ROOF - 17} ${x + 3},${ROOF - 17}`}
              fill="url(#ps-cell)"
              stroke="#D5D9DF"
              strokeWidth="0.9"
            />
            <path
              d={`M${x + 6} ${ROOF - 6}l1.2-11M${x + 11} ${ROOF - 6}l1.2-11`}
              stroke="#4B62B8"
              strokeWidth="0.5"
            />
          </g>
        );
      })}
      {/* once sent: the light runs over them */}
      <g clipPath="url(#ps-panels)">
        <rect
          x={start - 60}
          y={ROOF - 24}
          width="40"
          height="24"
          fill="url(#ps-glint)"
          style={{ transform: sent ? `translateX(${span + 100}px)` : 'translateX(0)', ...move(1600, 300) }}
          className="motion-reduce:!transition-none"
        />
      </g>

      {/* the pin over your house, while they give the PIN */}
      <g
        style={{
          transform: `translate(${YOURS.x + YOURS.w / 2}px, ${ROOF - 34}px) scale(${step === 0 && !sent ? 1 : 0.4})`,
          opacity: step === 0 && !sent ? 1 : 0,
          ...move(500),
        }}
        className="motion-reduce:!transition-none"
      >
        <g className="animate-[bob_1.6s_ease-in-out_infinite] motion-reduce:animate-none">
          <path d="M0 -22c-8 0-14 6-14 14 0 10 14 22 14 22s14-12 14-22c0-8-6-14-14-14z" fill="#2340E8" />
          <circle cy="-8" r="5" fill="#fff" />
        </g>
        <ellipse cy="18" rx="8" ry="2" fill="#0B0B0D" opacity="0.15" />
      </g>

      {/* the call that follows, at the door */}
      <g
        style={{
          transform: `translate(${YOURS.x + YOURS.w + 6}px, ${GROUND - 62}px) scale(${step === 2 && !sent ? 1 : 0.5})`,
          opacity: step === 2 && !sent ? 1 : 0,
          transformOrigin: '0 20px',
          ...move(500),
        }}
        className="motion-reduce:!transition-none"
      >
        <path
          d="M0 0h34a8 8 0 018 8v12a8 8 0 01-8 8H12l-8 7v-7H0a8 8 0 01-8-8V8a8 8 0 018-8z"
          fill="#1C7A5E"
        />
        <path
          d="M12 7c1.5 5 4 7.5 8.5 9l2-2.4-2.6-1.6-1.6 1c-1.6-.8-2.6-2-3.3-3.4l.9-1.6L14 6z"
          fill="#fff"
        />
        <path
          d="M27 9c2 1.6 2 7 0 8.6M31 6c3.5 3 3.5 11 0 14"
          stroke="#fff"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />
      </g>

      {/* sent: a tick over the roof */}
      <g
        style={{
          transform: `translate(${YOURS.x + YOURS.w / 2}px, ${ROOF - 40}px) scale(${sent ? 1 : 0.3})`,
          opacity: sent ? 1 : 0,
          ...move(600, 500),
        }}
        className="motion-reduce:!transition-none"
      >
        <circle r="13" fill="#1C7A5E" />
        <path
          d="M-6 0l4 4 8-8"
          stroke="#fff"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>

      <rect y={GROUND} width={W} height={H - GROUND} fill="#E7E1D4" />
    </svg>
  );
}
