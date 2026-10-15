import { Suspense } from 'react';
import Katalog, { GridStatis } from '@/components/Katalog';
import { produk, site } from '@/lib/data';
import { suhu } from '@/lib/format';
import { ogHalaman } from '@/lib/seo';

const deskripsi = `Semua ${produk.length} model keramik Tanur: mangkuk, piring, cangkir, gelas, teko, vas, dan set makan. Saring per kategori, glasir, dan harga.`;

export const metadata = {
  title: 'Koleksi',
  description: deskripsi,
  alternates: { canonical: '/koleksi' },
  ...ogHalaman({ path: '/koleksi', judul: 'Koleksi', deskripsi }),
};

export default function HalamanKoleksi() {
  const angkatan = [...new Set(produk.map((p) => p.angkatan))].sort();
  return (
    <>
      <div className="wadah pb-8 pt-10 sm:pt-14">
        <h1 className="text-5xl sm:text-6xl">Koleksi</h1>
        <p className="mt-3 max-w-2xl text-tinta-2">
          {produk.length} model dari angkatan {angkatan[0]}–{angkatan[angkatan.length - 1]}. Semuanya stoneware yang dibakar{' '}
          {suhu(site.suhuPuncak)}. Stok dihitung per glasir dan ukuran, jadi pilihan yang habis
          ditandai di halaman produk.
        </p>
      </div>
      <Suspense fallback={<GridStatis />}>
        <Katalog />
      </Suspense>
    </>
  );
}
