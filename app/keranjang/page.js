import Keranjang from '@/components/Keranjang';
import { ogHalaman } from '@/lib/seo';

export const metadata = {
  title: 'Keranjang',
  description: 'Isi keranjang belanja di toko demo Tanur. Keranjang tersimpan di browser kamu.',
  ...ogHalaman({ path: '/keranjang', judul: 'Keranjang', deskripsi: 'Isi keranjang belanja di toko demo Tanur. Keranjang tersimpan di browser kamu.' }),
  alternates: { canonical: '/keranjang' },
  robots: { index: false, follow: true },
};

export default function HalamanKeranjang() {
  return (
    <>
      <div className="wadah pb-8 pt-10 sm:pt-14">
        <h1 className="text-5xl sm:text-6xl">Keranjang</h1>
        <p className="mt-3 max-w-2xl text-tinta-2">Keranjang tersimpan di browser ini saja. Stok dicek lagi saat pesanan dibuat.</p>
      </div>
      <Keranjang />
    </>
  );
}
