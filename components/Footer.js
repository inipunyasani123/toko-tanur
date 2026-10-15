import Link from 'next/link';
import Stempel from './Stempel';
import { site, faq } from '@/lib/data';
import { suhu } from '@/lib/format';

export default function Footer() {
  return (
    <footer data-situs className="gelap relative overflow-hidden bg-jelaga text-[#e9dfd2]">
      <div aria-hidden="true" className="cincin-terang pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full" />
      <div className="wadah relative grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <Link href="/" className="inline-flex items-center gap-3 rounded-sm" aria-label="Tanur, ke beranda">
            <Stempel className="h-11 w-11 text-[#e9b48f]" />
            <span className="font-display text-4xl leading-none">Tanur</span>
          </Link>
          <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-[#d6cabb]">
            Keramik stoneware untuk meja sehari-hari. Dibentuk di meja putar, dibakar tiap Kamis di tanur {suhu(site.suhuPuncak)}, lalu dikemas berlapis supaya utuh sampai tujuan.
          </p>
          <p className="mt-5 max-w-sm border-s-2 border-[#e9b48f] ps-3 text-[0.9rem] text-[#efe5d8]">
            {`${site.nama} adalah toko fiktif untuk demo.`}
          </p>
        </div>

        <nav aria-label="Belanja" className="md:col-span-2">
          <h2 className="label-tanur text-[#e9c6a6]">Belanja</h2>
          <ul className="mt-4 grid gap-2.5 text-[0.95rem]">
            <li><Link className="hover:underline" href="/koleksi">Koleksi</Link></li>
            <li><Link className="hover:underline" href="/keranjang">Keranjang</Link></li>
            <li><Link className="hover:underline" href="/lacak">Lacak pesanan</Link></li>
          </ul>
        </nav>

        <nav aria-label="Bantuan" className="md:col-span-2">
          <h2 className="label-tanur text-[#e9c6a6]">Bantuan</h2>
          <ul className="mt-4 grid gap-2.5 text-[0.95rem]">
            {faq.slice(0, 4).map((g) => (
              <li key={g.id}><Link className="hover:underline" href={`/bantuan#${g.id}`}>{g.grup}</Link></li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <h2 className="label-tanur text-[#e9c6a6]">Toko</h2>
          <dl className="mt-4 grid gap-3 text-[0.95rem]">
            <div>
              <dt className="text-[#bfb1a1]">Jam layanan</dt>
              <dd>{site.jamLayanan}</dd>
            </div>
            <div>
              <dt className="text-[#bfb1a1]">Dikirim dari</dt>
              <dd>Studio di {site.asal}</dd>
            </div>
          </dl>
          <Link href="/admin" className="mt-5 inline-flex items-center gap-2 text-[0.95rem] underline underline-offset-4 hover:decoration-2">
            Dasbor demo penjual
          </Link>
        </div>
      </div>
      <div className="wadah relative flex flex-wrap items-center justify-between gap-3 border-t border-white/15 py-5 text-[0.82rem] text-[#cbbfb0]">
        <p>Semua produk, harga, stok, dan pesanan di situs ini contoh.</p>
        <p className="label-tanur text-[0.66rem]">Angkatan {site.angkatanTerbaru} · {suhu(site.suhuPuncak)}</p>
      </div>
    </footer>
  );
}
