// Hitung ongkir dari tabel contoh tarif (zona × berat). Bukan tarif kurir sungguhan.
import { zonaOngkir, kemasan } from './data';

export function zonaUntuk(namaProvinsi) {
  return zonaOngkir.find((z) => z.provinsi.includes(namaProvinsi)) || null;
}

export function beratKemasan(beratProduk) {
  if (!beratProduk) return 0;
  return Math.max(kemasan.minimum, Math.round(beratProduk * kemasan.persen));
}

export function hitungOngkir({ beratProduk, provinsi, layanan = 'reguler', kayu = false }) {
  const zona = zonaUntuk(provinsi);
  const kemas = beratKemasan(beratProduk);
  const beratKayu = kayu ? kemasan.kayu.berat : 0;
  const total = beratProduk + kemas + beratKayu;
  const kgTagih = Math.max(1, Math.ceil(total / 1000));
  const biayaKayu = kayu ? kemasan.kayu.biaya : 0;
  const tarif = zona ? zona.layanan[layanan] : null;
  return {
    zona,
    beratProduk,
    beratKemasan: kemas,
    beratKayu,
    beratTotal: total,
    kgTagih,
    tersedia: Boolean(tarif),
    perKg: tarif ? tarif.perKg : 0,
    estimasi: tarif ? tarif.estimasi : '',
    ongkir: tarif ? kgTagih * tarif.perKg : 0,
    biayaKayu,
  };
}

// Packing kayu disarankan untuk keping besar/rawan atau tujuan jauh.
export function sarankanKayu(items, zona) {
  const rawan = items.some((it) => ['teko', 'vas-besar', 'set', 'mangkuk-saji', 'piring-oval'].includes(it.bentuk));
  const jauh = zona && (zona.id === 'z3' || zona.id === 'z4');
  return rawan || jauh;
}
