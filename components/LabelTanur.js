// Label gantung ala label angkatan tanur: kertas berlubang dengan tali.
export default function LabelTanur({ baris = [], className = '', miring = -4 }) {
  return (
    <div className={`relative ${className}`} style={{ transform: `rotate(${miring}deg)` }}>
      <svg viewBox="0 0 60 40" className="absolute -top-9 left-1/2 h-10 w-16 -translate-x-1/2" aria-hidden="true" focusable="false">
        <path d="M30 40 C 28 26, 20 14, 8 2" fill="none" stroke="#6a5c50" strokeWidth="1.3" />
      </svg>
      <div className="relative bg-kertas px-4 pb-3 pt-6 shadow-[0_1px_0_rgba(35,28,23,0.12),0_10px_24px_-14px_rgba(35,28,23,0.45)] [clip-path:polygon(14%_0,86%_0,100%_14%,100%_100%,0_100%,0_14%)]">
        <span className="absolute left-1/2 top-2 h-2.5 w-2.5 -translate-x-1/2 rounded-full border border-garis-tua bg-bisque" aria-hidden="true" />
        {baris.map((b, i) => (
          <p key={i} className={i === 0 ? 'label-tanur text-[0.68rem] text-liat-tua' : 'label-tanur mt-1 text-[0.66rem] text-tinta'}>
            {b}
          </p>
        ))}
      </div>
    </div>
  );
}
