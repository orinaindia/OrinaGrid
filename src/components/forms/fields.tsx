'use client';

/**
 * What the site's forms are made of: labelled fields that wire their own ids, errors and hints,
 * the state and district pickers, the consent line, the hidden field for bots, and `send`.
 */
import { cloneElement, useRef, type ReactElement, type ReactNode } from 'react';
import type { Enquiry, FieldErrors } from '@/lib/enquiry';
import { districtsOf, STATES } from '@/lib/geo';
import { SITE } from '@/lib/site';

/** "9825012345" → "98250 12345", as it is typed. */
export const spaced = (digits: string) =>
  digits.length > 5 ? `${digits.slice(0, 5)} ${digits.slice(5)}` : digits;
export const digitsOf = (s: string, max: number) => s.replace(/\D/g, '').slice(0, max);

/** The 10 digits of a typed or pasted mobile: "+91 98250 12345", "098250 12345", "919825012345". */
export function mobileDigits(raw: string): string {
  let d = raw.replace(/\D/g, '');
  if (raw.trim().startsWith('+91') || (d.length === 12 && d.startsWith('91'))) d = d.slice(2);
  else if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
  return d.slice(0, 10);
}

const CONTROL =
  'min-h-12 w-full bg-transparent py-3 text-[1.05rem] text-ink outline-none placeholder:text-muted';

/** A labelled field: the input, select or textarea it wraps gets the id, name and error wiring. */
export function Field({
  id,
  name,
  label,
  hint,
  error,
  prefix,
  children,
}: {
  id: string;
  name: string;
  label: string;
  hint?: ReactNode;
  error?: string | undefined;
  prefix?: string;
  children: ReactElement<React.HTMLAttributes<HTMLElement> & { name?: string }>;
}) {
  const described = [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ');
  const control = cloneElement(children, {
    id,
    name,
    'aria-invalid': !!error,
    'aria-describedby': described || undefined,
    className: `${CONTROL} ${children.props.className ?? ''}`,
  });
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="text-sm text-slate">
        {label}
      </label>
      <div
        className={`relative mt-1 flex items-center gap-3 border-b transition-colors duration-300 focus-within:border-accent ${
          error ? 'border-neg' : 'border-rule-strong'
        }`}
      >
        {prefix ? <span className="t-num text-[1.05rem] text-slate">{prefix}</span> : null}
        {control}
      </div>
      {hint && !error ? (
        <p id={`${id}-hint`} className="mt-2 text-xs text-slate">
          {hint}
        </p>
      ) : null}
      {error ? <ErrorText id={`${id}-error`}>{error}</ErrorText> : null}
    </div>
  );
}

/**
 * A PIN code as six boxes: each digit moves on to the next box, Backspace goes back, a pasted or
 * autofilled code spreads across them. The first box carries the field's id and name.
 */
export function PinBoxes({
  id,
  value,
  onChange,
  invalid,
  describedBy,
}: {
  id: string;
  value: string;
  onChange: (pin: string) => void;
  invalid?: boolean;
  describedBy?: string | undefined;
}) {
  const boxes = useRef<(HTMLInputElement | null)[]>([]);
  const focus = (i: number) => boxes.current[Math.max(0, Math.min(5, i))]?.focus();

  const put = (at: number, typed: string) => {
    const digits = typed.replace(/\D/g, '');
    if (!digits) return;
    // over the digits from `at`, keeping the ones after them
    const next = (value.slice(0, at) + digits + value.slice(at + digits.length)).slice(0, 6);
    onChange(next);
    focus(at + digits.length);
  };

  return (
    <div className="flex gap-2 sm:gap-2.5" role="group" aria-label="PIN code, 6 digits">
      {Array.from({ length: 6 }, (_, i) => (
        <input
          key={i}
          ref={(el) => {
            boxes.current[i] = el;
          }}
          {...(i === 0 ? { id, name: 'pin', autoComplete: 'postal-code' } : { autoComplete: 'off' })}
          value={value[i] ?? ''}
          inputMode="numeric"
          aria-label={`Digit ${i + 1} of 6`}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          // a box takes its digit (and a paste or autofill spreads from it)
          onChange={(e) => put(Math.min(i, value.length), e.target.value.replace(value[i] ?? '', ''))}
          onPaste={(e) => {
            e.preventDefault();
            put(0, e.clipboardData.getData('text'));
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace') {
              e.preventDefault();
              const cut = value[i] ? i : i - 1;
              if (cut < 0) return;
              onChange(value.slice(0, cut) + value.slice(cut + 1));
              focus(cut);
            } else if (e.key === 'ArrowLeft') focus(i - 1);
            else if (e.key === 'ArrowRight') focus(i + 1);
          }}
          onFocus={(e) => {
            // never a gap: a box past the typed digits sends the cursor to the first empty one
            if (i > value.length) focus(value.length);
            else e.target.select();
          }}
          className={`t-num aspect-[4/5] w-full min-w-0 rounded-2xl border bg-surface text-center font-display text-[clamp(1.4rem,4vw,1.9rem)] font-medium text-ink outline-none transition-[border-color,box-shadow] duration-300 focus:border-accent focus:shadow-[0_0_0_4px_var(--color-accent-wash)] ${
            invalid ? 'border-neg' : value[i] ? 'border-ink/40' : 'border-rule-strong'
          }`}
        />
      ))}
    </div>
  );
}

