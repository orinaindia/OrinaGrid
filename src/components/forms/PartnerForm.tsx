'use client';

/** A solar business applying to be the Orina Grid partner for its district. */
import { useId, useRef, useState } from 'react';
import { Arrow, buttonClass } from '@/components/ui/ButtonLink';
import { check, type FieldErrors, type PartnerEnquiry } from '@/lib/enquiry';
import {
  Consent,
  Field,
  Honeypot,
  honeypotOf,
  mobileDigits,
  NotSent,
  PlacePickers,
  send,
  spaced,
} from './fields';

export function PartnerForm() {
  const uid = useId();
  const form = useRef<HTMLFormElement>(null);
  const [v, setV] = useState({ name: '', phone: '', business: '', state: '', district: '', message: '' });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);

  const set = (k: keyof typeof v) => (value: string) => {
    setV((o) => ({ ...o, [k]: value }));
    setErrors((o) => (o[k as keyof FieldErrors] ? { ...o, [k]: undefined } : o));
  };

  const show = (found: FieldErrors) => {
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  };

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (sending) return;
    const e: PartnerEnquiry = { kind: 'partner', ...v, consent, website: honeypotOf(form.current) };
    const found = check(e);
    if (Object.keys(found).length) return show(found);
    setSending(true);
    setFailed(null);
    const res = await send(e);
    setSending(false);
    if (res.ok) return setSent(true);
    if (res.fields && Object.keys(res.fields).length) return show(res.fields);
    setFailed(res.message);
  }

  if (sent)
    return (
      <div role="status" className="py-4">
        <p className="t-h3">Thank you{v.name ? `, ${v.name.trim().split(/\s+/)[0]}` : ''}.</p>
        <p className="mt-3 max-w-md text-slate">
          We will call you within a few working days to talk about {v.district || 'your district'}.
        </p>
      </div>
    );

  return (
    <form ref={form} onSubmit={submit} noValidate className="grid gap-6" aria-busy={sending}>
      <Honeypot />
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id={`${uid}-name`} name="name" label="Your name" error={errors.name}>
          <input
            value={v.name}
            onChange={(e) => set('name')(e.target.value)}
            autoComplete="name"
            maxLength={100}
          />
        </Field>
        <Field id={`${uid}-phone`} name="phone" label="Mobile (WhatsApp)" error={errors.phone} prefix="+91">
          <input
            value={spaced(v.phone)}
            onChange={(e) => set('phone')(mobileDigits(e.target.value))}
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="98250 12345"
          />
        </Field>
      </div>
      <Field id={`${uid}-business`} name="business" label="Business name" error={errors.business}>
        <input
          value={v.business}
          onChange={(e) => set('business')(e.target.value)}
          autoComplete="organization"
          maxLength={200}
        />
      </Field>
      <PlacePickers
        uid={uid}
        state={v.state}
        district={v.district}
        errors={errors}
        onChange={(p) => {
          setV((o) => ({ ...o, ...p }));
          setErrors((o) => ({ ...o, state: undefined, district: undefined }));
        }}
      />
      <Field
        id={`${uid}-message`}
        name="message"
        label="About your work"
        hint="Optional: years installing, team size, systems done, the areas you cover."
      >
        <textarea
          value={v.message}
          onChange={(e) => set('message')(e.target.value)}
          rows={3}
          maxLength={1000}
          className="resize-y"
        />
      </Field>
      <Consent
        id={`${uid}-consent`}
        checked={consent}
        onChange={(c) => {
          setConsent(c);
          setErrors((o) => ({ ...o, consent: undefined }));
        }}
        error={errors.consent}
      >
        Orina Grid may call or WhatsApp me about becoming a partner.
      </Consent>
      {failed ? <NotSent message={failed} /> : null}
      <button
        type="submit"
        disabled={sending}
        className={`${buttonClass()} w-full disabled:opacity-60 sm:w-auto sm:justify-self-start`}
      >
        <span>{sending ? 'Sending…' : 'Apply for my district'}</span>
        {sending ? null : <Arrow />}
      </button>
    </form>
  );
}
