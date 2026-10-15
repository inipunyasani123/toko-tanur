// Semua isi toko demo Tanur ada di sini. Tanur adalah toko fiktif.
// Harga, stok, tarif ongkir, dan kebijakan di bawah ini contoh untuk demo.

export const site = {
  nama: 'Tanur',
  slug: 'tanur',
  url: 'https://toko-tanur.pintuweb.id',
  judul: 'Tanur — Keramik buatan tangan',
  tagline: 'Keramik buatan tangan untuk meja sehari-hari',
  deskripsi:
    'Mangkuk, piring, cangkir, teko, dan vas stoneware yang dibentuk di meja putar dan dibakar per angkatan di tanur 1.240\u00a0°C. Toko online demo buatan PintuWeb.',
  asal: 'Jawa Timur',
  kodePesanan: 'TNR',
  jamLayanan: 'Senin–Sabtu, 09.00–17.00 WIB',
  batasKemas: '14.00 WIB',
  batasBayarJam: 24,
  // Tanur dibuka tiap Kamis (0 = Minggu ... 4 = Kamis).
  hariTanur: 4,
  angkatanTerbaru: 31,
  suhuPuncak: 1240,
};

export const nav = [
  { href: '/koleksi', label: 'Koleksi' },
  { href: '/#proses', label: 'Proses' },
  { href: '/bantuan', label: 'Bantuan' },
  { href: '/lacak', label: 'Lacak pesanan' },
];

export const kategori = [
  { id: 'mangkuk', nama: 'Mangkuk', ringkas: 'Nasi, mi, sampai saji bersama' },
  { id: 'piring', nama: 'Piring', ringkas: 'Makan, kue, dan saji' },
  { id: 'cangkir-gelas', nama: 'Cangkir & gelas', ringkas: 'Kopi, teh, dan mug kerja' },
  { id: 'teko', nama: 'Teko', ringkas: 'Teh tubruk tanpa saringan' },
  { id: 'vas', nama: 'Vas', ringkas: 'Setangkai sampai seikat' },
  { id: 'set-makan', nama: 'Set makan', ringkas: 'Satu glasir, satu kotak' },
];

// Warna dipakai untuk ubin uji glasir dan ilustrasi produk.
export const glasir = [
  {
    id: 'seladon',
    nama: 'Seladon Teduh',
    kode: 'GL-01',
    warna: '#9fb4a0',
    gelap: '#6f8b78',
    tepi: '#d2ddcc',
    kilap: 'Mengilap',
    catatan: 'Hijau keabuan yang menebal di cekungan, jadi bagian dasar tampak lebih tua.',
  },
  {
    id: 'kobalt',
    nama: 'Biru Kobalt',
    kode: 'GL-02',
    warna: '#2f4d7e',
    gelap: '#1f3559',
    tepi: '#86a2cf',
    kilap: 'Mengilap',
    catatan: 'Biru pekat yang memudar jadi pucat di bibir dan tepi yang tipis.',
  },
  {
    id: 'tenmoku',
    nama: 'Tenmoku Karat',
    kode: 'GL-03',
    warna: '#4a2d20',
    gelap: '#2b1912',
    tepi: '#ad5f2f',
    kilap: 'Setengah kilap',
    catatan: 'Cokelat kehitaman dengan semburat karat di bagian yang glasirnya tipis.',
  },
  {
    id: 'abu',
    nama: 'Abu Kapur',
    kode: 'GL-04',
    warna: '#e7dfd0',
    gelap: '#c9bca6',
    tepi: '#faf6ee',
    kilap: 'Doff',
    catatan: 'Putih susu yang doff, dengan bintik besi kecil yang muncul dari tanahnya.',
  },
];

