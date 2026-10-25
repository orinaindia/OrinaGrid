'use client';

/**
 * "Book a free site survey" in three short steps: the roof (its PIN, which finds the district),
 * the place (a home, a society or a business, and the bill, with a live estimate), and you.
 * Each step checks only its own fields; a field the server turns down takes you back to its step.
 */
import { useEffect, useEffectEvent, useId, useRef, useState } from 'react';
import { SpotHome, SpotShed, SpotSociety } from '@/components/art/Spots';
import { gsap, MOTION_OK, useGSAP } from '@/components/motion/gsap';
import { Arrow, buttonClass } from '@/components/ui/ButtonLink';
import {
  check,
  isPin,
  SEGMENTS,
  type Field as FieldName,
  type FieldErrors,
  type HomeEnquiry,
  type Segment,
} from '@/lib/enquiry';
import type { Place } from '@/lib/geo';
import { SITE } from '@/lib/site';
import { estimate, inr, SOLAR } from '@/lib/solar';
import {
  Consent,
  ErrorText,
  Field,
  Honeypot,
  honeypotOf,
  mobileDigits,
  NotSent,
  PinBoxes,
  PlacePickers,
  send,
  spaced,
} from './fields';

const STEPS: { name: string; title: string; fields: FieldName[] }[] = [
  { name: 'Roof', title: 'Where is the roof?', fields: ['state', 'district', 'pin'] },
  { name: 'Place', title: 'What kind of place is it?', fields: [] },
  { name: 'You', title: 'Who should the partner call?', fields: ['name', 'phone', 'consent'] },
];

const stepOf = (field: string) =>
  Math.max(
    0,
    STEPS.findIndex((s) => s.fields.includes(field as FieldName)),
  );

const ART: Record<Segment, typeof SpotHome> = {
  residential: SpotHome,
  group_housing: SpotSociety,
  commercial: SpotShed,
};

type Lookup = { pin: string; place: Place | null } | null;

/** Where they are, for a picture beside the form (the popup's scene). */
export interface Progress {
  step: number;
  /** The system their bill points to, once they have given it. */
  kw?: number;
  sent: boolean;
}

