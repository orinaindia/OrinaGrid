import { ButtonLink } from '@/components/ui/ButtonLink';
import { Spark } from '@/components/ui/Spark';

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-center pt-[var(--header-h)]">
      <div className="wrap">
        <p className="t-eyebrow flex items-center gap-2">
          <Spark className="size-3 text-sun" />
          Page not found
        </p>
        <h1 className="t-display mt-6 max-w-[16ch]">This page is in the shade.</h1>
        <p className="t-lead mt-6 max-w-md">The link may be old, or the address mistyped.</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/">Go home</ButtonLink>
          <ButtonLink href="/contact" tone="ghost">
            Book a survey
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