// Perawatan yang berlaku untuk semua keping.
export const perawatanUmum = [
  'Cuci dengan sabun cuci piring biasa dan spons lembut. Hindari sabut kawat.',
  'Hindari perubahan suhu mendadak, misalnya dari kulkas langsung dituang air mendidih.',
  'Kaki tanpa glasir menyerap air. Keringkan dulu sebelum disimpan bertumpuk.',
  'Boleh masuk microwave untuk menghangatkan. Jangan dipanaskan dalam keadaan kosong atau di atas api langsung.',
];

export const catatanVariasi =
  'Setiap keping dibentuk dan diglasir dengan tangan. Ukurannya bisa selisih sampai 3 mm, dan aliran glasir tidak pernah persis sama. Gambar di halaman ini contoh warna, bukan keping yang akan kamu terima.';

// stok: { [glasir]: [stok ukuran pertama, stok ukuran kedua, ...] } mengikuti urutan `ukuran`.
// tambahanGlasir: selisih harga untuk glasir tertentu (pigmen kobalt lebih mahal).
export const produk = [
  {
    slug: 'mangkuk-nasi-genggam',
    nama: 'Mangkuk Nasi Genggam',
    kategori: 'mangkuk',
    bentuk: 'mangkuk',
    ringkas: 'Mangkuk nasi berkaki tinggi yang pas di telapak tangan.',
    deskripsi:
      'Dindingnya sedikit tebal di bagian bawah supaya nasi panas tidak langsung terasa di tangan, lalu menipis ke arah bibir. Kakinya dibiarkan tanpa glasir sehingga warna tanah aslinya kelihatan.',
    glasir: ['seladon', 'kobalt', 'tenmoku', 'abu'],
    tambahanGlasir: { kobalt: 5000 },
    ukuran: [
      { id: 'kecil', label: 'Ø 12 cm', detail: 'Tinggi 6,5 cm · isi ±350 ml', harga: 65000, berat: 320 },
      { id: 'besar', label: 'Ø 14 cm', detail: 'Tinggi 7,5 cm · isi ±480 ml', harga: 78000, berat: 410 },
    ],
    stok: { seladon: [9, 4], kobalt: [3, 0], tenmoku: [6, 2], abu: [12, 7] },
    angkatan: 31,
    terjual: 214,
    foto: [],
  },
  {
    slug: 'mangkuk-mi-kuah',
    nama: 'Mangkuk Mi Kuah',
    kategori: 'mangkuk',
    bentuk: 'mangkuk-lebar',
    ringkas: 'Mangkuk lebar untuk mi berkuah, soto, atau bakso.',
    deskripsi:
      'Bibirnya melebar supaya sumpit dan sendok leluasa, dengan cekungan dalam yang menampung kuah tanpa tumpah saat dibawa dari dapur. Glasir mengumpul lebih tebal di dasar, jadi warnanya sedikit lebih gelap di tengah.',
    glasir: ['seladon', 'tenmoku', 'abu'],
    tambahanGlasir: {},
    ukuran: [{ id: 'standar', label: 'Ø 18 cm', detail: 'Tinggi 8 cm · isi ±900 ml', harga: 135000, berat: 640 }],
    stok: { seladon: [5], tenmoku: [2], abu: [8] },
    angkatan: 30,
    terjual: 121,
    foto: [],
  },
  {
    slug: 'mangkuk-saji-panen',
    nama: 'Mangkuk Saji Panen',
    kategori: 'mangkuk',
    bentuk: 'mangkuk-saji',
    ringkas: 'Mangkuk saji untuk sayur, salad, atau buah di tengah meja.',
    deskripsi:
      'Ukurannya cukup untuk sayur berempat. Bagian luarnya hanya diglasir setengah, sisanya dibiarkan bertekstur bekas putaran jari sehingga tidak licin saat diangkat.',
    glasir: ['kobalt', 'abu'],
    tambahanGlasir: { kobalt: 10000 },
    ukuran: [
      { id: 'sedang', label: 'Ø 22 cm', detail: 'Tinggi 9 cm', harga: 195000, berat: 980 },
      { id: 'besar', label: 'Ø 26 cm', detail: 'Tinggi 10 cm', harga: 245000, berat: 1350 },
    ],
    stok: { kobalt: [2, 1], abu: [4, 3] },
    angkatan: 31,
    terjual: 64,
    foto: [],
  },
  {
    slug: 'cawan-cocol',
    nama: 'Cawan Cocol',
    kategori: 'mangkuk',
    bentuk: 'cawan',
    ringkas: 'Cawan mungil untuk sambal, kecap, atau garam.',
    deskripsi:
      'Cawan Ø 8 cm yang muat kira-kira dua sendok sambal. Satu set berisi empat cawan dari angkatan yang sama, jadi warnanya serasi walau tidak kembar.',
    glasir: ['seladon', 'kobalt', 'tenmoku', 'abu'],
    tambahanGlasir: {},
    ukuran: [
      { id: 'satuan', label: 'Satuan', detail: 'Ø 8 cm · tinggi 3 cm', harga: 35000, berat: 90 },
      { id: 'set-4', label: 'Set isi 4', detail: '4 cawan Ø 8 cm', harga: 125000, berat: 380 },
    ],
    stok: { seladon: [14, 3], kobalt: [10, 2], tenmoku: [0, 0], abu: [16, 4] },
    angkatan: 29,
    terjual: 188,
    foto: [],
  },
  {
    slug: 'piring-makan-teras',
    nama: 'Piring Makan Teras',
    kategori: 'piring',
    bentuk: 'piring',
    ringkas: 'Piring makan bertepi landai untuk nasi dan lauk sehari-hari.',
    deskripsi:
      'Tepinya naik pelan sehingga kuah tidak mudah luber, dan permukaannya cukup lebar untuk nasi, sayur, dan lauk tanpa saling menumpuk.',
    glasir: ['seladon', 'tenmoku', 'abu'],
    tambahanGlasir: {},
    ukuran: [
      { id: 'sedang', label: 'Ø 22 cm', detail: 'Tinggi 2,5 cm', harga: 95000, berat: 560 },
      { id: 'besar', label: 'Ø 26 cm', detail: 'Tinggi 3 cm', harga: 115000, berat: 760 },
    ],
    stok: { seladon: [6, 4], tenmoku: [3, 2], abu: [9, 5] },
    angkatan: 30,
    terjual: 143,
    foto: [],
  },
  {
    slug: 'piring-kecil-jajan',
    nama: 'Piring Kecil Jajan',
    kategori: 'piring',
    bentuk: 'piring-kecil',
    ringkas: 'Piring kecil untuk kue, gorengan, atau alas cangkir.',
    deskripsi:
      'Ukuran Ø 16 cm yang serba guna: wadah kue basah, piring roti waktu sarapan, atau tatakan teko di meja.',
    glasir: ['seladon', 'kobalt', 'tenmoku', 'abu'],
    tambahanGlasir: { kobalt: 5000 },
    ukuran: [
      { id: 'satuan', label: 'Satuan', detail: 'Ø 16 cm · tinggi 2 cm', harga: 58000, berat: 260 },
      { id: 'set-4', label: 'Set isi 4', detail: '4 piring Ø 16 cm', harga: 210000, berat: 1060 },
    ],
    stok: { seladon: [8, 2], kobalt: [5, 1], tenmoku: [7, 2], abu: [11, 3] },
    angkatan: 31,
    terjual: 158,
    foto: [],
  },
  {
    slug: 'piring-saji-kenduri',
    nama: 'Piring Saji Kenduri',
    kategori: 'piring',
    bentuk: 'piring-oval',
    ringkas: 'Piring oval besar untuk ikan bakar, ayam, atau nasi liwet.',
    deskripsi:
      'Dibentuk dari lempengan tanah yang ditekan ke cetakan kayu, lalu tepinya diangkat dengan tangan. Panjangnya 32 cm, cukup untuk satu ekor ikan bakar ukuran sedang.',
    glasir: ['seladon', 'abu'],
    tambahanGlasir: {},
    ukuran: [{ id: 'standar', label: '32 × 22 cm', detail: 'Tinggi 3,5 cm', harga: 285000, berat: 1250 }],
    stok: { seladon: [2], abu: [3] },
    angkatan: 29,
    terjual: 47,
    foto: [],
  },
  {
    slug: 'cangkir-kopi-seduh',
    nama: 'Cangkir Kopi Seduh',
    kategori: 'cangkir-gelas',
    bentuk: 'cangkir',
    ringkas: 'Cangkir 200 ml berpegangan untuk kopi tubruk atau seduhan manual.',
    deskripsi:
      'Pegangannya ditarik dari gumpalan tanah, bukan dicetak, dan muat dua jari. Dindingnya tebal sehingga kopi tetap hangat lebih lama.',
    glasir: ['kobalt', 'tenmoku', 'abu'],
    tambahanGlasir: { kobalt: 5000 },
    ukuran: [
      { id: 'satuan', label: 'Satuan', detail: 'Isi 200 ml · tinggi 7 cm', harga: 85000, berat: 280 },
      { id: 'set-2', label: 'Set isi 2', detail: '2 cangkir 200 ml', harga: 160000, berat: 580 },
    ],
    stok: { kobalt: [4, 1], tenmoku: [7, 3], abu: [6, 2] },
    angkatan: 31,
    terjual: 176,
    foto: [],
  },
  {
    slug: 'gelas-teh-tegukan',
    nama: 'Gelas Teh Tegukan',
    kategori: 'cangkir-gelas',
    bentuk: 'gelas',
    ringkas: 'Gelas teh tanpa pegangan, hangat digenggam dua tangan.',
    deskripsi:
      'Tanpa pegangan, jadi gelas ini digenggam langsung dan kamu bisa merasakan kapan teh sudah cukup hangat untuk diminum. Isinya 250 ml.',
    glasir: ['seladon', 'kobalt', 'tenmoku'],
    tambahanGlasir: { kobalt: 5000 },
    ukuran: [
      { id: 'satuan', label: 'Satuan', detail: 'Isi 250 ml · tinggi 9 cm', harga: 75000, berat: 240 },
      { id: 'set-4', label: 'Set isi 4', detail: '4 gelas 250 ml', harga: 280000, berat: 1000 },
    ],
    stok: { seladon: [6, 2], kobalt: [3, 0], tenmoku: [8, 2] },
    angkatan: 30,
    terjual: 132,
    foto: [],
  },
  {
    slug: 'mug-lembur',
    nama: 'Mug Lembur',
    kategori: 'cangkir-gelas',
    bentuk: 'mug',
    ringkas: 'Mug 350 ml untuk teh panjang di meja kerja.',
    deskripsi:
      'Badannya lurus dan berat di bawah, jadi tidak mudah terguling di meja yang penuh kertas. Pegangannya muat empat jari.',
    glasir: ['seladon', 'kobalt', 'tenmoku', 'abu'],
    tambahanGlasir: { kobalt: 5000 },
    ukuran: [{ id: 'standar', label: '350 ml', detail: 'Ø 8,5 cm · tinggi 10 cm', harga: 98000, berat: 380 }],
    stok: { seladon: [5], kobalt: [2], tenmoku: [4], abu: [7] },
    angkatan: 31,
    terjual: 149,
    foto: [{ src: '/images/foto-mug-abu.webp', w: 680, h: 680, glasir: 'abu', alt: 'Mug keramik putih berbintik di atas meja kayu' }],
  },
  {
    slug: 'teko-teh-sore',
    nama: 'Teko Teh Sore',
    kategori: 'teko',
    bentuk: 'teko',
    ringkas: 'Teko 600 ml dengan lubang saringan di dalam badannya.',
    deskripsi:
      'Lubang saringan dibuat satu per satu di dinding dalam, jadi daun teh tertahan tanpa saringan tambahan. Tutupnya diberi pengunci kecil supaya tidak jatuh saat menuang.',
    glasir: ['seladon', 'tenmoku'],
    tambahanGlasir: {},
    ukuran: [
      { id: 'teko', label: 'Teko saja', detail: 'Isi 600 ml', harga: 385000, berat: 850 },
      { id: 'teko-2-gelas', label: 'Teko + 2 gelas', detail: 'Teko 600 ml dan 2 Gelas Teh Tegukan', harga: 525000, berat: 1330 },
    ],
    stok: { seladon: [2, 1], tenmoku: [3, 1] },
    angkatan: 30,
    terjual: 58,
    foto: [{ src: '/images/foto-teko-tenmoku.webp', w: 640, h: 640, glasir: 'tenmoku', alt: 'Teko keramik gelap bertepi kemerahan di atas meja' }],
    perawatan: [
      'Bilas dengan air panas sebelum dipakai pertama kali.',
      'Keringkan dengan tutup terbuka supaya tidak lembap di dalam.',
    ],
  },
  {
    slug: 'vas-kuncup',
    nama: 'Vas Kuncup',
    kategori: 'vas',
    bentuk: 'vas-kecil',
    ringkas: 'Vas berleher kecil untuk setangkai bunga atau ranting.',
    deskripsi:
      'Lehernya sempit sehingga setangkai bunga bisa berdiri tegak tanpa perlu dirangkai. Bagian dalam diglasir penuh, jadi aman diisi air.',
    glasir: ['seladon', 'kobalt', 'abu'],
    tambahanGlasir: {},
    ukuran: [
      { id: 'kecil', label: 'Tinggi 12 cm', detail: 'Ø badan 7 cm', harga: 89000, berat: 300 },
      { id: 'sedang', label: 'Tinggi 18 cm', detail: 'Ø badan 9 cm', harga: 139000, berat: 520 },
    ],
    stok: { seladon: [5, 2], kobalt: [4, 1], abu: [6, 0] },
    angkatan: 31,
    terjual: 97,
    foto: [],
    perawatan: ['Ganti airnya tiap dua hari supaya dasar vas tidak berlumut.'],
  },
  {
    slug: 'vas-jambangan',
    nama: 'Vas Jambangan',
    kategori: 'vas',
    bentuk: 'vas-besar',
    ringkas: 'Vas besar berbahu lebar untuk daun, ranting, atau bunga kering.',
    deskripsi:
      'Dibentuk dalam dua bagian lalu disambung di meja putar. Garis sambungannya sengaja kami biarkan terlihat. Tingginya 28 cm.',
    glasir: ['tenmoku', 'abu'],
    tambahanGlasir: {},
    ukuran: [{ id: 'standar', label: 'Tinggi 28 cm', detail: 'Ø bahu 20 cm', harga: 345000, berat: 2100 }],
    stok: { tenmoku: [1], abu: [2] },
    angkatan: 29,
    terjual: 33,
    foto: [],
    perawatan: ['Ganti airnya tiap dua hari supaya dasar vas tidak berlumut.'],
  },
  {
    slug: 'set-sarapan',
    nama: 'Set Sarapan',
    kategori: 'set-makan',
    bentuk: 'set',
    ringkas: 'Mangkuk, piring kecil, dan cangkir dalam satu glasir.',
    deskripsi:
      'Tiap porsi berisi satu Mangkuk Nasi Genggam Ø 12 cm, satu Piring Kecil Jajan, dan satu Cangkir Kopi Seduh. Lebih hemat daripada membeli satuan, dan dikemas dalam satu kotak bersekat.',
    glasir: ['seladon', 'abu'],
    tambahanGlasir: {},
    ukuran: [
      { id: 'berdua', label: 'Untuk 2 orang', detail: '6 keping', harga: 395000, berat: 1760 },
      { id: 'bertiga', label: 'Untuk 3 orang', detail: '9 keping', harga: 575000, berat: 2640 },
    ],
    stok: { seladon: [3, 1], abu: [4, 2] },
    angkatan: 31,
    terjual: 71,
    foto: [],
  },
];

