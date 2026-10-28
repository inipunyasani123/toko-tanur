'use client';

import Link from 'next/link';
import { useState } from 'react';
import FotoKeramik from './FotoKeramik';
import Stempel from './Stempel';
import Linimasa from './Linimasa';
import { metodeBayar, site, cariProduk, cariGlasir } from '@/lib/data';
import { indeksStatus, labelStatus } from '@/lib/pesanan';
import { rupiah, gram, waktuWIB, sensorHP } from '@/lib/format';
import { usePesanan, useTerpasang, cariPesanan, ubahStatusPesanan } from '@/lib/store';

function Faktur({ o }) {
  const lunas = indeksStatus(o.status) >= indeksStatus('dibayar');
  return (
    <div className="hanya-cetak text-[11pt] text-black">
      <div className="flex items-start justify-between border-b-2 border-black pb-3">
        <div className="flex items-center gap-3">
          <Stempel className="h-12 w-12" />
          <div>
            <p className="font-display text-[22pt] leading-none">{site.nama}</p>
            <p className="text-[9pt]">Keramik buatan tangan · {site.asal}</p>
          </div>
        </div>
        <div className="text-end">
          <p className="text-[16pt] font-semibold">Faktur</p>
          <p className="font-mono text-[10pt]">{o.kode}</p>
          <p className="text-[9pt]">Dibuat {waktuWIB(o.dibuat)}</p>
        </div>
      </div>
      <div className="mt-4 flex justify-between gap-8">
        <div>
          <p className="text-[9pt] uppercase tracking-wide">Kepada</p>
          <p className="font-semibold">{o.pembeli.nama}</p>
          <p>{o.pembeli.alamat}</p>
          <p>
            {o.pembeli.kota}, {o.pembeli.provinsi} {o.pembeli.kodePos}
          </p>
          <p>HP {sensorHP(o.pembeli.hp)}</p>
        </div>
        <div className="text-end">
          <p className="text-[9pt] uppercase tracking-wide">Status</p>
          <p className="font-semibold">{lunas ? 'Lunas (simulasi)' : 'Belum dibayar'}</p>
          <p>{metodeBayar.find((m) => m.id === o.bayar.metode)?.nama}</p>
        </div>
      </div>
      <table className="mt-5 w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-black">
            <th className="py-1.5">Barang</th>
            <th className="py-1.5 text-end">Jumlah</th>
            <th className="py-1.5 text-end">Harga</th>
            <th className="py-1.5 text-end">Total</th>
          </tr>
        </thead>
        <tbody>
          {o.items.map((it) => (
            <tr key={`${it.slug}-${it.glasir}-${it.ukuran}`} className="border-b border-neutral-300">
              <td className="py-1.5">
                {it.nama}
                <br />
                <span className="text-[9pt]">{it.label}</span>
              </td>
              <td className="py-1.5 text-end">{it.qty}</td>
              <td className="py-1.5 text-end">{rupiah(it.harga)}</td>
              <td className="py-1.5 text-end">{rupiah(it.harga * it.qty)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="pt-2 text-end">Subtotal</td>
            <td className="pt-2 text-end">{rupiah(o.subtotal)}</td>
          </tr>
          <tr>
            <td colSpan={3} className="text-end">
              Ongkir {o.kirim.layanan === 'kilat' ? 'Kilat' : 'Reguler'} ({o.kirim.kgTagih} kg)
            </td>
            <td className="text-end">{rupiah(o.kirim.ongkir)}</td>
          </tr>
          {o.kirim.kayu && (
            <tr>
              <td colSpan={3} className="text-end">Packing kayu</td>
              <td className="text-end">{rupiah(o.kirim.biayaKayu)}</td>
            </tr>
          )}
          <tr className="text-[13pt] font-semibold">
            <td colSpan={3} className="border-t-2 border-black pt-2 text-end">Total</td>
            <td className="border-t-2 border-black pt-2 text-end">{rupiah(o.total)}</td>
          </tr>
        </tfoot>
      </table>
      <p className="mt-8 border-t border-neutral-400 pt-2 text-[8.5pt]">
        Dokumen contoh dari toko demo. {site.nama} adalah toko fiktif; faktur ini bukan bukti transaksi dan bukan faktur pajak.
      </p>
    </div>
  );
}

export default function Pesanan({ kode }) {
  const terpasang = useTerpasang();
  const daftar = usePesanan();
  const [pesan, setPesan] = useState('');
  const o = terpasang ? cariPesanan(daftar, kode) : null;

  if (!terpasang) {
    return (
      <div className="wadah py-16">
        <p className="text-tinta-2" role="status">
          Memuat pesanan…
        </p>
      </div>
    );
  }

  if (!o) {
    return (
      <div className="wadah py-14">
        <h1 className="text-4xl sm:text-5xl">Pesanan tidak ditemukan</h1>
        <p className="mt-3 max-w-xl text-tinta-2">
          Kode <span className="label-tanur text-[0.8rem] text-tinta">{kode}</span> tidak ada di browser ini. Pesanan di toko demo hanya
          tersimpan di browser tempat pesanan dibuat.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link href="/lacak" className="tombol tombol-utama">
            Lacak dengan kode lain
          </Link>
          <Link href="/koleksi" className="tombol tombol-garis">
            Lihat koleksi
          </Link>
        </div>
      </div>
    );
  }

  const metode = metodeBayar.find((m) => m.id === o.bayar.metode);
  const menunggu = o.status === 'menunggu';
  const batasBayar = o.dibuat + site.batasBayarJam * 3600 * 1000;
  const namaDepan = o.pembeli.nama.split(' ')[0];

  const bayar = () => {
    ubahStatusPesanan(o.kode, 'dibayar');
    setPesan('Pembayaran tersimulasi. Status pesanan berubah menjadi Dibayar.');
  };

  return (
    <>
      <div className="tanpa-cetak">
        <div className="wadah pb-8 pt-10 sm:pt-14">
          <p className="label-tanur text-[0.7rem] text-liat-tua">{menunggu ? `Terima kasih, ${namaDepan}` : `Pesanan ${namaDepan}`}</p>
          <h1 className="mt-2 break-words text-[2.3rem] leading-tight sm:text-6xl">
            Pesanan <span className="whitespace-nowrap">{o.kode}</span>
          </h1>
          <p className="mt-3 text-tinta-2">
            Dibuat {waktuWIB(o.dibuat)} · Status sekarang: <span className="font-semibold text-tinta">{labelStatus(o.status)}</span>
          </p>
        </div>

        <div className="wadah grid gap-10 pb-20 lg:grid-cols-12">
          <div className="grid content-start gap-8 lg:col-span-7">
            <div role="status" aria-live="polite">
              {pesan && <p className="rounded-[3px] bg-seladon-muda p-3.5 font-medium">{pesan}</p>}
            </div>
            {menunggu && (
              <section aria-labelledby="judul-bayar" className="rounded-[3px] border-2 border-tinta bg-kertas p-5 sm:p-6">
                <h2 id="judul-bayar" className="text-2xl sm:text-3xl">
                  Bayar dengan {metode?.nama}
                </h2>
                <p className="mt-2 text-tinta-2">{metode?.instruksi}</p>
                <dl className="mt-4 grid gap-2 border-y border-garis py-3 text-[0.95rem] sm:grid-cols-2">
                  <div>
                    <dt className="text-tinta-3">Jumlah</dt>
                    <dd className="text-xl font-semibold tabular-nums">{rupiah(o.total)}</dd>
                  </div>
                  <div>
                    <dt className="text-tinta-3">Bayar sebelum</dt>
                    <dd className="font-semibold">{waktuWIB(batasBayar)}</dd>
                  </div>
                </dl>
                <p className="mt-4 text-[0.9rem]">
                  <span className="font-semibold text-liat-tua">Mode demo:</span> tombol ini hanya mengubah status di browser kamu.
                </p>
                <button type="button" className="tombol tombol-utama mt-3 w-full sm:w-auto" onClick={bayar}>
                  Simulasikan pembayaran
                </button>
              </section>
            )}

            <section aria-labelledby="judul-status">
              <h2 id="judul-status" className="border-t-2 border-tinta pt-4 text-2xl sm:text-3xl">
                Perjalanan pesanan
              </h2>
              <p className="mt-1 text-[0.9rem] text-tinta-2">Semua waktu dalam WIB. Status berikutnya diubah penjual dari dasbor demo.</p>
              <div className="mt-6">
                <Linimasa pesanan={o} />
              </div>
            </section>
          </div>

          <aside className="grid content-start gap-6 lg:col-span-5">
            <section aria-labelledby="judul-isi" className="rounded-[3px] border border-garis-tua bg-kertas p-5 sm:p-6">
              <h2 id="judul-isi" className="text-2xl">
                Isi pesanan
              </h2>
              <ul className="mt-4 grid gap-3">
                {o.items.map((it) => {
                  const p = cariProduk(it.slug);
                  return (
                    <li key={`${it.slug}-${it.glasir}-${it.ukuran}`} className="flex items-center gap-3">
                      <span className="relative block h-14 w-14 shrink-0 overflow-hidden rounded-[3px] bg-tanah">
                        {p && <FotoKeramik slug={p.slug} sizes="56px" alt="" />}
                      </span>
                      <span className="min-w-0 flex-1 text-[0.92rem]">
                        <span className="block font-medium leading-snug">{it.nama}</span>
                        <span className="block text-tinta-2">
                          {it.qty} × {rupiah(it.harga)} · {cariGlasir(it.glasir)?.nama}
                        </span>
                      </span>
                      <span className="text-[0.92rem] tabular-nums">{rupiah(it.harga * it.qty)}</span>
                    </li>
                  );
                })}
              </ul>
              <dl className="mt-5 grid gap-1.5 border-t border-garis pt-4 text-[0.93rem]">
                <div className="flex justify-between gap-4">
                  <dt className="text-tinta-2">Subtotal</dt>
                  <dd className="tabular-nums">{rupiah(o.subtotal)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-tinta-2">
                    Ongkir {o.kirim.layanan === 'kilat' ? 'Kilat' : 'Reguler'} · {o.kirim.kgTagih} kg
                  </dt>
                  <dd className="tabular-nums">{rupiah(o.kirim.ongkir)}</dd>
                </div>
                {o.kirim.kayu && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-tinta-2">Packing kayu</dt>
                    <dd className="tabular-nums">{rupiah(o.kirim.biayaKayu)}</dd>
                  </div>
                )}
                <div className="mt-1 flex justify-between gap-4 border-t border-tinta pt-2 text-lg font-semibold">
                  <dt>Total</dt>
                  <dd className="tabular-nums">{rupiah(o.total)}</dd>
                </div>
              </dl>
            </section>

            <section aria-labelledby="judul-tujuan" className="rounded-[3px] border border-garis bg-bisque p-5 sm:p-6">
              <h2 id="judul-tujuan" className="font-sans text-lg font-semibold tracking-normal">
                Dikirim ke
              </h2>
              <p className="mt-2">
                {o.pembeli.nama}
                <br />
                {o.pembeli.alamat}
                <br />
                {o.pembeli.kota}, {o.pembeli.provinsi} {o.pembeli.kodePos}
                <br />
                <span className="text-tinta-2">HP {sensorHP(o.pembeli.hp)}</span>
              </p>
              <p className="mt-3 text-[0.9rem] text-tinta-2">
                {o.kirim.zonaNama} · estimasi {o.kirim.estimasi} · berat ditagih {o.kirim.kgTagih} kg ({gram(o.kirim.beratTotal)})
              </p>
            </section>

            <div className="flex flex-wrap gap-3">
              <button type="button" className="tombol tombol-garis" onClick={() => window.print()}>
                Cetak faktur
              </button>
              <Link href={`/lacak?kode=${encodeURIComponent(o.kode)}`} className="tombol tombol-garis">
                Halaman lacak
              </Link>
            </div>
          </aside>
        </div>
      </div>
      <Faktur o={o} />
    </>
  );
}
