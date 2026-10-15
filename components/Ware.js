// Ilustrasi keping keramik (SVG) yang mengikuti glasir dan ukuran terpilih.
// Gaya gambarnya seragam untuk semua produk: tampak tiga perempat, kaki tanpa glasir,
// garis glasir yang meleleh, bintik besi, dan garis putaran meja putar.
import { useId } from 'react';
import { cariGlasir } from '@/lib/data';

const TANAH = { warna: '#d3b08c', gelap: '#a7805d', titik: '#6b4a32' };

const f = (n) => Math.round(n * 10) / 10;

function hexKeRgb(hex) {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

function campur(a, b, t) {
  const x = hexKeRgb(a);
  const y = hexKeRgb(b);
  const c = x.map((v, i) => Math.round(v + (y[i] - v) * t));
  return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

function acak(benih) {
  let s = benih >>> 0 || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function hashTeks(t) {
  let h = 2166136261;
  for (let i = 0; i < t.length; i++) {
    h ^= t.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Kurva Catmull-Rom melalui titik profil [tinggi, jari-jari].
function sampel(titik, langkah = 10) {
  const hasil = [];
  for (let i = 0; i < titik.length - 1; i++) {
    const p0 = titik[Math.max(0, i - 1)];
    const p1 = titik[i];
    const p2 = titik[i + 1];
    const p3 = titik[Math.min(titik.length - 1, i + 2)];
    for (let s = 0; s < langkah; s++) {
      const t = s / langkah;
      const t2 = t * t;
      const t3 = t2 * t;
      const titikBaru = [0, 1].map(
        (j) =>
          0.5 *
          (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3),
      );
      hasil.push(titikBaru);
    }
  }
  hasil.push(titik[titik.length - 1]);
  return hasil;
}

function jariPada(pts, h) {
  let terbaik = pts[0];
  for (const p of pts) if (Math.abs(p[0] - h) < Math.abs(terbaik[0] - h)) terbaik = p;
  return terbaik[1];
}

// Profil tiap bentuk: [tinggi, jari-jari] dari kaki ke bibir.
const PROFIL = {
  mangkuk: { k: 0.3, titik: [[0, 46], [11, 47], [14, 54], [38, 93], [70, 117], [104, 128], [116, 129]], glasir: 18, dalam: 'terbuka' },
  'mangkuk-lebar': { k: 0.3, titik: [[0, 50], [10, 51], [13, 58], [45, 103], [85, 135], [118, 150], [126, 152]], glasir: 17, dalam: 'terbuka' },
  'mangkuk-saji': { k: 0.3, titik: [[0, 62], [10, 63], [13, 72], [35, 122], [70, 153], [100, 164], [108, 165]], glasir: 52, dalam: 'terbuka' },
  cawan: { k: 0.32, titik: [[0, 44], [8, 45], [11, 52], [30, 82], [52, 100], [64, 104]], glasir: 13, dalam: 'terbuka' },
  cangkir: { k: 0.3, titik: [[0, 48], [8, 49], [11, 56], [40, 68], [90, 76], [138, 82], [148, 83]], glasir: 14, dalam: 'gelap' },
  gelas: { k: 0.3, titik: [[0, 50], [8, 51], [11, 57], [60, 62], [120, 63], [178, 69], [190, 70]], glasir: 16, dalam: 'gelap' },
  mug: { k: 0.3, titik: [[0, 70], [8, 71], [11, 76], [60, 77], [130, 76], [182, 75], [190, 76]], glasir: 15, dalam: 'gelap' },
  teko: { k: 0.3, titik: [[0, 66], [8, 67], [12, 78], [40, 118], [80, 128], [120, 110], [150, 76], [160, 66]], glasir: 16, dalam: 'tutup' },
  'vas-kecil': { k: 0.3, titik: [[0, 52], [8, 53], [12, 62], [55, 82], [100, 70], [140, 34], [175, 22], [212, 22], [226, 30], [230, 31]], glasir: 18, dalam: 'gelap' },
  'vas-besar': { k: 0.3, titik: [[0, 66], [9, 67], [14, 76], [80, 118], [160, 140], [215, 116], [252, 62], [272, 60], [286, 70], [290, 71]], glasir: 22, dalam: 'gelap' },
};

function bentukDasar(nama) {
  if (nama === 'piring' || nama === 'piring-kecil' || nama === 'piring-oval') return 'piring';
  return nama;
}

function Bejana({ profil, cx, base, s = 1, ids, g, benih, garisRetak = false }) {
  const rnd = acak(benih);
  const spec = PROFIL[profil];
  const k = spec.k;
  const pts = sampel(spec.titik.map(([h, r]) => [h * s, r * s]), 12);
  const H = pts[pts.length - 1][0];
  const rAtas = pts[pts.length - 1][1];
  const r0 = pts[0][1];
  const yAtas = base - H;
  const kiri = pts.map(([h, r]) => `${f(cx - r)} ${f(base - h)}`);
  const kanan = pts.map(([h, r]) => `${f(cx + r)} ${f(base - h)}`);
  const rMax = Math.max(...pts.map((p) => p[1]));

  const badan =
    `M ${kiri[kiri.length - 1]} L ${[...kiri].reverse().join(' L ')} ` +
    `A ${f(r0)} ${f(r0 * k)} 0 0 0 ${f(cx + r0)} ${f(base)} L ${kanan.join(' L ')} ` +
    `A ${f(rAtas)} ${f(rAtas * k)} 0 0 1 ${f(cx - rAtas)} ${f(yAtas)} Z`;

  // Bagian berglasir: dari bibir sampai garis glasir yang meleleh.
  const hg = spec.glasir * s;
  const rg = jariPada(pts, hg);
  const atasG = pts.filter(([h]) => h >= hg);
  const kiriG = atasG.map(([h, r]) => `${f(cx - r)} ${f(base - h)}`);
  const kananG = atasG.map(([h, r]) => `${f(cx + r)} ${f(base - h)}`);
  // Tetesan glasir: beberapa tonjolan halus (bentuk lonceng) di sepanjang garis glasir.
  const lelehan = [];
  const jumlahLeleh = 2 + Math.floor(rnd() * 3);
  for (let i = 0; i < jumlahLeleh; i++) {
    lelehan.push({ pusat: Math.PI * (0.2 + rnd() * 0.6), lebar: 0.07 + rnd() * 0.06, dalam: (4 + rnd() * 8) * s });
  }
  const tetes = [];
  const n = 72;
  for (let i = 0; i <= n; i++) {
    const th = Math.PI - (Math.PI * i) / n;
    let dy = Math.sin(th) * rg * k + Math.sin(th * 7 + rnd() * 0.3) * 0.8 * s;
    // Ujung tetesan membulat seperti butir glasir yang membeku.
    for (const l of lelehan) {
      const x = (th - l.pusat) / l.lebar;
      if (Math.abs(x) < 1) dy += l.dalam * Math.pow(1 - x * x, 0.55);
    }
    tetes.push(`${f(cx + Math.cos(th) * rg)} ${f(base - hg + dy)}`);
  }
  const berglasir =
    `M ${kiriG[kiriG.length - 1]} L ${[...kiriG].reverse().join(' L ')} L ${tetes.join(' L ')} ` +
    `L ${kananG.join(' L ')} A ${f(rAtas)} ${f(rAtas * k)} 0 0 1 ${f(cx - rAtas)} ${f(yAtas)} Z`;

  // Garis putaran meja putar.
  const garis = [];
  for (let h = hg + 14 * s; h < H - 10 * s; h += 17 * s) {
    const r = jariPada(pts, h);
    garis.push(`M ${f(cx - r)} ${f(base - h)} A ${f(r)} ${f(r * k)} 0 0 0 ${f(cx + r)} ${f(base - h)}`);
  }
  const garisTanah = [];
  for (let h = 4 * s; h < hg - 3 * s; h += 6 * s) {
    const r = jariPada(pts, h);
    garisTanah.push(`M ${f(cx - r)} ${f(base - h)} A ${f(r)} ${f(r * k)} 0 0 0 ${f(cx + r)} ${f(base - h)}`);
  }

  // Bintik besi.
  const bintik = [];
  const jumlah = Math.round(70 * s);
  for (let i = 0; i < jumlah; i++) {
    const h = rnd() * H;
    const r = jariPada(pts, h);
    const x = cx + (rnd() * 2 - 1) * r;
    const y = base - h + (rnd() * 2 - 1) * r * k * 0.6;
    bintik.push([f(x), f(y), f((0.6 + rnd() * 1.3) * Math.max(0.7, s))]);
  }

  const clipId = `${ids.dasar}-c-${profil}-${f(cx)}-${f(base)}`;
  const elipsAtas = { cx: f(cx), cy: f(yAtas), rx: f(rAtas), ry: f(rAtas * k) };

  return (
    <g>
      <defs>
        <clipPath id={clipId}>
          <path d={badan} />
        </clipPath>
      </defs>
      <ellipse cx={f(cx)} cy={f(base + r0 * k * 0.55)} rx={f(rMax * 1.08)} ry={f(rMax * k * 0.9)} fill={`url(#${ids.bayang})`} />
      <path d={badan} fill={`url(#${ids.tanah})`} />
      <g clipPath={`url(#${clipId})`}>
        {garisTanah.map((d, i) => (
          <path key={`t${i}`} d={d} fill="none" stroke={TANAH.gelap} strokeOpacity="0.35" strokeWidth={f(1 * s + 0.2)} />
        ))}
        {bintik.slice(0, Math.round(jumlah / 3)).map(([x, y, r], i) => (
          <circle key={`bt${i}`} cx={x} cy={y} r={r} fill={TANAH.titik} opacity="0.55" />
        ))}
        <path d={berglasir} fill={`url(#${ids.badan})`} />
        <path d={berglasir} fill={`url(#${ids.kilau})`} />
        {garis.map((d, i) => (
          <path key={`g${i}`} d={d} fill="none" stroke={g.gelap} strokeOpacity="0.16" strokeWidth={f(1.4 * s + 0.2)} />
        ))}
        {bintik.slice(Math.round(jumlah / 3)).map(([x, y, r], i) => (
          <circle key={`b${i}`} cx={x} cy={y} r={r} fill={g.id === 'abu' ? '#7b5b40' : g.gelap} opacity={g.id === 'abu' ? 0.55 : 0.32} />
        ))}
        {garisRetak && (
          <path
            d={`M ${f(cx - rAtas * 0.2)} ${f(yAtas + rAtas * k)} l ${f(14 * s)} ${f(30 * s)} l ${f(-10 * s)} ${f(22 * s)} l ${f(18 * s)} ${f(28 * s)}`}
            fill="none"
            stroke="#2a1d16"
            strokeWidth={f(2.2 * s)}
            strokeLinejoin="round"
          />
        )}
      </g>
      {spec.dalam === 'terbuka' && (
        <>
          <ellipse {...elipsAtas} fill={`url(#${ids.dalam})`} />
          <ellipse cx={f(cx)} cy={f(yAtas + rAtas * k * 0.28)} rx={f(rAtas * 0.48)} ry={f(rAtas * k * 0.42)} fill={`url(#${ids.genang})`} />
        </>
      )}
      {spec.dalam === 'gelap' && <ellipse {...elipsAtas} fill={`url(#${ids.gelap})`} />}
      {spec.dalam !== 'tutup' && (
        <>
          <ellipse {...elipsAtas} fill="none" stroke={g.tepi} strokeWidth={f(3.2 * s + 0.4)} />
          <path
            d={`M ${f(cx - rAtas * 0.92)} ${f(yAtas + rAtas * k * 0.38)} A ${f(rAtas)} ${f(rAtas * k)} 0 0 0 ${f(cx + rAtas * 0.2)} ${f(yAtas + rAtas * k)}`}
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.38"
            strokeWidth={f(1.4 * s + 0.3)}
          />
        </>
      )}
    </g>
  );
}

// Piring tampak tiga perempat (bulat atau oval).
function Piring({ cx, cy, R, fx = 1, k = 0.36, ids, g, benih, tebal = 13 }) {
  const rnd = acak(benih);
  const rx = R * fx;
  const ry = R * k;
  const sisi =
    `M ${f(cx - rx)} ${f(cy)} A ${f(rx)} ${f(ry)} 0 0 0 ${f(cx + rx)} ${f(cy)} ` +
    `L ${f(cx + rx * 0.97)} ${f(cy + tebal)} A ${f(rx * 0.97)} ${f(ry * 0.97)} 0 0 1 ${f(cx - rx * 0.97)} ${f(cy + tebal)} Z`;
  const bintik = [];
  for (let i = 0; i < 60; i++) {
    const a = rnd() * Math.PI * 2;
    const d = Math.sqrt(rnd()) * 0.95;
    bintik.push([f(cx + Math.cos(a) * rx * d), f(cy + Math.sin(a) * ry * d), f(0.7 + rnd() * 1.2)]);
  }
  const clipId = `${ids.dasar}-p-${f(cx)}-${f(cy)}`;
  return (
    <g>
      <defs>
        <clipPath id={clipId}>
          <ellipse cx={f(cx)} cy={f(cy)} rx={f(rx)} ry={f(ry)} />
        </clipPath>
      </defs>
      <ellipse cx={f(cx)} cy={f(cy + tebal + ry * 0.12)} rx={f(rx * 1.03)} ry={f(ry * 0.95)} fill={`url(#${ids.bayang})`} />
      <path d={sisi} fill={g.gelap} />
      <path d={sisi} fill={`url(#${ids.badan})`} opacity="0.55" />
      <ellipse cx={f(cx)} cy={f(cy)} rx={f(rx)} ry={f(ry)} fill={`url(#${ids.atas})`} />
      <g clipPath={`url(#${clipId})`}>
        <ellipse cx={f(cx)} cy={f(cy + ry * 0.05)} rx={f(rx * 0.7)} ry={f(ry * 0.68)} fill="none" stroke={g.gelap} strokeOpacity="0.3" strokeWidth="2" />
        <ellipse cx={f(cx)} cy={f(cy + ry * 0.07)} rx={f(rx * 0.69)} ry={f(ry * 0.67)} fill="none" stroke="#ffffff" strokeOpacity="0.28" strokeWidth="1.2" />
        <ellipse cx={f(cx)} cy={f(cy + ry * 0.08)} rx={f(rx * 0.5)} ry={f(ry * 0.46)} fill={`url(#${ids.genang})`} />
        {[0.42, 0.56].map((t) => (
          <ellipse key={t} cx={f(cx)} cy={f(cy + ry * 0.06)} rx={f(rx * t)} ry={f(ry * t)} fill="none" stroke={g.gelap} strokeOpacity="0.1" strokeWidth="1.2" />
        ))}
        {bintik.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill={g.id === 'abu' ? '#7b5b40' : g.gelap} opacity={g.id === 'abu' ? 0.5 : 0.3} />
        ))}
      </g>
      <ellipse cx={f(cx)} cy={f(cy)} rx={f(rx)} ry={f(ry)} fill="none" stroke={g.tepi} strokeWidth="3" />
      <path
        d={`M ${f(cx - rx * 0.96)} ${f(cy - ry * 0.28)} A ${f(rx)} ${f(ry)} 0 0 1 ${f(cx - rx * 0.1)} ${f(cy - ry)}`}
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.45"
        strokeWidth="1.6"
      />
    </g>
  );
}

function Pegangan({ x1, y1, x2, y2, lebar, tebal, g }) {
  const d = `M ${f(x1 - 6)} ${f(y1)} C ${f(x1 + lebar)} ${f(y1 - 8)} ${f(x2 + lebar + 6)} ${f(y2 + 6)} ${f(x2 - 6)} ${f(y2)}`;
  return (
    <g>
      <path d={d} fill="none" stroke={g.gelap} strokeWidth={tebal} strokeLinecap="round" />
      <path d={d} fill="none" stroke={g.warna} strokeWidth={tebal - 4} strokeLinecap="round" />
      <path d={d} fill="none" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="2.5" strokeLinecap="round" transform="translate(-2 -2)" />
    </g>
  );
}

function jariProfil(profil, h, s = 1) {
  const pts = sampel(PROFIL[profil].titik.map(([a, b]) => [a * s, b * s]), 12);
  return jariPada(pts, h * s);
}

function Cangkir({ cx, base, s, ids, g, benih, profil = 'cangkir' }) {
  const spec = PROFIL[profil];
  const H = spec.titik[spec.titik.length - 1][0];
  const atas = H * (profil === 'mug' ? 0.8 : 0.78);
  const bawah = H * (profil === 'mug' ? 0.24 : 0.3);
  const ra = jariProfil(profil, atas) * s;
  const rb = jariProfil(profil, bawah) * s;
  return (
    <g>
      <Pegangan
        x1={cx + ra}
        y1={base - atas * s}
        x2={cx + rb}
        y2={base - bawah * s}
        lebar={(profil === 'mug' ? 66 : 50) * s}
        tebal={f((profil === 'mug' ? 19 : 15) * s)}
        g={g}
      />
      <Bejana profil={profil} cx={cx} base={base} s={s} ids={ids} g={g} benih={benih} />
    </g>
  );
}

function Teko({ cx, base, s, ids, g, benih }) {
  const spec = PROFIL.teko;
  const H = spec.titik[spec.titik.length - 1][0] * s;
  const rAtas = spec.titik[spec.titik.length - 1][1] * s;
  const k = spec.k;
  const yAtas = base - H;
  const rPerut = jariProfil('teko', 70, 1) * s;
  const xCerat = cx - rPerut + 8 * s;
  const cerat =
    `M ${f(xCerat + 4 * s)} ${f(base - 26 * s)} C ${f(xCerat - 48 * s)} ${f(base - 34 * s)} ${f(xCerat - 60 * s)} ${f(base - 112 * s)} ${f(xCerat - 84 * s)} ${f(base - 152 * s)} ` +
    `L ${f(xCerat - 63 * s)} ${f(base - 162 * s)} C ${f(xCerat - 46 * s)} ${f(base - 130 * s)} ${f(xCerat - 28 * s)} ${f(base - 108 * s)} ${f(xCerat + 10 * s)} ${f(base - 104 * s)} Z`;
  const rl = rAtas * 1.04;
  const kubah = `M ${f(cx - rl)} ${f(yAtas)} C ${f(cx - rl * 0.9)} ${f(yAtas - 44 * s)} ${f(cx + rl * 0.9)} ${f(yAtas - 44 * s)} ${f(cx + rl)} ${f(yAtas)} A ${f(rl)} ${f(rl * k)} 0 0 1 ${f(cx - rl)} ${f(yAtas)} Z`;
  return (
    <g>
      <Pegangan x1={cx + jariProfil('teko', 128, 1) * s} y1={base - 128 * s} x2={cx + jariProfil('teko', 42, 1) * s} y2={base - 42 * s} lebar={62 * s} tebal={f(18 * s)} g={g} />
      <path d={cerat} fill={`url(#${ids.badan})`} />
      <path d={cerat} fill={`url(#${ids.kilau})`} />
      <ellipse cx={f(xCerat - 73.5 * s)} cy={f(base - 157 * s)} rx={f(11.5 * s)} ry={f(4.2 * s)} transform={`rotate(-26 ${f(xCerat - 73.5 * s)} ${f(base - 157 * s)})`} fill={g.tepi} />
      <Bejana profil="teko" cx={cx} base={base} s={s} ids={ids} g={g} benih={benih} />
      <path d={kubah} fill={`url(#${ids.badan})`} />
      <path d={kubah} fill={`url(#${ids.kilau})`} />
      <path
        d={`M ${f(cx - rl)} ${f(yAtas)} A ${f(rl)} ${f(rl * k)} 0 0 0 ${f(cx + rl)} ${f(yAtas)}`}
        fill="none"
        stroke={g.tepi}
        strokeWidth={f(2.6 * s)}
      />
      <path
        d={`M ${f(cx - rl * 0.62)} ${f(yAtas - 22 * s)} Q ${f(cx - rl * 0.2)} ${f(yAtas - 36 * s)} ${f(cx + rl * 0.15)} ${f(yAtas - 33 * s)}`}
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.35"
        strokeWidth={f(2 * s)}
        strokeLinecap="round"
      />
      <ellipse cx={f(cx)} cy={f(yAtas - 36 * s)} rx={f(8 * s)} ry={f(3 * s)} fill={g.gelap} />
      <ellipse cx={f(cx)} cy={f(yAtas - 42 * s)} rx={f(12 * s)} ry={f(9 * s)} fill={`url(#${ids.badan})`} />
      <ellipse cx={f(cx - 4 * s)} cy={f(yAtas - 45 * s)} rx={f(4 * s)} ry={f(2.6 * s)} fill="#ffffff" opacity="0.4" />
    </g>
  );
}

function susunan(bentuk, ukuranId, iUkuran, nUkuran) {
  // Kembalikan daftar keping yang digambar: [{ jenis, cx, base, s }]
  const kecil = nUkuran > 1 && iUkuran === 0 ? 0.88 : 1;
  switch (bentuk) {
    case 'cawan':
      if (ukuranId === 'set-4')
        return [
          { jenis: 'cawan', cx: 132, base: 222, s: 0.7 },
          { jenis: 'cawan', cx: 270, base: 214, s: 0.7 },
          { jenis: 'cawan', cx: 118, base: 318, s: 0.82 },
          { jenis: 'cawan', cx: 282, base: 312, s: 0.82 },
        ];
      return [{ jenis: 'cawan', cx: 200, base: 262, s: 1.25 }];
    case 'piring-kecil':
      if (ukuranId === 'set-4') return [0, 1, 2, 3].map((i) => ({ jenis: 'piring', cx: 200, cy: 258 - i * 16, R: 150 }));
      return [{ jenis: 'piring', cx: 200, cy: 215, R: 158 }];
    case 'piring':
      return [{ jenis: 'piring', cx: 200, cy: 205, R: 170 * (kecil < 1 ? 0.9 : 1) }];
    case 'piring-oval':
      return [{ jenis: 'piring', cx: 200, cy: 205, R: 128, fx: 1.4 }];
    case 'cangkir':
      if (ukuranId === 'set-2')
        return [
          { jenis: 'cangkir', cx: 140, base: 262, s: 0.82 },
          { jenis: 'cangkir', cx: 252, base: 318, s: 0.9 },
        ];
      return [{ jenis: 'cangkir', cx: 186, base: 300, s: 1.2 }];
    case 'gelas':
      if (ukuranId === 'set-4')
        return [
          { jenis: 'gelas', cx: 140, base: 232, s: 0.66 },
          { jenis: 'gelas', cx: 262, base: 226, s: 0.66 },
          { jenis: 'gelas', cx: 128, base: 336, s: 0.74 },
          { jenis: 'gelas', cx: 272, base: 332, s: 0.74 },
        ];
      return [{ jenis: 'gelas', cx: 200, base: 312, s: 1.12 }];
    case 'mug':
      return [{ jenis: 'mug', cx: 180, base: 304, s: 1.1 }];
    case 'teko':
      if (ukuranId === 'teko-2-gelas')
        return [
          { jenis: 'teko', cx: 196, base: 262, s: 0.9 },
          { jenis: 'gelas', cx: 112, base: 352, s: 0.5 },
          { jenis: 'gelas', cx: 300, base: 356, s: 0.5 },
        ];
      return [{ jenis: 'teko', cx: 214, base: 296, s: 1.04 }];
    case 'vas-kecil':
      return [{ jenis: 'vas-kecil', cx: 200, base: 330, s: kecil < 1 ? 0.95 : 1.18 }];
    case 'vas-besar':
      return [{ jenis: 'vas-besar', cx: 200, base: 338, s: 0.98 }];
    case 'set':
      return [
        { jenis: 'piring', cx: 214, cy: 205, R: 148 },
        { jenis: 'mangkuk', cx: 138, base: 300, s: 0.62 },
        { jenis: 'cangkir', cx: 280, base: 318, s: 0.66 },
      ];
    case 'mangkuk-saji':
      return [{ jenis: 'mangkuk-saji', cx: 200, base: 282, s: kecil < 1 ? 0.92 : 1.04 }];
    case 'mangkuk-lebar':
      return [{ jenis: 'mangkuk-lebar', cx: 200, base: 282, s: 1.08 }];
    case 'mangkuk':
    default:
      return [{ jenis: 'mangkuk', cx: 200, base: 282, s: kecil < 1 ? 1.1 : 1.24 }];
  }
}

export default function Ware({
  bentuk = 'mangkuk',
  glasir: glasirId = 'seladon',
  ukuranId = '',
  iUkuran = 0,
  nUkuran = 1,
  className = '',
  judul,
  retak = false,
  benih = '',
  x,
  y,
  width,
  height,
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const g = cariGlasir(glasirId) || cariGlasir('seladon');
  const ids = {
    dasar: `w${uid}`,
    badan: `w${uid}b`,
    kilau: `w${uid}k`,
    tanah: `w${uid}t`,
    dalam: `w${uid}d`,
    genang: `w${uid}g`,
    gelap: `w${uid}h`,
    atas: `w${uid}a`,
    bayang: `w${uid}s`,
  };
  const dasarBenih = `${bentuk}-${glasirId}-${ukuranId}-${benih}`;
  // Keping buatan tangan tidak pernah kembar: benih mengubah ukuran sedikit.
  const variasi = benih ? 0.93 + (hashTeks(`v-${benih}`) % 110) / 1000 : 1;
  const keping = susunan(bentuk, ukuranId, iUkuran, nUkuran);
  const terang = campur(g.warna, '#ffffff', 0.22);
  return (
    <svg
      viewBox="0 0 400 400"
      x={x}
      y={y}
      width={width}
      height={height}
      className={className}
      role={judul ? 'img' : undefined}
      aria-label={judul || undefined}
      aria-hidden={judul ? undefined : true}
      focusable="false"
    >
      <defs>
        <linearGradient id={ids.badan} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={g.gelap} />
          <stop offset="0.22" stopColor={g.warna} />
          <stop offset="0.36" stopColor={terang} />
          <stop offset="0.58" stopColor={g.warna} />
          <stop offset="1" stopColor={campur(g.gelap, '#000000', 0.18)} />
        </linearGradient>
        <linearGradient id={ids.kilau} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={g.tepi} stopOpacity="0.55" />
          <stop offset="0.18" stopColor={g.tepi} stopOpacity="0" />
          <stop offset="0.8" stopColor={g.gelap} stopOpacity="0" />
          <stop offset="1" stopColor={g.gelap} stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id={ids.tanah} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={TANAH.gelap} />
          <stop offset="0.35" stopColor={TANAH.warna} />
          <stop offset="1" stopColor={campur(TANAH.gelap, '#000000', 0.15)} />
        </linearGradient>
        <linearGradient id={ids.dalam} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={campur(g.gelap, '#000000', 0.12)} />
          <stop offset="0.3" stopColor={g.warna} />
          <stop offset="0.75" stopColor={terang} />
          <stop offset="1" stopColor={g.warna} />
        </linearGradient>
        <linearGradient id={ids.atas} x1="0" x2="0.4" y1="0" y2="1">
          <stop offset="0" stopColor={terang} />
          <stop offset="0.55" stopColor={g.warna} />
          <stop offset="1" stopColor={campur(g.warna, g.gelap, 0.45)} />
        </linearGradient>
        <radialGradient id={ids.genang}>
          <stop offset="0" stopColor={g.gelap} stopOpacity="0.55" />
          <stop offset="0.6" stopColor={g.gelap} stopOpacity="0.2" />
          <stop offset="1" stopColor={g.gelap} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={ids.gelap} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={campur(g.gelap, '#000000', 0.55)} />
          <stop offset="1" stopColor={g.gelap} />
        </linearGradient>
        <radialGradient id={ids.bayang}>
          <stop offset="0" stopColor="#2a1d16" stopOpacity="0.26" />
          <stop offset="0.7" stopColor="#2a1d16" stopOpacity="0.08" />
          <stop offset="1" stopColor="#2a1d16" stopOpacity="0" />
        </radialGradient>
      </defs>
      {keping.map((kp, i) => {
        const b = hashTeks(`${dasarBenih}-${i}`);
        if (kp.jenis === 'piring')
          return <Piring key={i} cx={kp.cx} cy={kp.cy} R={kp.R} fx={kp.fx} ids={ids} g={g} benih={b} />;
        if (kp.jenis === 'cangkir' || kp.jenis === 'mug')
          return <Cangkir key={i} profil={kp.jenis} cx={kp.cx} base={kp.base} s={kp.s} ids={ids} g={g} benih={b} />;
        if (kp.jenis === 'teko') return <Teko key={i} cx={kp.cx} base={kp.base} s={kp.s} ids={ids} g={g} benih={b} />;
        return <Bejana key={i} profil={kp.jenis} cx={kp.cx} base={kp.base} s={kp.s * variasi} ids={ids} g={g} benih={b} garisRetak={retak} />;
      })}
    </svg>
  );
}

export { bentukDasar, campur };