export function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-2 text-sm text-neg">
      {children}
    </p>
  );
}

/** A native select (the phone's own picker on mobile), with a chevron. */
function Picker({
  value,
  onChange,
  options,
  placeholder,
  disabled,
  className = '',
  ...rest
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <>
      <select
        {...rest}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`${className} cursor-pointer appearance-none pr-8 disabled:cursor-not-allowed ${value ? '' : 'text-muted'}`}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <svg viewBox="0 0 16 16" aria-hidden className="pointer-events-none absolute right-1 size-4 text-slate">
        <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </>
  );
}

/** State, then its districts. Changing the state clears a district that is not in it. */
export function PlacePickers({
  uid,
  state,
  district,
  onChange,
  errors,
}: {
  uid: string;
  state: string;
  district: string;
  onChange: (place: { state: string; district: string }) => void;
  errors: FieldErrors;
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Field id={`${uid}-state`} name="state" label="State" error={errors.state}>
        <Picker
          value={state}
          onChange={(s) =>
            onChange({ state: s, district: districtsOf(s).includes(district) ? district : '' })
          }
          options={STATES}
          placeholder="Choose your state"
        />
      </Field>
      <Field id={`${uid}-district`} name="district" label="District" error={errors.district}>
        <Picker
          value={district}
          onChange={(d) => onChange({ state, district: d })}
          options={districtsOf(state)}
          placeholder={state ? 'Choose your district' : 'Choose the state first'}
          disabled={!state}
        />
      </Field>
    </div>
  );
}

export function Consent({
  id,
  checked,
  onChange,
  error,
  children,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string | undefined;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3 text-sm text-slate">
        <input
          type="checkbox"
          name="consent"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-0.5 size-5 shrink-0 accent-accent"
        />
        <span>{children}</span>
      </label>
      {error ? <ErrorText id={`${id}-error`}>{error}</ErrorText> : null}
    </div>
  );
}

/** People never see it; bots fill it, and their form is dropped. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
      <label>
        Website <input name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}

export const honeypotOf = (form: HTMLFormElement | null) =>
  (form?.elements.namedItem('website') as HTMLInputElement | null)?.value ?? '';

export type Sent = { ok: true } | { ok: false; message: string; fields?: FieldErrors };

const FALLBACK = `We could not send this just now. Please call or WhatsApp us on ${SITE.phone}.`;

/** Posts a form to /api/enquiry and says what came of it. */
export async function send(e: Enquiry): Promise<Sent> {
  const res = await fetch('/api/enquiry', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(e),
  }).catch(() => null);
  if (res?.ok) return { ok: true };
  const body = (await res?.json().catch(() => null)) as { message?: string; fields?: FieldErrors } | null;
  return { ok: false, message: body?.message ?? FALLBACK, ...(body?.fields ? { fields: body.fields } : {}) };
}

/** When the form could not be passed on: say so, and give the phone. */
export function NotSent({ message }: { message: string }) {
  return (
    <div role="alert" className="rounded-2xl border border-rule-strong bg-sunk p-5 text-sm text-balance">
      <p>{message}</p>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 font-medium">
        <a href={SITE.phoneHref} className="text-accent underline-offset-4 hover:underline">
          Call {SITE.phone}
        </a>
        <a
          href={SITE.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline-offset-4 hover:underline"
        >
          WhatsApp us
        </a>
      </div>
    </div>
  );
}
