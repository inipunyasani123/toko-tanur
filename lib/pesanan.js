// Fungsi murni untuk pesanan: kode, status, ringkasan penjualan, dan pesanan contoh.
import { site, statusPesanan, cariProduk } from './data';
import { hargaVarian, beratVarian, labelVarian } from './katalog';
import { hitungOngkir, zonaUntuk } from './ongkir';
import { bagianWIB, awalHariWIB, kunciHariWIB } from './format';

export function indeksStatus(id) {
  return statusPesanan.findIndex((s) => s.id === id);
}

export function labelStatus(id) {
  return statusPesanan.find((s) => s.id === id)?.label || id;
}

export function buatKode(nomor, ms) {
  const { tahun, bulan } = bagianWIB(ms);
  const yy = String(tahun).slice(-2);
  const mm = String(bulan).padStart(2, '0');
  return `${site.kodePesanan}-${yy}${mm}-${String(nomor).padStart(4, '0')}`;
}

export function normalKode(kode) {
  return String(kode || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}

export function waktuStatus(pesanan, statusId) {
  return pesanan.riwayat.find((r) => r.status === statusId)?.waktu || null;
}

// Pindah status. Maju beberapa langkah sekaligus: langkah yang dilewati ikut dicatat
// dengan waktu yang sama. Mundur: catatan sesudahnya dihapus.
export function terapkanStatus(pesanan, statusBaru, waktu) {
  const target = indeksStatus(statusBaru);
  if (target < 0) return pesanan;
  const riwayat = [];
  for (let i = 0; i <= target; i++) {
    const id = statusPesanan[i].id;
    const lama = pesanan.riwayat.find((r) => r.status === id);
    riwayat.push(lama || { status: id, waktu });
  }
  let resi = pesanan.resi;
  if (target >= indeksStatus('dikirim') && !resi) {
    resi = `CONTOH-${normalKode(pesanan.kode).slice(-8)}${pesanan.kirim.layanan === 'kilat' ? 'K' : 'R'}`;
  }
  if (target < indeksStatus('dikirim')) resi = null;
  return { ...pesanan, status: statusBaru, riwayat, resi };
}

export function hitungItem(slug, glasirId, ukuranId, qty) {
  const p = cariProduk(slug);
  return {
    slug,
    nama: p.nama,
    bentuk: p.bentuk,
    glasir: glasirId,
    ukuran: ukuranId,
    label: labelVarian(p, glasirId, ukuranId),
    harga: hargaVarian(p, glasirId, ukuranId),
    berat: beratVarian(p, ukuranId),
    qty,
  };
}

export function rakitPesanan({ kode, dibuat, pembeli, items, layanan, kayu, metode, contoh = false }) {
  const subtotal = items.reduce((n, it) => n + it.harga * it.qty, 0);
  const beratProduk = items.reduce((n, it) => n + it.berat * it.qty, 0);
  const o = hitungOngkir({ beratProduk, provinsi: pembeli.provinsi, layanan, kayu });
  return {
    kode,
    dibuat,
    status: 'menunggu',
    riwayat: [{ status: 'menunggu', waktu: dibuat }],
    pembeli,
    items,
    kirim: {
      layanan,
      zona: o.zona?.id || null,
      zonaNama: o.zona ? `${o.zona.nama} · ${o.zona.cakupan}` : '',
      estimasi: o.estimasi,
      perKg: o.perKg,
      kgTagih: o.kgTagih,
      beratProduk,
      beratKemasan: o.beratKemasan,
      beratKayu: o.beratKayu,
      beratTotal: o.beratTotal,
      ongkir: o.ongkir,
      kayu,
      biayaKayu: o.biayaKayu,
    },
    bayar: { metode },
    subtotal,
    total: subtotal + o.ongkir + o.biayaKayu,
    resi: null,
    contoh,
  };
}

// Penjualan dihitung dari pesanan yang sudah dibayar, per hari kalender WIB.
export function ringkasPenjualan(daftar, sekarang) {
  const iDibayar = indeksStatus('dibayar');
  const hariIni = awalHariWIB(sekarang);
  const hari = [];
  for (let i = 6; i >= 0; i--) {
    const awal = hariIni - i * 86400000;
    hari.push({ kunci: kunciHariWIB(awal + 3600000), awal, total: 0, jumlah: 0 });
  }
  const peta = Object.fromEntries(hari.map((h) => [h.kunci, h]));
  let menunggu = 0;
  for (const p of daftar) {
    if (indeksStatus(p.status) < iDibayar) {
      menunggu += 1;
      continue;
    }
    const t = waktuStatus(p, 'dibayar') || p.dibuat;
    const h = peta[kunciHariWIB(t)];
    if (h) {
      h.total += p.total;
      h.jumlah += 1;
    }
  }
  const hariIniData = hari[hari.length - 1];
  return {
    hari,
    hariIni: { total: hariIniData.total, jumlah: hariIniData.jumlah },
    tujuhHari: {
      total: hari.reduce((n, h) => n + h.total, 0),
      jumlah: hari.reduce((n, h) => n + h.jumlah, 0),
    },
    menunggu,
  };
}

// Pesanan contoh, dibuat relatif terhadap waktu kunjungan pertama.
export const NOMOR_AWAL_CONTOH = 38;

export function pesananContoh(sekarang) {
  const hari = (n, jam, menit) => awalHariWIB(sekarang) - n * 86400000 + (jam * 60 + menit) * 60000;
  const menitLalu = (m) => sekarang - m * 60000;
  const rencana = [
    {
      dibuat: hari(9, 10, 12),
      pembeli: { nama: 'Rara Wulandari', hp: '081200000138', provinsi: 'Jawa Timur', kota: 'Kota Surabaya', alamat: 'Jl. Kenanga No. 8 (alamat contoh)', kodePos: '60241' },
      items: [hitungItem('mangkuk-nasi-genggam', 'seladon', 'kecil', 4), hitungItem('piring-makan-teras', 'seladon', 'besar', 4)],
      layanan: 'reguler', kayu: false, metode: 'transfer',
      langkah: [['dibayar', hari(9, 11, 40)], ['dikemas', hari(8, 9, 15)], ['dikirim', hari(8, 15, 30)], ['selesai', hari(6, 13, 5)]],
    },
    {
      dibuat: hari(5, 19, 47),
      pembeli: { nama: 'Bagus Santoso', hp: '081300000239', provinsi: 'Jawa Barat', kota: 'Kota Bandung', alamat: 'Jl. Melati Raya No. 21 (alamat contoh)', kodePos: '40115' },
      items: [hitungItem('teko-teh-sore', 'tenmoku', 'teko-2-gelas', 1)],
      layanan: 'kilat', kayu: true, metode: 'qris',
      langkah: [['dibayar', hari(5, 19, 52)], ['dikemas', hari(4, 10, 2)], ['dikirim', hari(3, 14, 20)]],
    },
    {
      dibuat: hari(2, 8, 31),
      pembeli: { nama: 'Nadia Kurniasih', hp: '085200000340', provinsi: 'Sulawesi Selatan', kota: 'Kota Makassar', alamat: 'Jl. Flamboyan No. 3 (alamat contoh)', kodePos: '90111' },
      items: [hitungItem('set-sarapan', 'abu', 'berdua', 1), hitungItem('cawan-cocol', 'abu', 'set-4', 1)],
      layanan: 'reguler', kayu: true, metode: 'ewallet',
      langkah: [['dibayar', hari(2, 9, 4)], ['dikemas', hari(1, 11, 26)]],
    },
    {
      dibuat: menitLalu(185),
      pembeli: { nama: 'Fikri Ramadhan', hp: '087700000441', provinsi: 'Bali', kota: 'Kota Denpasar', alamat: 'Jl. Cempaka No. 15 (alamat contoh)', kodePos: '80223' },
      items: [hitungItem('cangkir-kopi-seduh', 'kobalt', 'set-2', 1), hitungItem('mug-lembur', 'tenmoku', 'standar', 1)],
      layanan: 'reguler', kayu: false, metode: 'transfer',
      langkah: [['dibayar', menitLalu(150)]],
    },
    {
      dibuat: menitLalu(26),
      pembeli: { nama: 'Wening Pratiwi', hp: '081900000542', provinsi: 'DI Yogyakarta', kota: 'Kota Yogyakarta', alamat: 'Jl. Anggrek No. 40 (alamat contoh)', kodePos: '55223' },
      items: [hitungItem('vas-kuncup', 'seladon', 'sedang', 1), hitungItem('piring-kecil-jajan', 'abu', 'set-4', 1)],
      layanan: 'reguler', kayu: false, metode: 'qris',
      langkah: [],
    },
  ];
  return rencana.map((r, i) => {
    let p = rakitPesanan({
      kode: buatKode(NOMOR_AWAL_CONTOH + i, r.dibuat),
      dibuat: r.dibuat,
      pembeli: r.pembeli,
      items: r.items,
      layanan: r.layanan,
      kayu: r.kayu,
      metode: r.metode,
      contoh: true,
    });
    for (const [status, waktu] of r.langkah) p = terapkanStatus(p, status, waktu);
    return p;
  });
}

export function cocokkanHP(pesanan, empatDigit) {
  const hp = String(pesanan.pembeli.hp || '').replace(/\D/g, '');
  return hp.slice(-4) === String(empatDigit || '').replace(/\D/g, '');
}

export { zonaUntuk };
