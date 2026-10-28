import Link from 'next/link';
import FotoKeramik from './FotoKeramik';
import { cariGlasir, cariKategori } from '@/lib/data';
import { rentangHarga, totalStok, hargaVarian } from '@/lib/katalog';
import { rupiah } from '@/lib/format';

const LATAR = {
  seladon: 'bg-seladon-muda',
  kobalt: 'bg-kobalt-muda',
  tenmoku: 'bg-tanah',
  abu: 'bg-[#efe6d8]',
};

// Kartu produk untuk katalog dan daftar terkait. `inventaris` opsional (dari browser).
export default function KartuProduk({ produk: p, inventaris, judulTag = 'h3', glasirTampil }) {
  const stok = inventaris ? totalStok(p, inventaris) : null;
  const glasirAwal = glasirTampil && p.glasir.includes(glasirTampil) ? glasirTampil : p.glasir[0];
  // Bila disaring per glasir, harga mengikuti glasir itu.
  const hargaGlasir = glasirTampil && p.glasir.includes(glasirTampil) ? p.ukuran.map((u) => hargaVarian(p, glasirTampil, u.id)) : null;
  const { min, max } = hargaGlasir ? { min: Math.min(...hargaGlasir), max: Math.max(...hargaGlasir) } : rentangHarga(p);
  const Judul = judulTag;
  const kat = cariKategori(p.kategori);
  return (
    <article className="group relative flex h-full flex-col">
      <div className={`cincin relative aspect-square overflow-hidden rounded-[3px] ${LATAR[glasirAwal] || 'bg-tanah'}`}>
        <FotoKeramik
          slug={p.slug}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        <p className="label-tanur absolute left-3 top-3 bg-kertas/90 px-2 py-1 text-[0.64rem] text-tinta-2">Angkatan {p.angkatan}</p>
        {stok === 0 && (
          <p className="label-tanur absolute right-3 top-3 bg-tinta px-2 py-1 text-[0.64rem] text-kertas">Habis</p>
        )}
        {stok !== null && stok > 0 && stok <= 4 && (
          <p className="label-tanur absolute right-3 top-3 bg-kertas px-2 py-1 text-[0.64rem] text-awas">Sisa {stok}</p>
        )}
      </div>
      <div className="flex flex-1 flex-col pt-3">
        <p className="text-[0.8rem] text-tinta-3">{kat?.nama}</p>
        <Judul className="mt-0.5 font-display text-[1.2rem] leading-snug">
          <Link href={`/produk/${p.slug}`} className="after:absolute after:inset-0 after:content-[''] hover:underline hover:decoration-1 hover:underline-offset-4">
            {p.nama}
          </Link>
        </Judul>
        <p className="mt-1 font-semibold">
          {min === max ? rupiah(min) : (
            <>
              <span className="text-[0.85rem] font-normal text-tinta-2">mulai </span>
              {rupiah(min)}
            </>
          )}
        </p>
        <ul className="mt-2.5 flex gap-1.5" aria-label="Pilihan glasir">
          {p.glasir.map((id) => {
            const g = cariGlasir(id);
            return (
              <li key={id}>
                <span
                  className="block h-3.5 w-3.5 rounded-[2px] ring-1 ring-tinta/25"
                  style={{ background: `linear-gradient(180deg, ${g.tepi} 0%, ${g.warna} 45%, ${g.gelap} 100%)` }}
                  title={g.nama}
                />
                <span className="sr-only">{g.nama}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </article>
  );
}
