// Foto keramik (domain publik/CC0) untuk katalog, halaman produk, keranjang, dan beranda.
// Tokonya fiktif: foto ini gambaran bentuk dan suasana, bukan keping yang akan dikirim.
// Sumber tiap berkas dicatat di public/images/SUMBER.md.
const f = (berkas, alt, w = 1400) => ({ src: `/images/${berkas}.webp`, w, h: w, alt });

export const fotoProduk = {
  'mangkuk-nasi-genggam': f('foto-nasi-genggam', 'Mangkuk keramik berglasir hijau pucat dengan kaki tinggi'),
  'mangkuk-mi-kuah': f('foto-mi-kuah', 'Mangkuk lebar keramik berglasir seladon dilihat dari atas'),
  'mangkuk-saji-panen': f('foto-saji-panen', 'Mangkuk keramik berglasir krem retak halus dengan kaki rendah'),
  'cawan-cocol': f('foto-cawan', 'Mangkuk kecil keramik berglasir cokelat tua mengilap'),
  'piring-makan-teras': f('foto-piring-teras', 'Piring keramik berglasir hijau seladon dengan tepi tipis'),
  'piring-kecil-jajan': f('foto-piring-jajan', 'Piring kecil keramik berglasir putih gading'),
  'piring-saji-kenduri': f('foto-piring-kenduri', 'Piring saji keramik hitam dengan pola titik putih'),
  'cangkir-kopi-seduh': f('foto-cangkir-kopi', 'Cangkir keramik berglasir gelap dengan kaki kecil'),
  'gelas-teh-tegukan': f('foto-gelas-teh', 'Gelas teh keramik berglasir hijau zaitun dan kaki tanpa glasir'),
  'mug-lembur': f('foto-mug-abu', 'Mug keramik putih berbintik di atas meja kayu', 680),
  'teko-teh-sore': f('foto-teko-tenmoku', 'Teko keramik gelap bertepi kemerahan di atas meja'),
  'vas-kuncup': f('foto-vas-kuncup', 'Vas keramik bulat berglasir biru kelabu dengan mulut kecil'),
  'vas-jambangan': f('foto-vas-jambangan', 'Vas keramik besar berbahu lebar berglasir putih kehijauan'),
  'set-sarapan': f('foto-set-sarapan', 'Cangkir berkaki di atas piring alas keramik berglasir seladon'),
};

// Beranda: foto yang menemani pilihan glasir.
export const fotoGlasir = {
  seladon: { ...fotoProduk['piring-makan-teras'], nama: 'Piring seladon' },
  kobalt: { ...fotoProduk['vas-kuncup'], nama: 'Vas biru' },
  tenmoku: { ...fotoProduk['cangkir-kopi-seduh'], nama: 'Cangkir gelap' },
  abu: { ...fotoProduk['piring-kecil-jajan'], nama: 'Piring gading' },
};
