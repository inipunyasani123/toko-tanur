import Link from 'next/link';
import Image from 'next/image';
import Hero from '@/components/Hero';
import Ware from '@/components/Ware';
import UbinUji from '@/components/UbinUji';
import Stempel from '@/components/Stempel';
import KurvaBakar from '@/components/KurvaBakar';
import KotakBerlapis from '@/components/KotakBerlapis';
import { kategori, glasir, produk, zonaOngkir, perawatanUmum, site, kemasan, cariProduk } from '@/lib/data';
import { terlaris, hargaTermurah, hitungPerGlasir } from '@/lib/katalog';
import { rupiah, suhu } from '@/lib/format';

export const metadata = {
  alternates: { canonical: '/' },
};

const TAMPIL_KATEGORI = {
  mangkuk: { produk: 'mangkuk-nasi-genggam', glasir: 'seladon', latar: 'bg-seladon-muda', ukuran: 'besar' },
  piring: { produk: 'piring-makan-teras', glasir: 'tenmoku', latar: 'bg-tanah', ukuran: 'besar' },
  'cangkir-gelas': { produk: 'cangkir-kopi-seduh', glasir: 'kobalt', latar: 'bg-kobalt-muda', ukuran: 'satuan' },
  teko: { produk: 'teko-teh-sore', glasir: 'seladon', latar: 'bg-[#e9e3d6]', ukuran: 'teko' },
  vas: { produk: 'vas-kuncup', glasir: 'kobalt', latar: 'bg-kertas', ukuran: 'sedang' },
  'set-makan': { produk: 'set-sarapan', glasir: 'abu', latar: 'bg-seladon-muda', ukuran: 'berdua' },
};

function ringkasKategori(id) {
  const daftar = produk.filter((p) => p.kategori === id);
  return { jumlah: daftar.length, mulai: Math.min(...daftar.map(hargaTermurah)) };
}

function UbinKategori({ id, besar = false, className = '' }) {
  const k = kategori.find((x) => x.id === id);
  const t = TAMPIL_KATEGORI[id];
  const p = cariProduk(t.produk);
  const iU = p.ukuran.findIndex((u) => u.id === t.ukuran);
  const { jumlah, mulai } = ringkasKategori(id);
  return (
    <Link
      href={`/koleksi?kategori=${id}`}
      className={`group relative flex min-h-[13rem] flex-col overflow-hidden rounded-[3px] ${t.latar} p-5 sm:p-6 ${className}`}
    >
      <div aria-hidden="true" className="cincin absolute -bottom-24 -right-24 h-72 w-72 rounded-full opacity-80" />
      <h3 className={`relative ${besar ? 'text-4xl sm:text-5xl' : 'text-2xl sm:text-[1.7rem]'}`}>{k.nama}</h3>
      <p className="relative mt-1 max-w-[14rem] text-[0.92rem] text-tinta-2">{k.ringkas}</p>
      <p className="label-tanur relative mt-3 text-[0.66rem] text-tinta-2">
        {jumlah} model
        <span className="block sm:inline"> <span className="hidden sm:inline">· </span>mulai {rupiah(mulai)}</span>
      </p>
      <Ware
        bentuk={p.bentuk}
        glasir={t.glasir}
        ukuranId={t.ukuran}
        iUkuran={Math.max(0, iU)}
        nUkuran={p.ukuran.length}
        className={`pointer-events-none absolute transition-transform duration-500 ease-out group-hover:-translate-y-2 ${
          besar ? '-bottom-6 -right-6 w-[78%] max-w-[26rem]' : '-bottom-5 -right-6 w-[52%] max-w-[13rem]'
        }`}
      />
      <span className="sr-only">, lihat semua {k.nama.toLowerCase()}</span>
    </Link>
  );
}

