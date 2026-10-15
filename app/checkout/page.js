import Checkout from '@/components/Checkout';
import { ogHalaman } from '@/lib/seo';

export const metadata = {
  title: 'Checkout',
  description: 'Isi alamat, pilih layanan kirim, dan buat pesanan di toko demo Tanur. Ongkir dihitung otomatis dari contoh tarif.',
  ...ogHalaman({ path: '/checkout', judul: 'Checkout', deskripsi: 'Isi alamat, pilih layanan kirim, dan buat pesanan di toko demo Tanur. Ongkir dihitung otomatis dari contoh tarif.' }),
  alternates: { canonical: '/checkout' },
  robots: { index: false, follow: true },
};

export default function HalamanCheckout() {
  return (
    <>
      <div className="wadah pb-8 pt-10 sm:pt-14">
        <h1 className="text-5xl sm:text-6xl">Checkout</h1>
        <p className="mt-3 max-w-2xl text-tinta-2">Tiga langkah singkat: alamat, pengiriman, lalu cara bayar.</p>
      </div>
      <Checkout />
    </>
  );
}
