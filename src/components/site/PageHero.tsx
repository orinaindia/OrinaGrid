/** The top of an inner page: where you are, the page's one line, and what it covers. */
import Image, { type StaticImageData } from 'next/image';
import type { ReactNode } from 'react';
import { Spark } from '@/components/ui/Spark';

export function PageHero({
  eyebrow,
  title,
  lead,
  image,
  children,
}: {
  eyebrow: string;
  title: string;
  lead: ReactNode;
  /** A wide photograph under the words: [src, alt]. */
  image?: [StaticImageData, string];
  /** Something beside the lead on wide screens (buttons, a figure). */
  children?: ReactNode;
}) {
  return (
    <section className="pb-[clamp(3rem,7vw,6rem)] pt-[calc(var(--header-h)+clamp(2.5rem,7vw,6rem))]">
      <div className="wrap">
        <p className="t-eyebrow flex items-center gap-2" data-reveal>
          <Spark className="size-3 text-sun" />
          {eyebrow}
        </p>
        <h1 data-split className="t-display mt-6 max-w-[18ch]">
          {title}
        </h1>
        <div className="mt-8 flex flex-col gap-8 md:mt-10 md:flex-row md:items-end md:justify-between">
          <div className="t-lead max-w-xl" data-reveal>
            {lead}
          </div>
          {children ? <div data-reveal>{children}</div> : null}
        </div>
      </div>
      {image ? (
        <div className="px-2 sm:px-3">
          <div
            className="relative mt-[clamp(2.5rem,6vw,5rem)] aspect-[16/10] overflow-hidden rounded-[1.75rem] sm:aspect-[21/9]"
            data-reveal
          >
            <div data-parallax="14" className="absolute -inset-y-[8%] inset-x-0">
              <Image
                src={image[0]}
                alt={image[1]}
                fill
                preload
                placeholder="blur"
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
