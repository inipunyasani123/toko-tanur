// Diagram urai kemasan: lapisan dari keping sampai peti kayu, tampak isometrik.
import Ware from './Ware';

const C = Math.cos(Math.PI / 6);
const S = Math.sin(Math.PI / 6);
const OX = 230;
const OY = 470;

function iso(x, y, z) {
  return [OX + (x - y) * C, OY + (x + y) * S - z];
}

function titik(x, y, z) {
  const [a, b] = iso(x, y, z);
  return `${a.toFixed(1)},${b.toFixed(1)}`;
}

function Lempeng({ w, h, z, atas, kiri, kanan, garis = '#6f5440', putus = false, pola }) {
  const d = w;
  const muka = [
    [titik(-w / 2, -d / 2, z + h), titik(w / 2, -d / 2, z + h), titik(w / 2, d / 2, z + h), titik(-w / 2, d / 2, z + h)],
    [titik(-w / 2, d / 2, z + h), titik(w / 2, d / 2, z + h), titik(w / 2, d / 2, z), titik(-w / 2, d / 2, z)],
    [titik(w / 2, -d / 2, z + h), titik(w / 2, d / 2, z + h), titik(w / 2, d / 2, z), titik(w / 2, -d / 2, z)],
  ];
  const isi = [atas, kiri, kanan];
  return (
    <g strokeLinejoin="round">
      {muka.map((m, i) => (
        <polygon
          key={i}
          points={m.join(' ')}
          fill={putus ? 'none' : isi[i]}
          stroke={garis}
          strokeWidth="1.2"
          strokeDasharray={putus ? '5 4' : undefined}
        />
      ))}
      {pola && <polygon points={muka[0].join(' ')} fill={`url(#${pola})`} stroke="none" />}
    </g>
  );
}

const LAPISAN = [
  { huruf: 'G', teks: 'Peti kayu, bila dipilih', w: 236, h: 30, z: 0, atas: '#c99a68', kiri: '#b3844f', kanan: '#9c7041', pola: 'pola-kayu' },
  { huruf: 'F', teks: 'Kardus luar lima lapis', w: 222, h: 34, z: 66, atas: '#c9a274', kiri: '#b58b5d', kanan: '#a07750' },
  { huruf: 'E', teks: 'Ruang peredam ±3 cm di keenam sisi', w: 206, h: 12, z: 132, putus: true },
  { huruf: 'D', teks: 'Kardus dalam', w: 184, h: 28, z: 170, atas: '#dcbd94', kiri: '#c9a77c', kanan: '#b6936a' },
  { huruf: 'C', teks: 'Sekat karton, satu ruang per keping', w: 176, h: 6, z: 228, atas: '#e5cfaa', kiri: '#cdb38b', kanan: '#bb9f78', pola: 'pola-sekat' },
  { huruf: 'B', teks: 'Kertas sarang lebah, dua lapis', w: 176, h: 6, z: 262, atas: '#efe3c9', kiri: '#d8c6a3', kanan: '#c6b28d', pola: 'pola-sarang' },
];

export default function KotakBerlapis() {
  return (
    <div className="grid items-center gap-6 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <svg viewBox="0 0 460 620" className="mx-auto h-auto w-full max-w-[30rem]" aria-hidden="true" focusable="false">
        <defs>
          <pattern id="pola-sarang" width="14" height="12" patternUnits="userSpaceOnUse" patternTransform="matrix(0.866 0.5 -0.866 0.5 0 0)">
            <path d="M3.5 0 L10.5 0 L14 6 L10.5 12 L3.5 12 L0 6 Z" fill="none" stroke="#a88b5f" strokeWidth="0.9" />
          </pattern>
          <pattern id="pola-sekat" width="34" height="34" patternUnits="userSpaceOnUse" patternTransform="matrix(0.866 0.5 -0.866 0.5 0 0)">
            <path d="M0 0 H34 M0 0 V34" stroke="#9c8058" strokeWidth="1.6" />
          </pattern>
          <pattern id="pola-kayu" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="matrix(0.866 0.5 -0.866 0.5 0 0)">
            <rect width="26" height="26" fill="none" />
            <path d="M0 0 H26" stroke="#7e5a35" strokeWidth="5" />
          </pattern>
        </defs>
        {LAPISAN.map((l) => {
          const [lx, ly] = iso(-l.w / 2, l.w / 2, l.z + l.h / 2);
          return (
            <g key={l.huruf}>
              <Lempeng {...l} />
              <line x1={lx - 4} y1={ly} x2={30} y2={ly} stroke="#8a6a4f" strokeWidth="1" />
              <circle cx="18" cy={ly} r="15" fill="#231c17" />
              <text x="18" y={ly + 5.5} textAnchor="middle" fontSize="16" fontWeight="700" fill="#fbf8f2" fontFamily="var(--font-mono)">
                {l.huruf}
              </text>
            </g>
          );
        })}
        <g>
          <line x1="40" y1="120" x2="160" y2="120" stroke="#8a6a4f" strokeWidth="1" />
          <circle cx="18" cy="120" r="15" fill="#231c17" />
          <text x="18" y="125.5" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fbf8f2" fontFamily="var(--font-mono)">
            A
          </text>
        </g>
        <Ware bentuk="mangkuk" glasir="seladon" ukuranId="besar" iUkuran={1} nUkuran={2} x={135} y={20} width={190} height={190} />
        <path d="M230 186 V214" stroke="#8a6a4f" strokeWidth="1" strokeDasharray="3 4" />
      </svg>
      <ol className="grid gap-3 text-[0.95rem]">
        {[{ huruf: 'A', teks: 'Keping keramik, sudah diperiksa retak dan goyang' }, ...[...LAPISAN].reverse()].map((l) => (
          <li key={l.huruf} className="flex items-baseline gap-3 border-b border-garis pb-2.5 last:border-0">
            <span className="label-tanur inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-tinta text-[0.75rem] text-kertas" aria-hidden="true">
              {l.huruf}
            </span>
            <span>{l.teks}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