/** What the roof could do, from the bill: homes get the subsidy worked out, others a note. */
function Estimate({ bill, segment }: { bill: number; segment: Segment }) {
  const e = estimate(bill);
  const cells: [string, string][] = [
    ['System', `~${e.kw} kW`],
    segment === 'residential'
      ? ['Subsidy', inr(e.subsidy)]
      : segment === 'group_housing'
        ? ['Subsidy', '₹18,000/kW']
        : ['Subsidy', 'None'],
    ['Saves', `${inr(e.savedPerMonth)}/mo`],
  ];
  return (
    <dl data-estimate className="grid grid-cols-3 gap-2">
      {cells.map(([k, v]) => (
        <div key={k} className="rounded-2xl bg-accent-wash px-3 py-3">
          <dt className="text-[0.7rem] uppercase tracking-wider text-accent">{k}</dt>
          <dd className="t-num mt-1 text-[1.05rem] font-medium sm:text-[1.15rem]">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function SurveyWizard({
  bill: billFromLink,
  place,
  onSent,
  onProgress,
}: {
  /** An exact bill a link brought (the calculator's). */
  bill?: number;
  /** A district already chosen (the partner finder's). */
  place?: Place;
  onSent?: () => void;
  onProgress?: (p: Progress) => void;
}) {
  const uid = useId();
  const form = useRef<HTMLFormElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [v, setV] = useState({
    state: place?.state ?? '',
    district: place?.district ?? '',
    pin: '',
    name: '',
    phone: '',
  });
  const [segment, setSegment] = useState<Segment>('residential');
  // the slider sends a bill only once it has been moved (or a link brought one)
  const [bill, setBill] = useState(billFromLink ?? 2500);
  const [billGiven, setBillGiven] = useState(!!billFromLink);
  const [consent, setConsent] = useState(false);
  const [lookup, setLookup] = useState<Lookup>(null);
  const [picking, setPicking] = useState(false);

  const clear = (...keys: FieldName[]) =>
    setErrors((o) =>
      keys.some((k) => o[k]) ? { ...o, ...Object.fromEntries(keys.map((k) => [k, undefined])) } : o,
    );
  const set = (k: keyof typeof v) => (value: string) => {
    setV((o) => ({ ...o, [k]: value }));
    clear(k as FieldName);
  };

  // a full PIN: where it is, and the district follows it
  useEffect(() => {
    if (!isPin(v.pin)) return;
    const pin = v.pin;
    const ask = new AbortController();
    fetch(`/api/pin/${pin}`, { signal: ask.signal })
      .then((r) => (r.ok ? (r.json() as Promise<Place>) : null))
      .then((found) => {
        setLookup({ pin, place: found });
        if (found) {
          setV((o) => ({ ...o, state: found.state, district: found.district }));
          clear('state', 'district');
        }
      })
      .catch(() => {});
    return () => ask.abort();
  }, [v.pin]);

  // an effect event: a new callback each render must not re-run the report
  const report = useEffectEvent((p: Progress) => onProgress?.(p));
  const kw = billGiven ? estimate(bill).kw : undefined;
  useEffect(() => {
    report({ step, sent, ...(kw ? { kw } : {}) });
  }, [step, sent, kw]);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from('[data-step]', { opacity: 0, x: 24, duration: 0.55, ease: 'expo.out' });
      });
    },
    { scope: body, dependencies: [step, sent], revertOnUpdate: true },
  );

  // the estimate rises in when the slider is first moved
  useGSAP(
    () => {
      if (!billGiven || !window.matchMedia(MOTION_OK).matches) return;
      gsap.from('[data-estimate] > div', {
        opacity: 0,
        y: 8,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power3.out',
      });
    },
    { scope: body, dependencies: [billGiven, segment] },
  );

  const enquiry = (): HomeEnquiry => ({
    kind: 'home',
    ...v,
    segment,
    consent,
    website: honeypotOf(form.current),
    ...(billGiven ? { bill } : {}),
  });

  const focusFirst = (found: FieldErrors) => {
    const first = Object.keys(found)[0];
    if (first)
      requestAnimationFrame(() => form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus());
  };

  async function next(ev: React.FormEvent) {
    ev.preventDefault();
    if (sending) return;
    // without a full PIN, only the PIN is asked for: a full one brings its own district
    const found: FieldErrors =
      step === 0 && !isPin(v.pin)
        ? { pin: 'Please enter the 6-digit PIN code' }
        : check(enquiry(), STEPS[step]!.fields);
    if (Object.keys(found).length) {
      setErrors(found);
      // a district the PIN did not give: show the pickers to choose it
      if (found.state || found.district) setPicking(true);
      return focusFirst(found);
    }
    if (step < STEPS.length - 1) return setStep(step + 1);

    setSending(true);
    setFailed(null);
    const res = await send(enquiry());
    setSending(false);
    if (res.ok) {
      setSent(true);
      onSent?.();
      return;
    }
    if (res.fields && Object.keys(res.fields).length) {
      setErrors(res.fields);
      setStep(stepOf(Object.keys(res.fields)[0]!));
      return focusFirst(res.fields);
    }
    setFailed(res.message);
  }

  const firstName = v.name.trim().split(/\s+/)[0] ?? '';
  const found = lookup?.pin === v.pin ? lookup : null;
  const showPickers = !place && (picking || (found && !found.place));
  const { min, max, step: billStep } = SOLAR.bill;
  const fill = ((bill - min) / (max - min)) * 100;

  if (sent)
    return (
      <div ref={body}>
        <div data-step role="status" className="py-2">
          <span className="grid size-14 place-items-center rounded-full bg-pos/10">
            <svg viewBox="0 0 24 24" className="size-7 text-pos" aria-hidden>
              <path
                d="M5 12.5l4.5 4.5L19 7.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <p className="t-h3 mt-6">Thank you{firstName ? `, ${firstName}` : ''}.</p>
          <p className="mt-3 max-w-md text-slate">
            The Orina Grid partner for {v.district || 'your district'} will call you, usually within a working
            day, to fix a time for the survey.
          </p>
          <p className="mt-6 text-sm text-slate">
            In a hurry?{' '}
            <a href={SITE.phoneHref} className="font-medium text-accent underline-offset-4 hover:underline">
              Call {SITE.phone}
            </a>
          </p>
        </div>
      </div>
    );

  return (
    <div ref={body}>
      <form ref={form} onSubmit={next} noValidate aria-busy={sending}>
        <Honeypot />

        {/* where they are: three named parts that fill as they go */}
        <ol className="grid grid-cols-3 gap-2" aria-label={`Step ${step + 1} of ${STEPS.length}`}>
          {STEPS.map((s, i) => (
            <li key={s.name} aria-current={i === step ? 'step' : undefined}>
              <span className="block h-1 overflow-hidden rounded-full bg-sunk">
                <span
                  className={`block h-full rounded-full bg-accent transition-transform duration-700 ease-out-expo origin-left ${
                    i <= step ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </span>
              <span
                className={`mt-2 block font-mono text-[0.68rem] uppercase tracking-wider ${
                  i === step ? 'text-ink' : 'text-muted'
                }`}
              >
                {i < step ? '✓ ' : ''}
                {s.name}
              </span>
            </li>
          ))}
        </ol>

        <div data-step key={step} className="mt-6 min-h-[15rem]">
          <p className="t-h3">{STEPS[step]!.title}</p>

          {step === 0 ? (
            <div className="mt-5">
              <label htmlFor={`${uid}-pin`} className="text-sm text-slate">
                PIN code <span className="text-muted">(it is on your electricity bill)</span>
              </label>
              <div className="mt-2">
                <PinBoxes
                  id={`${uid}-pin`}
                  value={v.pin}
                  onChange={set('pin')}
                  invalid={!!errors.pin}
                  describedBy={errors.pin ? `${uid}-pin-error` : `${uid}-pin-place`}
                />
              </div>
              {errors.pin ? <ErrorText id={`${uid}-pin-error`}>{errors.pin}</ErrorText> : null}

              {/* what the PIN told us */}
              <div id={`${uid}-pin-place`} aria-live="polite" className="mt-4 min-h-12">
                {place || found?.place ? (
                  <div className="flex items-center justify-between gap-3 rounded-2xl bg-pos/8 px-4 py-3">
                    <p className="flex min-w-0 items-center gap-2.5 text-sm">
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-pos text-[0.7rem] text-surface">
                        ✓
                      </span>
                      <span className="truncate">
                        <span className="font-medium">{v.district}</span>
                        <span className="text-slate">, {v.state}</span>
                      </span>
                    </p>
                    {!place && !picking ? (
                      <button
                        type="button"
                        onClick={() => setPicking(true)}
                        className="shrink-0 text-sm font-medium text-accent underline-offset-4 hover:underline"
                      >
                        Change
                      </button>
                    ) : null}
                  </div>
                ) : found && !found.place ? (
                  <p className="text-sm text-slate">
                    We could not find this PIN. Please choose your district.
                  </p>
                ) : (
                  <p className="text-sm text-slate">The PIN tells us which partner serves your district.</p>
                )}
              </div>

              {showPickers ? (
                <div className="mt-5">
                  <PlacePickers
                    uid={uid}
                    state={v.state}
                    district={v.district}
                    errors={errors}
                    onChange={(p) => {
                      setV((o) => ({ ...o, ...p }));
                      clear('state', 'district');
                    }}
                  />
                </div>
              ) : null}
            </div>
          ) : null}

          {step === 1 ? (
            <div className="mt-4 grid gap-5">
              <fieldset>
                <legend className="sr-only">The place</legend>
                <div className="grid grid-cols-3 gap-2">
                  {SEGMENTS.map((s) => {
                    const Art = ART[s.key];
                    return (
                      <label
                        key={s.key}
                        className="group relative flex cursor-pointer flex-col items-center rounded-2xl border border-rule-strong px-2 pb-3 pt-2 text-center transition-[border-color,background-color,box-shadow] duration-300 hover:border-ink/40 has-[:checked]:border-accent has-[:checked]:bg-accent-wash has-[:checked]:shadow-[0_0_0_3px_var(--color-accent-wash)] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent"
                      >
                        <input
                          type="radio"
                          name="segment"
                          value={s.key}
                          checked={segment === s.key}
                          onChange={() => setSegment(s.key)}
                          className="peer sr-only"
                        />
                        <Art className="h-14 w-auto transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 sm:h-16" />
                        <span className="mt-1 text-sm font-medium leading-tight">{s.label}</span>
                        <span className="absolute right-2 top-2 grid size-5 scale-0 place-items-center rounded-full bg-accent text-[0.6rem] text-surface transition-transform duration-300 peer-checked:scale-100">
                          ✓
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div>
                <label htmlFor={`${uid}-bill`} className="flex items-baseline justify-between gap-4">
                  <span className="text-sm text-slate">Monthly electricity bill</span>
                  <output
                    htmlFor={`${uid}-bill`}
                    className={`t-num font-display text-[1.6rem] ${billGiven ? 'text-ink' : 'text-muted'}`}
                  >
                    {inr(bill)}
                  </output>
                </label>
                <input
                  id={`${uid}-bill`}
                  type="range"
                  min={min}
                  max={max}
                  step={billStep}
                  value={bill}
                  onChange={(e) => {
                    setBill(Number(e.target.value));
                    setBillGiven(true);
                  }}
                  className="range range-light mt-3 w-full"
                  style={{ '--fill': `${fill}%` } as React.CSSProperties}
                  aria-valuetext={`${inr(bill)} a month`}
                />
                <div className="mt-3">
                  {billGiven ? (
                    <Estimate bill={bill} segment={segment} />
                  ) : (
                    <p className="rounded-2xl border border-dashed border-rule-strong px-4 py-3 text-sm text-slate">
                      Slide to your bill to see what your roof could save. Not sure? Skip it.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="mt-5 grid gap-6">
              <Field id={`${uid}-name`} name="name" label="Your name" error={errors.name}>
                <input
                  value={v.name}
                  onChange={(e) => set('name')(e.target.value)}
                  autoComplete="name"
                  maxLength={100}
                />
              </Field>
              <Field
                id={`${uid}-phone`}
                name="phone"
                label="Mobile (WhatsApp)"
                error={errors.phone}
                prefix="+91"
              >
                <input
                  value={spaced(v.phone)}
                  onChange={(e) => set('phone')(mobileDigits(e.target.value))}
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="98250 12345"
                />
              </Field>
              <Consent
                id={`${uid}-consent`}
                checked={consent}
                onChange={(c) => {
                  setConsent(c);
                  clear('consent');
                }}
                error={errors.consent}
              >
                The Orina Grid partner for my district may call or WhatsApp me about this. My number is not
                sold.
              </Consent>
              {failed ? <NotSent message={failed} /> : null}
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex items-center gap-3">
          {step > 0 ? (
            <button type="button" onClick={() => setStep(step - 1)} className={buttonClass('ghost')}>
              Back
            </button>
          ) : null}
          <button type="submit" disabled={sending} className={`${buttonClass()} flex-1 disabled:opacity-60`}>
            <span>
              {sending
                ? 'Sending…'
                : step === 1 && !billGiven
                  ? 'Skip the bill'
                  : step < STEPS.length - 1
                    ? 'Next'
                    : 'Book my free survey'}
            </span>
            {sending ? null : <Arrow />}
          </button>
        </div>
      </form>
    </div>
  );
}
