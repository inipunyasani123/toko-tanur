import Pesanan from '@/components/Pesanan';

export async function generateMetadata({ params }) {
  const { kode } = await params;
  const k = decodeURIComponent(kode).toUpperCase();
  return {
    title: `Pesanan ${k}`,
    description: 'Status pesanan di toko demo Tanur. Data pesanan tersimpan di browser tempat pesanan dibuat.',
    alternates: { canonical: `/pesanan/${encodeURIComponent(k)}` },
    robots: { index: false, follow: false },
  };
}

export default async function HalamanPesanan({ params }) {
  const { kode } = await params;
  return <Pesanan kode={decodeURIComponent(kode)} />;
}