const LOG = [
  {
    hari: 'Hari 1',
    judul: 'Tanah diuleni',
    isi: 'Tanah stoneware diuleni sampai tidak ada gelembung udara. Gelembung yang tertinggal bisa membuat keping retak di tanur.',
  },
  {
    hari: 'Hari 1',
    judul: 'Dibentuk di meja putar',
    isi: 'Segumpal tanah dipusatkan, dibuka, lalu ditarik naik jadi dinding. Garis halus bekas jari dibiarkan di permukaan.',
  },
  {
    hari: 'Hari 2',
    judul: 'Kaki dirapikan',
    isi: 'Setelah setengah kering, keping dibalik dan kakinya dikerok. Bagian ini yang nanti dibiarkan tanpa glasir.',
  },
  {
    hari: 'Hari 3–9',
    judul: 'Kering angin',
    isi: 'Keping dikeringkan pelan di rak tertutup supaya tidak melengkung, lalu dibakar biskuit pada 900\u00a0°C.',
  },
  {
    hari: 'Hari 12',
    judul: 'Dicelup glasir, masuk tanur',
    isi: 'Setiap keping dicelup tangan. Tanur dinaikkan ke 1.240\u00a0°C selama sekitar 13 jam dan didinginkan semalaman.',
  },
  {
    hari: 'Kamis',
    judul: 'Tanur dibuka, keping disortir',
    isi: 'Kami ketuk tiap keping untuk mendengar retak halus dan memeriksa dasar yang goyang. Yang lolos masuk ke toko.',
  },
];

