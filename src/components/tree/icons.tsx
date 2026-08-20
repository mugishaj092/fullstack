interface IconProps {
  className?: string;
}

export function ChevronIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FolderIcon({ open, className }: IconProps & { open: boolean }) {
  if (open) {
    return (
      <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
        <path
          d="M1.5 4.5A1 1 0 0 1 2.5 3.5h3.13a1 1 0 0 1 .8.4l.72.96a1 1 0 0 0 .8.4H13.5a1 1 0 0 1 1 1v.24H4.02a1 1 0 0 0-.96.73L1.5 11.9V4.5Z"
          fill="currentColor"
        />
        <path
          d="m2.06 12.6 1.6-5.6a1 1 0 0 1 .96-.72H14.5a.75.75 0 0 1 .72.95l-1.5 5.6a1 1 0 0 1-.97.75H2.78a.75.75 0 0 1-.72-.98Z"
          fill="currentColor"
          opacity="0.6"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path
        d="M1.5 3.5A1 1 0 0 1 2.5 2.5h3.13a1 1 0 0 1 .8.4l.72.96a1 1 0 0 0 .8.4H13.5a1 1 0 0 1 1 1v7.24a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1V3.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function FileIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path
        d="M3.5 1.5h5.13a1 1 0 0 1 .7.29l2.87 2.87a1 1 0 0 1 .3.71V13.5a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M9 1.6V4.5a1 1 0 0 0 1 1h2.9" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}