// Catatan khusus per glasir yang ikut tampil di perawatan.
export const perawatanGlasir = {
  tenmoku: 'Semburat karat di tepi yang tipis adalah sifat glasir tenmoku, bukan cacat.',
  abu: 'Garis abu-abu bekas sendok di glasir doff bisa dihapus dengan pasta soda kue.',
};

// Contoh tarif ongkir dari studio (Jawa Timur). Bukan tarif kurir sungguhan.
export const zonaOngkir = [
  {
    id: 'z1',
    nama: 'Zona 1',
    cakupan: 'Jawa Timur',
    provinsi: ['Jawa Timur'],
    layanan: {
      reguler: { perKg: 8000, estimasi: '1–2 hari' },
      kilat: { perKg: 15000, estimasi: '1 hari' },
    },
  },
  {
    id: 'z2',
    nama: 'Zona 2',
    cakupan: 'Jawa lainnya dan Bali',
    provinsi: ['DKI Jakarta', 'Jawa Barat', 'Banten', 'Jawa Tengah', 'DI Yogyakarta', 'Bali'],
    layanan: {
      reguler: { perKg: 12000, estimasi: '2–3 hari' },
      kilat: { perKg: 22000, estimasi: '1–2 hari' },
    },
  },
  {
    id: 'z3',
    nama: 'Zona 3',
    cakupan: 'Sumatra, Kalimantan, Sulawesi, NTB',
    provinsi: [
      'Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Kepulauan Riau', 'Jambi', 'Sumatera Selatan',
      'Kepulauan Bangka Belitung', 'Bengkulu', 'Lampung', 'Nusa Tenggara Barat', 'Kalimantan Barat',
      'Kalimantan Tengah', 'Kalimantan Selatan', 'Kalimantan Timur', 'Kalimantan Utara', 'Sulawesi Utara',
      'Gorontalo', 'Sulawesi Tengah', 'Sulawesi Barat', 'Sulawesi Selatan', 'Sulawesi Tenggara',
    ],
    layanan: {
      reguler: { perKg: 24000, estimasi: '3–5 hari' },
      kilat: { perKg: 41000, estimasi: '2–3 hari' },
    },
  },
  {
    id: 'z4',
    nama: 'Zona 4',
    cakupan: 'NTT, Maluku, Papua',
    provinsi: [
      'Nusa Tenggara Timur', 'Maluku', 'Maluku Utara', 'Papua', 'Papua Barat', 'Papua Barat Daya',
      'Papua Tengah', 'Papua Pegunungan', 'Papua Selatan',
    ],
    layanan: {
      reguler: { perKg: 39000, estimasi: '5–8 hari' },
      kilat: null,
    },
  },
];

