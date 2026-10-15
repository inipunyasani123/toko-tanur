// Logika katalog: varian, harga, stok (data dasar + perubahan admin), dan filter.
import { produk, glasir, kategori, cariProduk, cariGlasir } from './data';

export function kunciVarian(glasirId, ukuranId) {
  return `${glasirId}/${ukuranId}`;
}

export function hargaVarian(p, glasirId, ukuranId) {
  const u = p.ukuran.find((x) => x.id === ukuranId) || p.ukuran[0];
  return u.harga + ((p.tambahanGlasir || {})[glasirId] || 0);
}

export function beratVarian(p, ukuranId) {
  const u = p.ukuran.find((x) => x.id === ukuranId) || p.ukuran[0];
  return u.berat;
}

export function labelVarian(p, glasirId, ukuranId) {
  const g = cariGlasir(glasirId);
  const u = p.ukuran.find((x) => x.id === ukuranId);
  const bagian = [g ? g.nama : glasirId];
  if (p.ukuran.length > 1 && u) bagian.push(u.label);
  else if (u) bagian.push(u.label);
  return bagian.join(' · ');
}

export function stokDasar(p, glasirId, ukuranId) {
  const i = p.ukuran.findIndex((x) => x.id === ukuranId);
  const baris = p.stok[glasirId];
  if (!baris || i < 0) return 0;
  return baris[i] ?? 0;
}

// inventaris = { [slug]: { aktif?: boolean, stok?: { [kunciVarian]: number } } }
export function stokVarian(p, glasirId, ukuranId, inventaris) {
  const ubah = inventaris?.[p.slug]?.stok?.[kunciVarian(glasirId, ukuranId)];
  return typeof ubah === 'number' ? ubah : stokDasar(p, glasirId, ukuranId);
}

export function produkAktif(p, inventaris) {
  const a = inventaris?.[p.slug]?.aktif;
  return a === undefined ? true : a;
}

export function semuaVarian(p) {
  const hasil = [];
  for (const g of p.glasir) {
    for (const u of p.ukuran) {
      hasil.push({ glasir: g, ukuran: u.id, kunci: kunciVarian(g, u.id) });
    }
  }
  return hasil;
}

export function totalStok(p, inventaris) {
  return semuaVarian(p).reduce((n, v) => n + stokVarian(p, v.glasir, v.ukuran, inventaris), 0);
}

export function rentangHarga(p) {
  const harga = [];
  for (const g of p.glasir) for (const u of p.ukuran) harga.push(hargaVarian(p, g, u.id));
  return { min: Math.min(...harga), max: Math.max(...harga) };
}

export function hargaTermurah(p) {
  return rentangHarga(p).min;
}

export function stokGlasir(p, glasirId, inventaris) {
  return p.ukuran.reduce((n, u) => n + stokVarian(p, glasirId, u.id, inventaris), 0);
}

// Varian pertama yang masih ada stoknya (untuk pilihan awal di halaman produk).
export function varianAwal(p, inventaris) {
  for (const g of p.glasir) {
    for (const u of p.ukuran) {
      if (stokVarian(p, g, u.id, inventaris) > 0) return { glasir: g, ukuran: u.id };
    }
  }
  return { glasir: p.glasir[0], ukuran: p.ukuran[0].id };
}

export function terlaris(n = 3) {
  return [...produk].sort((a, b) => b.terjual - a.terjual).slice(0, n);
}

export function hitungPerKategori() {
  const hasil = {};
  for (const k of kategori) hasil[k.id] = produk.filter((p) => p.kategori === k.id).length;
  return hasil;
}

export function hitungPerGlasir() {
  const hasil = {};
  for (const g of glasir) hasil[g.id] = produk.filter((p) => p.glasir.includes(g.id)).length;
  return hasil;
}

export function produkTerkait(p, n = 4) {
  const sama = produk.filter((x) => x.slug !== p.slug && x.kategori === p.kategori);
  const glasirSama = produk.filter(
    (x) => x.slug !== p.slug && x.kategori !== p.kategori && x.glasir.some((g) => p.glasir.includes(g)),
  );
  return [...sama, ...glasirSama].slice(0, n);
}

// Rentang harga untuk filter.
export const rentangFilter = [
  { id: 'bawah-100', label: 'Di bawah Rp100.000', min: 0, max: 99999 },
  { id: '100-250', label: 'Rp100.000–Rp250.000', min: 100000, max: 250000 },
  { id: 'atas-250', label: 'Di atas Rp250.000', min: 250001, max: Infinity },
];

export const urutan = [
  { id: 'unggulan', label: 'Paling sering dipesan' },
  { id: 'termurah', label: 'Harga terendah' },
  { id: 'termahal', label: 'Harga tertinggi' },
  { id: 'terbaru', label: 'Angkatan terbaru' },
  { id: 'nama', label: 'Nama A–Z' },
];

function normal(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

// filter = { q, kategori: [], glasir: [], harga: '', urut: '' }
export function saringProduk(daftar, filter, inventaris) {
  const kata = normal(filter.q).split(/\s+/).filter(Boolean);
  const rentang = rentangFilter.find((r) => r.id === filter.harga);
  let hasil = daftar.filter((p) => {
    if (!produkAktif(p, inventaris)) return false;
    if (filter.kategori?.length && !filter.kategori.includes(p.kategori)) return false;
    if (filter.glasir?.length && !p.glasir.some((g) => filter.glasir.includes(g))) return false;
    if (rentang) {
      const { min, max } = rentangHarga(p);
      // Lolos bila ada varian yang harganya masuk rentang.
      if (max < rentang.min || min > rentang.max) return false;
    }
    if (kata.length) {
      const kat = kategori.find((k) => k.id === p.kategori);
      const teks = normal(
        [p.nama, p.ringkas, kat?.nama, ...p.glasir.map((g) => cariGlasir(g)?.nama), ...p.ukuran.map((u) => u.label)].join(' '),
      );
      if (!kata.every((k) => teks.includes(k))) return false;
    }
    return true;
  });
  const urut = filter.urut || 'unggulan';
  hasil = [...hasil].sort((a, b) => {
    if (urut === 'termurah') return hargaTermurah(a) - hargaTermurah(b);
    if (urut === 'termahal') return rentangHarga(b).max - rentangHarga(a).max;
    if (urut === 'terbaru') return b.angkatan - a.angkatan || b.terjual - a.terjual;
    if (urut === 'nama') return a.nama.localeCompare(b.nama, 'id');
    return b.terjual - a.terjual;
  });
  return hasil;
}

export { cariProduk };
