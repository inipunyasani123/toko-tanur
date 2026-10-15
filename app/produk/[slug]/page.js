import Link from 'next/link';
import { notFound } from 'next/navigation';
import DetailProduk from '@/components/DetailProduk';
import KartuProduk from '@/components/KartuProduk';
import { produk, cariProduk, cariKategori, cariGlasir } from '@/lib/data';
import { ogHalaman } from '@/lib/seo';
import { produkTerkait, hargaTermurah } from '@/lib/katalog';
import { rupiah } from '@/lib/format';

export const dynamicParams = false;

export function generateStaticParams() {
  return produk.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = cariProduk(slug);
  if (!p) return {};
  const glasirNama = p.glasir.map((g) => cariGlasir(g).nama).join(', ');
  const deskripsi = `${p.ringkas} Glasir ${glasirNama}. Mulai ${rupiah(hargaTermurah(p))}, stoneware buatan tangan dari angkatan ${p.angkatan}.`;
  return {
    title: p.nama,
    description: deskripsi,
    alternates: { canonical: `/produk/${p.slug}` },
    ...ogHalaman({ path: `/produk/${p.slug}`, judul: p.nama, deskripsi }),
  };
}

export default async function HalamanProduk({ params }) {
  const { slug } = await params;
  const p = cariProduk(slug);
  if (!p) notFound();
  const kat = cariKategori(p.kategori);
  const terkait = produkTerkait(p, 4);
  return (
    <>
      <nav aria-label="Jejak halaman" className="wadah pb-5 pt-6 text-[0.9rem]">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-tinta-2">
          <li>
            <Link href="/koleksi" className="hover:underline">Koleksi</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/koleksi?kategori=${kat.id}`} className="hover:underline">{kat.nama}</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-tinta">{p.nama}</li>
        </ol>
      </nav>
      <DetailProduk slug={p.slug} />
      <section aria-labelledby="judul-terkait" className="mt-6 border-t border-garis bg-kertas py-14">
        <div className="wadah">
          <h2 id="judul-terkait" className="text-3xl sm:text-4xl">Cocok dipasangkan</h2>
          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
            {terkait.map((t) => (
              <li key={t.slug}>
                <KartuProduk produk={t} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
