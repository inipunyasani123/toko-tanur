// Format angka, berat, dan waktu. Semua waktu ditampilkan dalam WIB (Asia/Jakarta).

const angka = new Intl.NumberFormat('id-ID');

export function rupiah(n) {
  return `Rp${angka.format(Math.round(n || 0))}`;
}

export function gram(g) {
  if (g >= 1000) {
    const kg = g / 1000;
    return `${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(kg)} kg`;
  }
  return `${angka.format(g)} g`;
}

// Suhu dengan spasi tak terputus sebelum °C, mis. "1.240 °C".
export function suhu(n) {
  return `${angka.format(n)}\u00a0°C`;
}

export function kg(n) {
  return `${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 }).format(n)} kg`;
}

export const ZONA_WAKTU = 'Asia/Jakarta';

const fmtTanggalJam = new Intl.DateTimeFormat('id-ID', {
  timeZone: ZONA_WAKTU,
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const fmtTanggal = new Intl.DateTimeFormat('id-ID', {
  timeZone: ZONA_WAKTU,
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

const fmtTanggalPendek = new Intl.DateTimeFormat('id-ID', {
  timeZone: ZONA_WAKTU,
  day: 'numeric',
  month: 'short',
});

const fmtHariPendek = new Intl.DateTimeFormat('id-ID', {
  timeZone: ZONA_WAKTU,
  weekday: 'short',
});

const fmtKunci = new Intl.DateTimeFormat('en-CA', {
  timeZone: ZONA_WAKTU,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

// "15 Okt 2026, 14.05 WIB"
export function waktuWIB(ms) {
  if (!ms) return '';
  return `${fmtTanggalJam.format(new Date(ms)).replace(/\./g, '.')} WIB`;
}

// "Kamis, 22 Oktober"
export function tanggalPanjang(ms) {
  return fmtTanggal.format(new Date(ms));
}

export function tanggalPendek(ms) {
  return fmtTanggalPendek.format(new Date(ms));
}

export function hariPendek(ms) {
  return fmtHariPendek.format(new Date(ms));
}

// Kunci tanggal kalender WIB, mis. "2026-10-15".
export function kunciHariWIB(ms) {
  return fmtKunci.format(new Date(ms));
}

// Komponen tanggal WIB (tahun, bulan 1-12, hari, hari dalam minggu 0-6).
export function bagianWIB(ms) {
  const d = new Date(ms + 7 * 3600 * 1000);
  return { tahun: d.getUTCFullYear(), bulan: d.getUTCMonth() + 1, hari: d.getUTCDate(), hariMinggu: d.getUTCDay() };
}

// Awal hari (00.00 WIB) untuk waktu tertentu, dalam milidetik UTC.
export function awalHariWIB(ms) {
  const { tahun, bulan, hari } = bagianWIB(ms);
  return Date.UTC(tahun, bulan - 1, hari) - 7 * 3600 * 1000;
}

// Tanggal tanur berikutnya/terakhir (hari tertentu dalam minggu) dihitung dari `ms`.
export function hariTanurBerikutnya(ms, hariTarget) {
  const { hariMinggu } = bagianWIB(ms);
  let selisih = (hariTarget - hariMinggu + 7) % 7;
  if (selisih === 0) selisih = 7;
  return awalHariWIB(ms) + selisih * 86400000;
}

export function hariTanurTerakhir(ms, hariTarget) {
  const { hariMinggu } = bagianWIB(ms);
  const selisih = (hariMinggu - hariTarget + 7) % 7;
  return awalHariWIB(ms) - selisih * 86400000;
}

export function sensorHP(hp) {
  const bersih = String(hp || '').replace(/\D/g, '');
  if (bersih.length < 6) return bersih;
  return `${bersih.slice(0, 4)}••••${bersih.slice(-4)}`;
}
