// Ubin uji glasir: lempeng tanah berlubang gantung, dicelup glasir sampai garis leleh.
import { useId } from 'react';
import { cariGlasir } from '@/lib/data';

// Garis leleh dari kiri ke kanan (kurva kubik), berbeda untuk tiap glasir.
const LELEH = {
  seladon: [3, 33, [[6, 35, 8, 34, 10, 35], [12, 36, 13, 41, 15, 40], [17, 39, 16, 35, 19, 35], [22, 35, 24, 37, 27, 36], [30, 35, 32, 37, 37, 34]]],
  kobalt: [3, 35, [[6, 33, 9, 36, 12, 35], [15, 34, 17, 35, 20, 35], [23, 35, 24, 42, 26, 41], [28, 40, 27, 36, 30, 35], [33, 34, 35, 36, 37, 35]]],
  tenmoku: [3, 34, [[5, 36, 7, 39, 9, 38], [11, 37, 11, 34, 14, 34], [17, 34, 20, 36, 23, 35], [26, 34, 28, 36, 31, 35], [33, 34, 35, 35, 37, 33]]],
  abu: [3, 34, [[6, 35, 9, 33, 12, 34], [15, 35, 17, 34, 20, 35], [23, 36, 26, 34, 29, 35], [31, 36, 32, 40, 34, 39], [36, 38, 36, 35, 37, 34]]],
};

// Jalur glasir: bagian atas ubin, lalu menyusuri garis leleh dari kanan ke kiri.
function jalurGlasir([x0, y0, kurva]) {
  const titik = [[x0, y0], ...kurva.map((c) => [c[4], c[5]])];
  const akhir = titik[titik.length - 1];
  const balik = [];
  for (let j = kurva.length - 1; j >= 0; j--) {
    const c = kurva[j];
    const dari = titik[j];
    balik.push(`C${c[2]} ${c[3]} ${c[0]} ${c[1]} ${dari[0]} ${dari[1]}`);
  }
  return `M3 6 Q3 2 7 2 H33 Q37 2 37 6 L${akhir[0]} ${akhir[1]} ${balik.join(' ')} Z`;
}

const BENTUK_UBIN = 'M3 6 Q3 2 7 2 H33 Q37 2 37 6 V52 Q37 54 35 54 H5 Q3 54 3 52 Z';

export default function UbinUji({ glasir: glasirId, className = '', judul }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const g = cariGlasir(glasirId);
  if (!g) return null;
  return (
    <svg
      viewBox="0 0 40 56"
      className={className}
      role={judul ? 'img' : undefined}
      aria-label={judul || undefined}
      aria-hidden={judul ? undefined : true}
      focusable="false"
    >
      <defs>
        <mask id={`${uid}m`}>
          <rect width="40" height="56" fill="#fff" />
          <circle cx="20" cy="9.5" r="3.1" fill="#000" />
        </mask>
        <linearGradient id={`${uid}g`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={g.tepi} />
          <stop offset="0.28" stopColor={g.warna} />
          <stop offset="0.78" stopColor={g.warna} />
          <stop offset="1" stopColor={g.gelap} />
        </linearGradient>
        <linearGradient id={`${uid}t`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#c9a37f" />
          <stop offset="0.5" stopColor="#d8b896" />
          <stop offset="1" stopColor="#b8906b" />
        </linearGradient>
      </defs>
      <g mask={`url(#${uid}m)`}>
        <path d={BENTUK_UBIN} fill={`url(#${uid}t)`} />
        <circle cx="9" cy="47" r="0.7" fill="#6b4a32" opacity="0.6" />
        <circle cx="27" cy="45" r="0.6" fill="#6b4a32" opacity="0.6" />
        <circle cx="31" cy="50" r="0.8" fill="#6b4a32" opacity="0.5" />
        <path d={jalurGlasir(LELEH[g.id] || LELEH.seladon)} fill={`url(#${uid}g)`} />
        {g.id === 'abu' && (
          <g fill="#7b5b40" opacity="0.55">
            <circle cx="11" cy="16" r="0.7" />
            <circle cx="25" cy="13" r="0.6" />
            <circle cx="30" cy="24" r="0.8" />
            <circle cx="15" cy="27" r="0.6" />
            <circle cx="21" cy="21" r="0.5" />
          </g>
        )}
        <path d="M5.5 7 V30" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1.2" strokeLinecap="round" />
      </g>
      <path d={BENTUK_UBIN} fill="none" stroke="#231c17" strokeOpacity="0.22" strokeWidth="0.8" />
    </svg>
  );
}