export const layananKirim = [
  { id: 'reguler', nama: 'Reguler', ket: 'Lebih hemat' },
  { id: 'kilat', nama: 'Kilat', ket: 'Lebih cepat' },
];

export const kemasan = {
  // Kardus dobel + kertas sarang lebah: 25% dari berat produk, minimal 300 g.
  persen: 0.25,
  minimum: 300,
  kayu: { biaya: 35000, berat: 1200 },
};

export const metodeBayar = [
  {
    id: 'transfer',
    nama: 'Transfer bank',
    ket: 'Nomor rekening contoh muncul setelah pesanan dibuat.',
    instruksi: 'Transfer ke rekening contoh 000-0000-000 a.n. Tanur Demo. Nomor ini tidak aktif, jadi jangan benar-benar mentransfer.',
  },
  {
    id: 'qris',
    nama: 'QRIS',
    ket: 'Kode QR contoh muncul setelah pesanan dibuat.',
    instruksi: 'Di toko sungguhan, kode QR muncul di sini untuk dipindai dari aplikasi bank atau dompet digital. Di demo ini tidak ada kode yang bisa dipindai.',
  },
  {
    id: 'ewallet',
    nama: 'Dompet digital',
    ket: 'Tautan bayar contoh, tidak menarik saldo apa pun.',
    instruksi: 'Di toko sungguhan, tombol bayar membuka aplikasi dompet digital. Di demo ini tidak ada saldo yang ditarik.',
  },
];

