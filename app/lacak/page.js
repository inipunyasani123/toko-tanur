import Lacak from '@/components/Lacak';
import { ogHalaman } from '@/lib/seo';

const deskripsi = 'Lacak status pesanan di toko demo Tanur dengan kode pesanan dan 4 angka terakhir nomor HP penerima.';

export const metadata = {
  title: 'Lacak pesanan',
  description: deskripsi,
  alternates: { canonical: '/lacak' },
  ...ogHalaman({ path: '/lacak', judul: 'Lacak pesanan', deskripsi }),
};

export default function HalamanLacak() {
  return (
    <>
      <div className="wadah pb-8 pt-10 sm:pt-14">
        <h1 className="text-5xl sm:text-6xl">Lacak pesanan</h1>
        <p className="mt-3 max-w-2xl text-tinta-2">
          Masukkan kode pesanan dan 4 angka terakhir nomor HP penerima. Keduanya harus cocok supaya status pesanan tidak bisa dilihat
          orang lain.
        </p>
      </div>
      <Lacak />
    </>
  );
}
