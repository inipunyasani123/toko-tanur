// Cap pembuat: lengkung tanur dengan nyala di dalam lingkaran cap.
export default function Stempel({ className = '', judul }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      role={judul ? 'img' : undefined}
      aria-label={judul || undefined}
      aria-hidden={judul ? undefined : true}
      focusable="false"
    >
      <circle cx="20" cy="20" r="18.2" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="20" cy="20" r="14.6" fill="none" stroke="currentColor" strokeWidth="0.9" strokeDasharray="1.1 2.1" />
      <path d="M12 27.5 V20.5 A8 8 0 0 1 28 20.5 V27.5" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" />
      <path d="M9.5 27.6 H30.5" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
      <path d="M20 25.6 c-3.1-1.5-3-4.4-0.2-7.6 c0.6 1.8 1.8 2.3 2.4 3.8 c0.7 1.8-0.4 3.3-2.2 3.8z" fill="currentColor" />
    </svg>
  );
}
