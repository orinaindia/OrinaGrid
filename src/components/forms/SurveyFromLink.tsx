'use client';

/** The survey form with the bill a link brought (?bill=2500, from the calculator) already chosen. */
import { useSearchParams } from 'next/navigation';
import { SurveyWizard } from './SurveyWizard';

export function SurveyFromLink() {
  const raw = Number(useSearchParams().get('bill'));
  const bill = Number.isFinite(raw) && raw >= 100 && raw <= 1_000_000 ? Math.round(raw) : undefined;
  return <SurveyWizard key={bill ?? 0} {...(bill ? { bill } : {})} />;
}
