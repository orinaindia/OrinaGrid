/** The four-pointed spark from Orina's mark: the site's sun glint. */
export function Spark({ className = '', title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path
        fill="currentColor"
        d="M12 0c.6 5.9 3.5 9.4 12 12-8.5 2.6-11.4 6.1-12 12-.6-5.9-3.5-9.4-12-12C8.5 9.4 11.4 5.9 12 0Z"
      />
    </svg>
  );
}
