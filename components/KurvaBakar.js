'use client';

import { useEffect, useRef, useState } from 'react';
import { kurvaBakar } from '@/lib/data';

const M = { kiri: 50, kanan: 18, atas: 26, bawah: 42 };
const X_MAX = 30;
const Y_MAX = 1300;
const angka = new Intl.NumberFormat('id-ID');

function labelJam(j) {
  const jam = Math.floor(j);
  const menit = Math.round((j - jam) * 60);
  return menit ? `jam ke-${jam} lewat ${menit} menit` : `jam ke-${jam}`;
}

// Kurva bakar glasir satu angkatan: suhu (°C) terhadap waktu (jam).
export default function KurvaBakar() {
  const [aktif, setAktif] = useState(null);
  const [W, setW] = useState(640);
  const wadahRef = useRef(null);

  // Gambar mengikuti lebar wadah supaya huruf sumbu tetap 12 px di ponsel.
  useEffect(() => {
    const el = wadahRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(280, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const H = Math.round(Math.min(340, Math.max(230, W * 0.52)));
  const sx = (jam) => M.kiri + (jam / X_MAX) * (W - M.kiri - M.kanan);
  const sy = (suhu) => H - M.bawah - (suhu / Y_MAX) * (H - M.atas - M.bawah);
  const tickX = W < 440 ? [0, 10, 20, 30] : [0, 6, 12, 18, 24, 30];
  const titik = kurvaBakar.map((t) => ({ ...t, x: sx(t.jam), y: sy(t.suhu) }));
  const garis = titik.map((t, i) => `${i ? 'L' : 'M'}${t.x.toFixed(1)} ${t.y.toFixed(1)}`).join(' ');
  const area = `${garis} L${sx(X_MAX).toFixed(1)} ${sy(0)} L${sx(0)} ${sy(0)} Z`;
  const puncak = titik.reduce((a, b) => (b.suhu > a.suhu ? b : a));
  const akhir = titik[titik.length - 1];
  const t = aktif === null ? null : titik[aktif];

  const dariPointer = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * W;
    let terdekat = 0;
    titik.forEach((p, i) => {
      if (Math.abs(p.x - x) < Math.abs(titik[terdekat].x - x)) terdekat = i;
    });
    setAktif(terdekat);
  };

  const tombol = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      setAktif((a) => (a === null ? 0 : Math.min(titik.length - 1, a + 1)));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      setAktif((a) => (a === null ? 0 : Math.max(0, a - 1)));
    } else if (e.key === 'Escape') {
      setAktif(null);
    }
  };

  return (
    <figure className="m-0">
      <div className="relative" ref={wadahRef}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width={W}
          height={H}
          className="block h-auto w-full touch-pan-y"
          role="img"
          aria-label={`Kurva bakar: suhu naik dari ${angka.format(titik[0].suhu)} °C ke puncak ${angka.format(puncak.suhu)}&nbsp;°C pada jam ke-13, ditahan 15 menit, lalu turun pelan sampai ${angka.format(akhir.suhu)} °C saat tanur dibuka pada jam ke-${akhir.jam}. Gunakan panah kiri dan kanan untuk membaca tiap titik.`}
          tabIndex={0}
          onPointerMove={dariPointer}
          onPointerDown={dariPointer}
          onPointerLeave={() => setAktif(null)}
          onKeyDown={tombol}
          onBlur={() => setAktif(null)}
        >
          <defs>
            <linearGradient id="kurva-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#f0a26b" stopOpacity="0.22" />
              <stop offset="1" stopColor="#f0a26b" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {[0, 400, 800, 1200].map((v) => (
            <g key={v}>
              <line x1={M.kiri} x2={W - M.kanan} y1={sy(v)} y2={sy(v)} stroke="#ffffff" strokeOpacity={v === 0 ? 0.35 : 0.1} strokeWidth="1" />
              <text x={M.kiri - 10} y={sy(v) + 4} textAnchor="end" fontSize="12" fill="#cbbfb0" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {angka.format(v)}
              </text>
            </g>
          ))}
          {tickX.map((j) => (
            <text key={j} x={sx(j)} y={H - M.bawah + 22} textAnchor="middle" fontSize="12" fill="#cbbfb0" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {j}
            </text>
          ))}
          <text x={W - M.kanan} y={H - 4} textAnchor="end" fontSize="11.5" fill="#cbbfb0">
            jam sejak tanur ditutup
          </text>
          <text x={M.kiri - 10} y={M.atas - 10} textAnchor="end" fontSize="11.5" fill="#cbbfb0">
            °C
          </text>
          <path d={area} fill="url(#kurva-area)" />
          <path d={garis} fill="none" stroke="#f0a26b" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          {titik
            .filter((p) => p.ket)
            .map((p) => (
              <circle key={p.jam} cx={p.x} cy={p.y} r="4.5" fill="#f0a26b" stroke="#1e1814" strokeWidth="2" />
            ))}
          <text x={puncak.x + 12} y={puncak.y - 8} fontSize="13" fill="#f7efe5" fontWeight="600">
            {angka.format(puncak.suhu)}&nbsp;°C
          </text>
          <text x={akhir.x - 4} y={akhir.y - 12} fontSize="12" fill="#f7efe5" textAnchor="end">
            dibuka
          </text>
          {t && (
            <g pointerEvents="none">
              <line x1={t.x} x2={t.x} y1={M.atas} y2={H - M.bawah} stroke="#f7efe5" strokeOpacity="0.5" strokeWidth="1" />
              <circle cx={t.x} cy={t.y} r="6" fill="#f0a26b" stroke="#1e1814" strokeWidth="2" />
            </g>
          )}
        </svg>
        {t && (
          <div
            role="status"
            className="pointer-events-none absolute top-2 max-w-[15rem] rounded-[3px] bg-kertas px-3 py-2 text-tinta shadow-lg"
            style={t.x > W / 2 ? { right: `${((W - t.x) / W) * 100 + 2}%` } : { left: `${(t.x / W) * 100 + 2}%` }}
          >
            <p className="text-base font-semibold leading-tight">{angka.format(t.suhu)}&nbsp;°C</p>
            <p className="text-[0.8rem] text-tinta-2">{labelJam(t.jam)}</p>
            {t.ket && <p className="mt-1 text-[0.8rem] leading-snug">{t.ket}</p>}
          </div>
        )}
      </div>
      <figcaption className="mt-4">
        <details className="group text-[0.9rem] text-[#e4d9cb]">
          <summary className="cursor-pointer select-none underline underline-offset-4 hover:decoration-2">Lihat sebagai tabel</summary>
          <table className="mt-3 w-full border-collapse text-left text-[0.85rem]">
            <caption className="sr-only">Jadwal suhu tanur per jam</caption>
            <thead>
              <tr className="border-b border-white/20">
                <th scope="col" className="py-1.5 pe-3 font-semibold">Jam ke-</th>
                <th scope="col" className="py-1.5 pe-3 font-semibold">Suhu</th>
                <th scope="col" className="py-1.5 font-semibold">Catatan</th>
              </tr>
            </thead>
            <tbody>
              {kurvaBakar.map((p) => (
                <tr key={p.jam} className="border-b border-white/10">
                  <td className="py-1.5 pe-3 tabular-nums">{angka.format(p.jam)}</td>
                  <td className="py-1.5 pe-3 tabular-nums">{angka.format(p.suhu)}&nbsp;°C</td>
                  <td className="py-1.5">{p.ket || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </figcaption>
    </figure>
  );
}