export default function Beranda() {
  const laris = terlaris(3);
  const perGlasir = hitungPerGlasir();
  const tipsRawat = perawatanUmum.slice(0, 4);

  return (
    <>
      <Hero />

      {/* Rak minggu ini: bento kategori, glasir, dan yang paling sering dipesan */}
      <section aria-labelledby="judul-rak" className="border-t border-garis bg-bisque py-16 sm:py-20">
        <div className="wadah">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="judul-rak" className="text-[2.1rem] sm:text-5xl">
                Isi rak kami
              </h2>
              <p className="mt-3 max-w-xl text-tinta-2">
                {produk.length} model dari tiga angkatan terakhir. Semuanya stoneware yang dibakar {suhu(site.suhuPuncak)}, jadi
                cukup kuat untuk dipakai setiap hari.
              </p>
            </div>
            <Link href="/koleksi" className="tautan font-medium">
              Semua koleksi
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-12">
            <UbinKategori id="mangkuk" besar className="col-span-2 min-h-[22rem] lg:col-span-5 lg:row-span-2" />
            <UbinKategori id="piring" className="col-span-1 min-h-[16rem] lg:col-span-4" />
            <UbinKategori id="cangkir-gelas" className="col-span-1 min-h-[16rem] lg:col-span-4 lg:col-start-6 lg:row-start-2" />

            <div className="col-span-2 rounded-[3px] border border-garis-tua bg-kertas p-5 sm:p-6 lg:col-span-3 lg:col-start-10 lg:row-span-2 lg:row-start-1">
              <h3 className="text-2xl">Paling sering dipesan</h3>
              <ol className="mt-4 grid gap-1">
                {laris.map((p, i) => (
                  <li key={p.slug} className="border-t border-garis first:border-0">
                    <Link href={`/produk/${p.slug}`} className="group flex items-center gap-3 py-3">
                      <span className="font-display text-3xl leading-none text-liat-tua" aria-hidden="true">
                        {i + 1}
                      </span>
                      <span className="block h-16 w-16 shrink-0 rounded-[3px] bg-tanah">
                        <Ware bentuk={p.bentuk} glasir={p.glasir[0]} ukuranId={p.ukuran[0].id} iUkuran={0} nUkuran={p.ukuran.length} className="h-full w-full" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-medium leading-snug group-hover:underline">{p.nama}</span>
                        <span className="block text-[0.9rem] text-tinta-2">mulai {rupiah(hargaTermurah(p))}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
              <p className="mt-3 border-t border-garis pt-3 text-[0.82rem] text-tinta-3">Diurutkan dari jumlah pesanan contoh di data toko demo ini.</p>
            </div>

            <UbinKategori id="teko" className="col-span-1 min-h-[16rem] lg:col-span-4" />
            <UbinKategori id="vas" className="col-span-1 min-h-[16rem] lg:col-span-4" />
            <UbinKategori id="set-makan" className="col-span-2 min-h-[15rem] lg:col-span-4" />

            <div className="gelap col-span-2 rounded-[3px] bg-jelaga p-5 text-[#efe5d8] sm:p-7 lg:col-span-12">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-2xl text-kertas sm:text-3xl">Empat glasir, diuji di ubin</h3>
                <Link href="/koleksi" className="text-[0.92rem] underline underline-offset-4 hover:decoration-2">
                  Saring koleksi per glasir
                </Link>
              </div>
              <ul className="mt-6 grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
                {glasir.map((g) => (
                  <li key={g.id}>
                    <Link href={`/koleksi?glasir=${g.id}`} className="group flex items-start gap-4 rounded-sm">
                      <UbinUji glasir={g.id} className="w-12 shrink-0 transition-transform group-hover:-translate-y-1" />
                      <span>
                        <span className="block text-[1.05rem] font-medium leading-snug text-kertas group-hover:underline">{g.nama}</span>
                        <span className="label-tanur mt-1 block text-[0.62rem] text-[#d9c9b6]">
                          {g.kode} · {g.kilap} · {perGlasir[g.id]} model
                        </span>
                        <span className="mt-2 block text-[0.88rem] leading-snug text-[#d6cabb]">{g.catatan}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Proses */}
      <section id="proses" aria-labelledby="judul-proses" className="scroll-mt-20 border-t border-garis bg-kertas py-16 sm:py-20">
        <div className="wadah grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="judul-proses" className="text-[2.1rem] sm:text-5xl">
              Satu mangkuk, kira-kira dua minggu
            </h2>
            <p className="mt-4 max-w-md text-tinta-2">
              Tidak ada cetakan untuk mangkuk, cangkir, dan teko kami. Ini catatan perjalanan satu keping, dari tanah basah sampai lolos
              sortir.
            </p>
            <ol className="mt-8 border-t border-tinta">
              {LOG.map((l) => (
                <li key={l.judul} className="grid grid-cols-[5.5rem_1fr] gap-4 border-b border-garis py-4">
                  <p className="label-tanur pt-1 text-[0.68rem] text-liat-tua">{l.hari}</p>
                  <div>
                    <h3 className="font-sans text-[1.02rem] font-semibold leading-snug tracking-normal">{l.judul}</h3>
                    <p className="mt-1 text-[0.95rem] text-tinta-2">{l.isi}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="grid content-start gap-4 lg:col-span-7">
            <div className="grid grid-cols-6 gap-3">
              <figure className="col-span-4 m-0 h-full">
                <Image
                  src="/images/proses-putar.webp"
                  alt="Dua tangan menarik dinding tanah liat di atas meja putar"
                  width={908}
                  height={681}
                  sizes="(min-width: 1024px) 34vw, 66vw"
                  className="h-full min-h-56 w-full rounded-[3px] object-cover"
                />
              </figure>
              <figure className="col-span-2 m-0 grid gap-3">
                <Image
                  src="/images/proses-uleni.webp"
                  alt="Tangan menguleni gumpalan tanah liat di meja kayu"
                  width={600}
                  height={600}
                  sizes="(min-width: 1024px) 17vw, 33vw"
                  className="aspect-square w-full rounded-[3px] object-cover"
                />
                <Image
                  src="/images/proses-rapikan.webp"
                  alt="Tangan merapikan bentuk keping dengan alat kerok di meja putar"
                  width={600}
                  height={600}
                  sizes="(min-width: 1024px) 17vw, 33vw"
                  className="aspect-square w-full rounded-[3px] object-cover"
                />
              </figure>
            </div>
            <div className="gelap rounded-[3px] bg-jelaga p-5 text-[#efe5d8] sm:p-7">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-2xl text-kertas">Kurva bakar angkatan {site.angkatanTerbaru}</h3>
                <p className="label-tanur text-[0.66rem] text-[#d9c9b6]">Suhu tanur (°C) per jam</p>
              </div>
              <p className="mt-2 max-w-xl text-[0.92rem] text-[#d6cabb]">
                Suhu dinaikkan pelan di 573&nbsp;°C karena kuarsa dalam tanah berubah bentuk di titik itu. Setelah puncak, tanur didinginkan
                pelan supaya glasir tidak retak rambut.
              </p>
              <div className="mt-5">
                <KurvaBakar />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pengiriman dan packing */}
      <section id="pengiriman" aria-labelledby="judul-kirim" className="scroll-mt-20 border-t border-garis py-16 sm:py-20">
        <div className="wadah grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 id="judul-kirim" className="text-[2.1rem] sm:text-5xl">
              Dikemas berlapis, karena keramik memang mudah pecah
            </h2>
            <p className="mt-4 max-w-lg text-tinta-2">
              Setiap paket kami susun seperti diagram ini. Kalau tetap ada yang pecah di jalan, kami ganti.
            </p>
            <div className="mt-8">
              <KotakBerlapis />
            </div>
          </div>
          <div className="grid content-start gap-8 lg:col-span-5">
            <div className="border-t-2 border-tinta pt-5">
              <h3 className="text-2xl">Pecah saat tiba? Kami ganti.</h3>
              <p className="mt-2 text-tinta-2">
                Rekam video saat membuka paket tanpa jeda, lalu kirim video dan foto pecahannya dalam 2 × 24 jam. Kami kirim pengganti
                dari angkatan berikutnya atau kembalikan dananya, termasuk ongkir pengganti.
              </p>
              <Link href="/bantuan#packing" className="tautan mt-3 inline-block font-medium">
                Baca ketentuannya
              </Link>
            </div>
            <div className="border-t-2 border-tinta pt-5">
              <h3 className="text-2xl">Ongkir dihitung dari berat</h3>
              <p className="mt-2 text-tinta-2">
                Berat keping ditambah kemasan (seperempat berat keping, minimal 300 g), dibulatkan ke atas per kilogram. Packing kayu
                menambah {rupiah(kemasan.kayu.biaya)} dan sekitar 1,2 kg.
              </p>
              <div className="mt-4">
                <table className="w-full border-collapse text-left text-[0.92rem]">
                  <caption className="label-tanur mb-2 text-left text-[0.66rem] text-tinta-3">Contoh tarif per kg dari {site.asal}</caption>
                  <thead>
                    <tr className="border-b border-tinta">
                      <th scope="col" className="py-2 pe-3 font-semibold">Tujuan</th>
                      <th scope="col" className="py-2 pe-3 text-end font-semibold">Reguler</th>
                      <th scope="col" className="py-2 text-end font-semibold">Kilat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {zonaOngkir.map((z) => (
                      <tr key={z.id} className="border-b border-garis">
                        <th scope="row" className="py-2.5 pe-3 font-normal">
                          <span className="block font-medium">{z.nama}</span>
                          <span className="block text-[0.85rem] text-tinta-3">{z.cakupan}</span>
                        </th>
                        <td className="py-2.5 pe-3 text-end tabular-nums">{rupiah(z.layanan.reguler.perKg)}</td>
                        <td className="py-2.5 text-end tabular-nums">{z.layanan.kilat ? rupiah(z.layanan.kilat.perKg) : <span className="text-tinta-3">belum ada</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Perawatan dan variasi buatan tangan */}
      <section aria-labelledby="judul-rawat" className="border-t border-garis bg-tanah py-16 sm:py-20">
        <div className="wadah grid items-start gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="tepi-sobek relative bg-kertas px-6 py-9 sm:px-8">
              <Stempel className="absolute right-5 top-6 h-14 w-14 rotate-12 text-liat-tua opacity-80" />
              <p className="label-tanur text-[0.68rem] text-liat-tua">Ikut di setiap kotak</p>
              <h2 id="judul-rawat" className="mt-2 pe-16 text-[2rem] sm:text-4xl">
                Kartu rawat
              </h2>
              <ul className="mt-5 grid gap-3">
                {tipsRawat.map((t) => (
                  <li key={t} className="flex gap-3 border-t border-dashed border-garis-tua pt-3 text-[0.97rem]">
                    <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-liat" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <Link href="/bantuan#perawatan" className="tautan mt-5 inline-block font-medium">
                Pertanyaan soal perawatan
              </Link>
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <h2 className="text-[2.1rem] sm:text-5xl">Tidak ada dua yang kembar</h2>
            <p className="mt-4 max-w-lg text-tinta-2">
              Empat mangkuk ini keluar dari tanur yang sama dengan glasir yang sama. Tetesan glasir, letak bintik besi, dan tinggi
              bibirnya tetap berbeda sedikit. Itu tanda dibuat tangan, bukan cacat.
            </p>
            <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {['a', 'b', 'c', 'd'].map((b, i) => (
                <li key={b} className="rounded-[3px] bg-bisque">
                  <Ware bentuk="mangkuk" glasir="seladon" ukuranId="kecil" iUkuran={0} nUkuran={2} benih={b} className="w-full" />
                  <p className="label-tanur px-3 pb-3 text-[0.62rem] text-tinta-3">
                    Keping {String.fromCharCode(65 + i)} ·{' '}
                    <span className="whitespace-nowrap">Ø {[12.1, 11.9, 12.2, 12.0][i].toLocaleString('id-ID')} cm</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
