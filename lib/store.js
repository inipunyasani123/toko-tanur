'use client';

// Penyimpanan di browser (localStorage) untuk keranjang, pesanan, dan perubahan stok.
// Tidak ada server: semua data demo hidup di browser pengunjung.
import { useCallback, useSyncExternalStore } from 'react';
import { cariProduk } from './data';
import { stokVarian, kunciVarian } from './katalog';
import { buatKode, normalKode, pesananContoh, rakitPesanan, terapkanStatus, NOMOR_AWAL_CONTOH } from './pesanan';

export const KUNCI = {
  keranjang: 'tanur.cart.v1',
  pesanan: 'tanur.orders.v1',
  inventaris: 'tanur.inventory.v1',
  nomor: 'tanur.seq.v1',
  contoh: 'tanur.seeded.v1',
};

const KOSONG_LIST = Object.freeze([]);
const KOSONG_OBJ = Object.freeze({});

const cadangan = new Map(); // dipakai bila localStorage tidak bisa diakses
const cache = new Map();
const pendengar = new Map();

function ambilMentah(kunci) {
  try {
    const v = window.localStorage.getItem(kunci);
    if (v !== null) return v;
  } catch {
    /* mode privat atau penyimpanan diblokir */
  }
  return cadangan.has(kunci) ? cadangan.get(kunci) : null;
}

function simpanMentah(kunci, mentah) {
  cadangan.set(kunci, mentah);
  try {
    if (mentah === null) window.localStorage.removeItem(kunci);
    else window.localStorage.setItem(kunci, mentah);
  } catch {
    /* tetap jalan dari cadangan memori */
  }
}

function baca(kunci, awal) {
  const mentah = typeof window === 'undefined' ? null : ambilMentah(kunci);
  const c = cache.get(kunci);
  if (c && c.mentah === mentah) return c.nilai;
  let nilai = awal;
  if (mentah) {
    try {
      nilai = JSON.parse(mentah);
    } catch {
      nilai = awal;
    }
  }
  cache.set(kunci, { mentah, nilai });
  return nilai;
}

function kabari(kunci) {
  const set = pendengar.get(kunci);
  if (set) for (const fn of [...set]) fn();
}

function tulis(kunci, nilai) {
  const mentah = nilai === null ? null : JSON.stringify(nilai);
  simpanMentah(kunci, mentah);
  cache.delete(kunci);
  kabari(kunci);
}

function langganan(kunci, fn) {
  let set = pendengar.get(kunci);
  if (!set) {
    set = new Set();
    pendengar.set(kunci, set);
  }
  set.add(fn);
  const dariTabLain = (e) => {
    if (e.key === kunci || e.key === null) {
      cache.delete(kunci);
      fn();
    }
  };
  window.addEventListener('storage', dariTabLain);
  return () => {
    set.delete(fn);
    window.removeEventListener('storage', dariTabLain);
  };
}

function useSimpanan(kunci, awal) {
  const sub = useCallback((fn) => langganan(kunci, fn), [kunci]);
  const get = useCallback(() => baca(kunci, awal), [kunci, awal]);
  return useSyncExternalStore(sub, get, () => awal);
}

const tanpaLangganan = () => () => {};

// true setelah halaman terpasang di browser (data localStorage sudah terbaca).
export function useTerpasang() {
  return useSyncExternalStore(tanpaLangganan, () => true, () => false);
}

export function useKeranjang() {
  return useSimpanan(KUNCI.keranjang, KOSONG_LIST);
}

export function usePesanan() {
  return useSimpanan(KUNCI.pesanan, KOSONG_LIST);
}

export function useInventaris() {
  return useSimpanan(KUNCI.inventaris, KOSONG_OBJ);
}

// ---------- Data contoh ----------

export function pastikanContoh() {
  if (typeof window === 'undefined') return;
  if (ambilMentah(KUNCI.contoh)) return;
  const sekarang = Date.now();
  const contoh = pesananContoh(sekarang);
  const lama = baca(KUNCI.pesanan, KOSONG_LIST).filter((p) => !p.contoh);
  tulis(KUNCI.pesanan, [...contoh, ...lama].sort((a, b) => b.dibuat - a.dibuat));
  const nomor = Number(baca(KUNCI.nomor, 0)) || 0;
  tulis(KUNCI.nomor, Math.max(nomor, NOMOR_AWAL_CONTOH + contoh.length - 1));
  tulis(KUNCI.contoh, { waktu: sekarang });
}