export const statusPesanan = [
  { id: 'menunggu', label: 'Menunggu pembayaran', ket: 'Pesanan dibuat dan menunggu dibayar.' },
  { id: 'dibayar', label: 'Dibayar', ket: 'Pembayaran diterima.' },
  { id: 'dikemas', label: 'Dikemas', ket: 'Tiap keping dibungkus dan diberi sekat.' },
  { id: 'dikirim', label: 'Dikirim', ket: 'Paket sudah di tangan kurir.' },
  { id: 'selesai', label: 'Selesai', ket: 'Paket diterima.' },
];

export const provinsi = [
  'Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Kepulauan Riau', 'Jambi', 'Sumatera Selatan',
  'Kepulauan Bangka Belitung', 'Bengkulu', 'Lampung', 'DKI Jakarta', 'Jawa Barat', 'Banten', 'Jawa Tengah',
  'DI Yogyakarta', 'Jawa Timur', 'Bali', 'Nusa Tenggara Barat', 'Nusa Tenggara Timur', 'Kalimantan Barat',
  'Kalimantan Tengah', 'Kalimantan Selatan', 'Kalimantan Timur', 'Kalimantan Utara', 'Sulawesi Utara',
  'Gorontalo', 'Sulawesi Tengah', 'Sulawesi Barat', 'Sulawesi Selatan', 'Sulawesi Tenggara', 'Maluku',
  'Maluku Utara', 'Papua', 'Papua Barat', 'Papua Barat Daya', 'Papua Tengah', 'Papua Pegunungan', 'Papua Selatan',
];

