/**
 * Orina Grid, drawn in HTML: one screen for each thing the partners page talks about. They show
 * the app's real shapes and words (stages, roles, the GST split) with made-up people.
 */
import type { ReactNode } from 'react';

function Screen({ title, action, children }: { title: string; action?: string; children: ReactNode }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-rule bg-surface text-ink shadow-[0_30px_80px_-40px_rgba(11,11,13,0.45)]">
      <div className="flex items-center justify-between gap-4 border-b border-rule px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-ink text-[0.6rem] font-bold text-on-ink">
            OG
          </span>
          <p className="truncate font-display text-[1.05rem] font-medium">{title}</p>
        </div>
        {action ? (
          <span className="shrink-0 rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-on-ink">
            {action}
          </span>
        ) : null}
      </div>
      <div className="min-h-0 flex-1 p-5 text-sm">{children}</div>
    </div>
  );
}

const Chip = ({ children, tone = 'bg-sunk text-slate' }: { children: ReactNode; tone?: string }) => (
  <span
    className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[0.7rem] font-medium ${tone}`}
  >
    {children}
  </span>
);

export function TodayScreen() {
  const rows = [
    ['Call back', 'Ramesh Patil · Nashik', '11:00'],
    ['Site survey', 'Sneha Kulkarni · Sinnar', '15:30'],
    ['Quote follow-up', 'Mahesh Jadhav · Igatpuri', '17:00'],
  ];
  return (
    <Screen title="Today">
      <div className="grid grid-cols-3 gap-2">
        {[
          ['4', 'New leads'],
          ['3', 'Due today'],
          ['2', 'Quotes out'],
        ].map(([n, l]) => (
          <div key={l} className="rounded-xl bg-sunk p-3">
            <p className="t-num font-display text-2xl">{n}</p>
            <p className="mt-1 text-xs text-slate">{l}</p>
          </div>
        ))}
      </div>
      <p className="mt-5 font-mono text-[0.65rem] uppercase tracking-wider text-slate">Your day</p>
      <ul className="mt-2 divide-y divide-rule">
        {rows.map(([what, who, at]) => (
          <li key={who} className="flex items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="font-medium">{what}</p>
              <p className="truncate text-xs text-slate">{who}</p>
            </div>
            <span className="t-num shrink-0 font-mono text-xs">{at}</span>
          </li>
        ))}
      </ul>
    </Screen>
  );
}

export function LeadsScreen() {
  const stages = [
    ['New', 4],
    ['Contacted', 6],
    ['Survey', 3],
    ['Quote sent', 5],
    ['Negotiation', 2],
  ] as const;
  return (
    <Screen title="Leads" action="+ New lead">
      <div className="flex gap-1.5 overflow-hidden [mask-image:linear-gradient(to_right,#000_80%,transparent)]">
        {stages.map(([s, n], i) => (
          <Chip key={s} tone={i === 2 ? 'bg-ink text-on-ink' : 'bg-sunk text-slate'}>
            {s} <span className="t-num ml-1 opacity-60">{n}</span>
          </Chip>
        ))}
      </div>
      <div className="mt-4 rounded-xl border border-rule p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-medium">Sneha Kulkarni</p>
            <p className="truncate text-xs text-slate">Sinnar 422103 · Home · 5 kW</p>
          </div>
          <Chip tone="bg-accent-wash text-accent">Survey</Chip>
        </div>
        <ul className="mt-4 space-y-3 border-l border-rule pl-4 text-xs">
          <li>
            <span className="text-slate">Visit · today</span>
            <p className="mt-0.5">Roof checked: 48 m² shade-free, RCC</p>
          </li>
          <li>
            <span className="text-slate">WhatsApp · yesterday</span>
            <p className="mt-0.5">Sent the survey time</p>
          </li>
          <li>
            <span className="text-slate">Call · 2 days ago</span>
            <p className="mt-0.5">Bill about ₹4,000 a month</p>
          </li>
        </ul>
      </div>
    </Screen>
  );
}

export function IncomingScreen() {
  return (
    <Screen title="From Orina">
      <ul className="space-y-3">
        {[
          ['Orina campaign “Diwali rooftop”', 'Kiran Pawar · PIN 422001', 'Given to Amit Deshmukh'],
          ['Referred by Sunil Gaikwad', 'Nita Shinde · PIN 422403', 'Given to Riya Joshi'],
        ].map(([from, who, given]) => (
          <li key={who} className="rounded-xl border border-rule p-4">
            <Chip tone="bg-sun/15 text-sun-deep">{from}</Chip>
            <p className="mt-3 font-medium">{who}</p>
            <p className="mt-1 text-xs text-slate">{given}: the salesperson with the fewest open leads</p>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-slate">
        Every lead for a PIN in your district comes to you, and only you.
      </p>
    </Screen>
  );
}

export function QuoteScreen() {
  const lines = [
    ['Solar system material', '5%', '1,01,982'],
    ['Installation and start-up', '18%', '49,118'],
  ];
  return (
    <Screen title="QT-0041 · 3 kW" action="PDF">
      <ul className="divide-y divide-rule border-y border-rule">
        {lines.map(([t, g, a]) => (
          <li key={t} className="flex items-center justify-between gap-3 py-3">
            <span className="min-w-0 truncate">{t}</span>
            <span className="flex shrink-0 items-center gap-4">
              <span className="text-xs text-slate">GST {g}</span>
              <span className="t-num font-medium">₹{a}</span>
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex justify-between">
        <span className="text-slate">Total</span>
        <span className="t-num font-medium">₹1,51,100</span>
      </div>
      <div className="mt-2 flex justify-between text-pos">
        <span>PM Surya Ghar subsidy</span>
        <span className="t-num">− ₹78,000</span>
      </div>
      <div className="mt-4 rounded-xl bg-accent-wash p-4">
        <div className="flex items-baseline justify-between">
          <span className="font-medium">Customer pays</span>
          <span className="t-num font-display text-xl text-accent">₹73,100</span>
        </div>
      </div>
      <p className="mt-4 flex items-center gap-2 text-xs text-slate">
        <span className="size-1.5 rounded-full bg-sun" />
        6% discount is above Riya’s limit: sent to the owner for approval
      </p>
    </Screen>
  );
}

export function TeamScreen() {
  const people = [
    ['Amit Deshmukh', 'Owner', 'Everything, and approvals'],
    ['Riya Joshi', 'Sales', 'Leads and quotations'],
    ['Suresh Bhosale', 'Site', 'Surveys and installations'],
    ['Pooja More', 'Accounts', 'Prices and payments'],
  ];
  return (
    <Screen title="Team" action="Invite">
      <ul className="divide-y divide-rule">
        {people.map(([n, r, d]) => (
          <li key={n} className="flex items-center gap-3 py-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sunk text-xs font-medium">
              {n
                .split(' ')
                .map((w) => w[0])
                .join('')}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{n}</p>
              <p className="truncate text-xs text-slate">{d}</p>
            </div>
            <Chip tone={r === 'Owner' ? 'bg-ink text-on-ink' : 'bg-sunk text-slate'}>{r}</Chip>
          </li>
        ))}
      </ul>
    </Screen>
  );
}