export function kembalikanDataContoh() {
  tulis(KUNCI.inventaris, null);
  tulis(KUNCI.pesanan, null);
  tulis(KUNCI.nomor, null);
  tulis(KUNCI.contoh, null);
  pastikanContoh();
}

// ---------- Keranjang ----------

function itemKunci(it) {
  return `${it.slug}|${kunciVarian(it.glasir, it.ukuran)}`;
}

export function tambahKeKeranjang({ slug, glasir, ukuran, qty }) {
  const p = cariProduk(slug);
  if (!p) return { ok: false };
  const stok = stokVarian(p, glasir, ukuran, baca(KUNCI.inventaris, KOSONG_OBJ));
  const daftar = [...baca(KUNCI.keranjang, KOSONG_LIST)];
  const kunci = itemKunci({ slug, glasir, ukuran });
  const i = daftar.findIndex((it) => itemKunci(it) === kunci);
  const sudah = i >= 0 ? daftar[i].qty : 0;
  const baru = Math.min(stok, sudah + qty);
  if (baru <= sudah) return { ok: false, stok, sudah };
  if (i >= 0) daftar[i] = { ...daftar[i], qty: baru };
  else daftar.push({ slug, glasir, ukuran, qty: baru, ditambah: Date.now() });
  tulis(KUNCI.keranjang, daftar);
  return { ok: true, qty: baru, ditambahkan: baru - sudah, terpotong: baru < sudah + qty };
}

export function ubahJumlah(kunci, qty) {
  const daftar = baca(KUNCI.keranjang, KOSONG_LIST).map((it) => (itemKunci(it) === kunci ? { ...it, qty: Math.max(1, qty) } : it));
  tulis(KUNCI.keranjang, daftar);
}

export function hapusItem(kunci) {
  tulis(
    KUNCI.keranjang,
    baca(KUNCI.keranjang, KOSONG_LIST).filter((it) => itemKunci(it) !== kunci),
  );
}

export function kosongkanKeranjang() {
  tulis(KUNCI.keranjang, []);
}

export { itemKunci };

// ---------- Pesanan ----------

export function buatPesanan({ pembeli, items, layanan, kayu, metode }) {
  const sekarang = Date.now();
  const nomor = (Number(baca(KUNCI.nomor, 0)) || NOMOR_AWAL_CONTOH - 1) + 1;
  const kode = buatKode(nomor, sekarang);
  const pesanan = rakitPesanan({ kode, dibuat: sekarang, pembeli, items, layanan, kayu, metode });
  // Kurangi stok varian yang dipesan.
  const inv = structuredClone(baca(KUNCI.inventaris, KOSONG_OBJ));
  for (const it of items) {
    const p = cariProduk(it.slug);
    const sisa = stokVarian(p, it.glasir, it.ukuran, inv);
    inv[it.slug] = inv[it.slug] || {};
    inv[it.slug].stok = { ...(inv[it.slug].stok || {}), [kunciVarian(it.glasir, it.ukuran)]: Math.max(0, sisa - it.qty) };
  }
  tulis(KUNCI.inventaris, inv);
  tulis(KUNCI.pesanan, [pesanan, ...baca(KUNCI.pesanan, KOSONG_LIST)]);
  tulis(KUNCI.nomor, nomor);
  tulis(KUNCI.keranjang, []);
  return kode;
}

export function cariPesanan(daftar, kode) {
  const k = normalKode(kode);
  return daftar.find((p) => normalKode(p.kode) === k) || null;
}

export function ubahStatusPesanan(kode, status) {
  const sekarang = Date.now();
  tulis(
    KUNCI.pesanan,
    baca(KUNCI.pesanan, KOSONG_LIST).map((p) => (p.kode === kode ? terapkanStatus(p, status, sekarang) : p)),
  );
}

// ---------- Inventaris (admin) ----------

export function aturStok(slug, kunci, jumlah) {
  const inv = structuredClone(baca(KUNCI.inventaris, KOSONG_OBJ));
  inv[slug] = inv[slug] || {};
  inv[slug].stok = { ...(inv[slug].stok || {}), [kunci]: Math.max(0, Math.floor(Number(jumlah) || 0)) };
  tulis(KUNCI.inventaris, inv);
}

export function aturAktif(slug, aktif) {
  const inv = structuredClone(baca(KUNCI.inventaris, KOSONG_OBJ));
  inv[slug] = { ...(inv[slug] || {}), aktif };
  tulis(KUNCI.inventaris, inv);
}
