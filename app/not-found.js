import Link from 'next/link';
import Ware from '@/components/Ware';

export const metadata = {
  title: 'Halaman tidak ditemukan',
  robots: { index: false, follow: true },
  alternates: { canonical: null },
};

export default function TidakDitemukan() {
  return (
    <div className="wadah grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-12">
      <div className="relative mx-auto aspect-square w-full max-w-sm lg:col-span-5">
        <div aria-hidden="true" className="cincin absolute inset-0 rounded-full bg-tanah" />
        <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <Ware bentuk="mangkuk" glasir="tenmoku" ukuranId="besar" iUkuran={1} nUkuran={2} retak x={20} y={10} width={360} height={360} />
          <path d="M296 318 l26 -9 l10 17 l-30 6 z" fill="#4a2d20" />
          <path d="M296 318 l26 -9 l3 5 l-27 9 z" fill="#ad5f2f" />
          <path d="M84 326 l18 -6 l4 11 l-20 3 z" fill="#d3b08c" />
        </svg>
      </div>
      <div className="lg:col-span-6 lg:col-start-7">
        <p className="label-tanur text-[0.72rem] text-liat-tua">404 · tidak lolos sortir</p>
        <h1 className="mt-3 text-5xl sm:text-6xl">Halaman ini retak di tanur</h1>
        <p className="mt-4 max-w-lg text-tinta-2">
          Alamat yang kamu buka tidak ada, atau sudah pindah. Tidak semua keping lolos dari pembakaran, dan halaman ini salah satunya.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/koleksi" className="tombol tombol-utama">
            Lihat koleksi
          </Link>
          <Link href="/" className="tombol tombol-garis">
            Ke beranda
          </Link>
          <Link href="/lacak" className="tautan self-center font-medium">
            Lacak pesanan
          </Link>
        </div>
      </div>
    </div>
  );
}
