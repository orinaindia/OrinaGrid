'use client';

/**
 * Choose a state and district, and send the survey request to that district's partner. Grid
 * routes the request by its PIN code; a district with no partner yet is answered by the Orina
 * Grid team itself.
 */
import { useId, useState } from 'react';
import { SpotCall } from '@/components/art/Spots';
import { PlacePickers } from '@/components/forms/fields';
import { SurveyWizard } from '@/components/forms/SurveyWizard';
import { Spark } from '@/components/ui/Spark';

export function PartnerFinder() {
  const uid = useId();
  const [place, setPlace] = useState({ state: '', district: '' });
  const chosen = place.state && place.district;

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
      <div className="rounded-3xl border border-rule bg-surface p-6 sm:p-10">
        <p className="t-h3">Where is the roof?</p>
        <div className="mt-6">
          <PlacePickers
            uid={uid}
            state={place.state}
            district={place.district}
            onChange={setPlace}
            errors={{}}
          />
        </div>

        <div aria-live="polite" className="mt-10">
          {chosen ? (
            <div className="rounded-2xl bg-accent-wash p-6">
              <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-accent">
                <Spark className="size-3" />
                Your district
              </p>
              <p className="t-h3 mt-3">
                {place.district}, {place.state}
              </p>
              <p className="mt-3 text-slate">
                Your request goes straight to the Orina Grid partner who serves {place.district}. They call
                you, usually within a working day. If {place.district} has no partner yet, the Orina Grid team
                calls you itself.
              </p>
            </div>
          ) : (
            <p className="text-slate">
              Every district has, or will have, one Orina Grid partner: a local solar business that surveys,
              quotes, installs and services, and files the net meter and subsidy for you.
            </p>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-rule bg-surface p-6 sm:p-10">
        {chosen ? (
          <SurveyWizard key={`${place.state}|${place.district}`} place={place} />
        ) : (
          <div className="flex h-full min-h-72 flex-col items-start justify-center">
            <SpotCall className="mb-8 h-36 w-auto" />
            <p className="t-h3">Then book the free survey here.</p>
            <p className="mt-3 max-w-sm text-slate">
              Choose your state and district first: the form opens with them filled in.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