// Kurva bakar glasir (contoh jadwal tanur), dipakai di beranda.
export const kurvaBakar = [
  { jam: 0, suhu: 30, ket: 'Tanur ditutup' },
  { jam: 2, suhu: 200, ket: 'Sisa uap air keluar, api masih kecil' },
  { jam: 5, suhu: 573, ket: 'Kuarsa di tanah berubah bentuk, suhu dinaikkan pelan' },
  { jam: 9, suhu: 1000 },
  { jam: 11.5, suhu: 1150, ket: 'Glasir mulai meleleh' },
  { jam: 13, suhu: 1240, ket: 'Puncak 1.240\u00a0°C, ditahan 15 menit' },
  { jam: 13.25, suhu: 1240 },
  { jam: 16, suhu: 880 },
  { jam: 22, suhu: 420 },
  { jam: 30, suhu: 60, ket: 'Tanur dibuka' },
];

export const faq = [
  {
    grup: 'Pengiriman',
    id: 'pengiriman',
    isi: [
      {
        t: 'Dari mana pesanan dikirim?',
        j: 'Dari studio kami di Jawa Timur. Ongkir dihitung otomatis di checkout dari provinsi tujuan dan berat kiriman. Angka di toko demo ini contoh tarif, bukan tarif kurir sungguhan.',
      },
      {
        t: 'Kapan pesanan dikemas?',
        j: 'Pesanan yang dibayar sebelum pukul 14.00 WIB dikemas hari itu juga. Selebihnya dikemas pada hari kerja berikutnya. Kami tidak mengirim pada hari Minggu.',
      },
      {
        t: 'Apa beda Reguler dan Kilat?',
        j: 'Reguler lebih hemat, Kilat lebih cepat satu sampai dua hari. Kilat belum tersedia untuk Zona 4 (NTT, Maluku, dan Papua) karena paket berpindah kendaraan beberapa kali dan risiko pecahnya lebih tinggi.',
      },
      {
        t: 'Bagaimana berat kiriman dihitung?',
        j: 'Berat semua keping ditambah berat kemasan (seperempat dari berat keping, paling sedikit 300 gram), ditambah 1,2 kg bila memilih packing kayu. Hasilnya dibulatkan ke atas per kilogram, lalu dikalikan tarif per kilogram zona tujuan.',
      },
    ],
  },
  {
    grup: 'Packing dan keping pecah',
    id: 'packing',
    isi: [
      {
        t: 'Bagaimana keramik dikemas?',
        j: 'Tiap keping dibungkus kertas sarang lebah dua lapis dan diberi sekat di kardus dalam. Kardus dalam lalu dimasukkan ke kardus luar dengan ruang peredam di keenam sisinya.',
      },
      {
        t: 'Perlu tambah packing kayu?',
        j: 'Disarankan untuk teko, vas besar, set makan, atau tujuan di luar Jawa dan Bali. Biayanya Rp35.000 dan menambah sekitar 1,2 kg ke berat kiriman.',
      },
      {
        t: 'Kalau ada yang pecah saat tiba?',
        j: 'Rekam video saat membuka paket tanpa jeda, lalu kirim video dan foto pecahannya dalam 2 × 24 jam setelah paket diterima. Kami kirim pengganti dari angkatan berikutnya atau mengembalikan dana untuk keping yang pecah. Ongkir pengganti kami tanggung.',
      },
    ],
  },
  {
    grup: 'Tukar dan retur',
    id: 'retur',
    isi: [
      {
        t: 'Bisa tukar warna atau ukuran?',
        j: 'Bisa, dalam 7 hari setelah paket diterima dan selama keping belum dipakai. Ongkir penukaran ditanggung pembeli.',
      },
      {
        t: 'Warnanya sedikit beda dari gambar. Bisa retur?',
        j: 'Glasir bereaksi sedikit berbeda tergantung letak keping di tanur, jadi beda tipis seperti tepi yang lebih pucat bukan alasan retur. Kalau warnanya jelas lain dari glasir yang kamu pilih, itu salah kirim dan kami tukar tanpa biaya.',
      },
    ],
  },
  {
    grup: 'Perawatan',
    id: 'perawatan',
    isi: [
      {
        t: 'Boleh masuk microwave dan mesin cuci piring?',
        j: 'Microwave boleh untuk menghangatkan makanan. Mesin cuci piring juga boleh, tapi dicuci tangan membuat glasir doff lebih awet. Jangan memanaskan keping dalam keadaan kosong atau di atas api langsung.',
      },
      {
        t: 'Ada garis abu-abu di glasir doff. Itu goresan?',
        j: 'Biasanya itu bekas logam sendok, bukan goresan. Gosok pelan dengan pasta soda kue dan sedikit air, lalu bilas.',
      },
      {
        t: 'Kenapa kaki mangkuk terasa kasar?',
        j: 'Kaki sengaja tidak diglasir supaya keping tidak menempel ke rak tanur saat dibakar. Bagian ini menyerap air, jadi keringkan dulu sebelum disimpan bertumpuk.',
      },
    ],
  },
  {
    grup: 'Tentang toko demo ini',
    id: 'demo',
    isi: [
      {
        t: 'Apakah pembayaran di situs ini sungguhan?',
        j: 'Tidak. Tanur adalah toko fiktif. Transfer bank, QRIS, dan dompet digital hanya contoh alur. Tidak ada uang yang ditarik, dan tombol "Simulasikan pembayaran" hanya mengubah status pesanan di browser kamu.',
      },
      {
        t: 'Di mana data pesanan disimpan?',
        j: 'Hanya di browser yang kamu pakai (localStorage). Tidak ada yang dikirim ke server. Menghapus data situs di browser akan menghapus keranjang, pesanan, dan perubahan stok.',
      },
    ],
  },
];

export function cariProduk(slug) {
  return produk.find((p) => p.slug === slug);
}

export function cariGlasir(id) {
  return glasir.find((g) => g.id === id);
}

export function cariKategori(id) {
  return kategori.find((k) => k.id === id);
}
