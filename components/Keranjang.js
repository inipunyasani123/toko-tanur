'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import Ware from './Ware';
import { cariProduk } from '@/lib/data';
import { hargaVarian, beratVarian, labelVarian, stokVarian, produkAktif, terlaris, hargaTermurah } from '@/lib/katalog';
import { beratKemasan } from '@/lib/ongkir';
import { rupiah, gram } from '@/lib/format';
import { useKeranjang, useInventaris, useTerpasang, ubahJumlah, hapusItem, itemKunci } from '@/lib/store';

export function rakitIsiKeranjang(keranjang, inv) {
  return keranjang
    .map((it) => {
      const p = cariProduk(it.slug);
      if (!p) return null;
      const stok = stokVarian(p, it.glasir, it.ukuran, inv);
      return {
        ...it,
        kunci: itemKunci(it),
        p,
        stok,
        aktif: produkAktif(p, inv),
        harga: hargaVarian(p, it.glasir, it.ukuran),
        berat: beratVarian(p, it.ukuran),
        label: labelVarian(p, it.glasir, it.ukuran),
      };
    })
    .filter(Boolean);
}

function Stepper({ it }) {
  const maks = Math.max(1, it.stok);
  return (
    <div className="flex items-stretch rounded-[3px] border-[1.5px] border-garis-tua bg-kertas" role="group" aria-label={`Jumlah ${it.p.nama}`}>
      <button
        type="button"
        className="min-h-10 w-10 text-lg disabled:text-tinta-3"
        onClick={() => ubahJumlah(it.kunci, it.qty - 1)}
        disabled={it.qty <= 1}
        aria-label={`Kurangi ${it.p.nama}`}
      >
        −
      </button>
      <span className="flex w-10 items-center justify-center font-semibold tabular-nums" aria-live="polite">
        <span className="sr-only">Jumlah: </span>
        {it.qty}
      </span>
      <button
        type="button"
        className="min-h-10 w-10 text-lg disabled:text-tinta-3"
        onClick={() => ubahJumlah(it.kunci, it.qty + 1)}
        disabled={it.qty >= maks}
        aria-label={`Tambah ${it.p.nama}`}
      >
        +
      </button>
    </div>
  );
}

export default function Keranjang() {
  const terpasang = useTerpasang();
  const keranjang = useKeranjang();
  const inv = useInventaris();
  const isi = rakitIsiKeranjang(keranjang, inv);

  // Jumlah melebihi stok (mis. stok diubah di dasbor) disesuaikan otomatis.
  useEffect(() => {
    for (const it of isi) if (it.stok > 0 && it.qty > it.stok) ubahJumlah(it.kunci, it.stok);
  }, [isi]);

  if (!terpasang) {
    return (
      <div className="wadah pb-24">
        <p className="text-tinta-2">Memuat keranjang…</p>
      </div>
    );
  }

  if (!isi.length) {
    const saran = terlaris(3);
    return (
      <div className="wadah pb-24">
        <div className="grid items-center gap-8 rounded-[3px] border border-dashed border-garis-tua bg-kertas p-6 sm:grid-cols-[12rem_1fr] sm:p-10">
          <Ware bentuk="mangkuk" glasir="abu" ukuranId="kecil" className="mx-auto w-40 sm:w-48" />
          <div>
            <h2 className="text-3xl">Keranjangmu masih kosong</h2>
            <p className="mt-2 max-w-md text-tinta-2">Mulai dari yang paling sering dipesan, atau lihat semua koleksi angkatan terbaru.</p>
            <Link href="/koleksi" className="tombol tombol-utama mt-5">
              Lihat koleksi
            </Link>
          </div>
        </div>
        <h2 className="mt-14 text-2xl">Paling sering dipesan</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-3">
          {saran.map((p) => (
            <li key={p.slug}>
              <Link href={`/produk/${p.slug}`} className="group flex items-center gap-3 rounded-[3px] border border-garis bg-kertas p-3 hover:border-garis-tua">
                <span className="block h-16 w-16 shrink-0 rounded-[3px] bg-tanah">
                  <Ware bentuk={p.bentuk} glasir={p.glasir[0]} ukuranId={p.ukuran[0].id} className="h-full w-full" />
                </span>
                <span>
                  <span className="block font-medium group-hover:underline">{p.nama}</span>
                  <span className="block text-[0.9rem] text-tinta-2">mulai {rupiah(hargaTermurah(p))}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const subtotal = isi.reduce((n, it) => n + it.harga * it.qty, 0);
  const berat = isi.reduce((n, it) => n + it.berat * it.qty, 0);
  const jumlah = isi.reduce((n, it) => n + it.qty, 0);
  const masalah = isi.filter((it) => it.stok <= 0 || !it.aktif);

  return (
    <div className="wadah grid gap-10 pb-6 lg:grid-cols-12">
      <section aria-labelledby="judul-isi" className="lg:col-span-8">
        <h2 id="judul-isi" className="sr-only">
          Isi keranjang
        </h2>
        <ul className="border-t-2 border-tinta">
          {isi.map((it) => {
            const habis = it.stok <= 0 || !it.aktif;
            return (
              <li key={it.kunci} className="grid grid-cols-[5.5rem_1fr] gap-4 border-b border-garis py-5 sm:grid-cols-[7rem_1fr_auto]">
                <Link href={`/produk/${it.slug}?glasir=${it.glasir}`} className="block aspect-square overflow-hidden rounded-[3px] bg-tanah" tabIndex={-1} aria-hidden="true">
                  <Ware bentuk={it.p.bentuk} glasir={it.glasir} ukuranId={it.ukuran} iUkuran={it.p.ukuran.findIndex((x) => x.id === it.ukuran)} nUkuran={it.p.ukuran.length} className="h-full w-full" />
                </Link>
                <div className="min-w-0">
                  <h3 className="font-display text-xl leading-snug">
                    <Link href={`/produk/${it.slug}?glasir=${it.glasir}`} className="hover:underline">
                      {it.p.nama}
                    </Link>
                  </h3>
                  <p className="text-[0.92rem] text-tinta-2">{it.label}</p>
                  <p className="mt-1 text-[0.92rem]">
                    {rupiah(it.harga)} <span className="text-tinta-3">· {gram(it.berat)} per pilihan</span>
                  </p>
                  {habis ? (
                    <p className="mt-2 text-[0.9rem] font-medium text-awas">
                      {it.aktif ? 'Stok varian ini habis.' : 'Produk ini sedang tidak dijual.'} Hapus dari keranjang untuk melanjutkan.
                    </p>
                  ) : it.qty >= it.stok ? (
                    <p className="mt-2 text-[0.85rem] text-awas">Sudah maksimal, stok tinggal {it.stok}.</p>
                  ) : null}
                  <div className="mt-3 flex flex-wrap items-center gap-4 sm:hidden">
                    {!habis && <Stepper it={it} />}
                    <button type="button" className="tautan text-[0.92rem]" onClick={() => hapusItem(it.kunci)}>
                      Hapus<span className="sr-only"> {it.p.nama}</span>
                    </button>
                  </div>
                </div>
                <div className="hidden flex-col items-end justify-between gap-3 sm:flex">
                  <p className="text-lg font-semibold tabular-nums">{rupiah(it.harga * it.qty)}</p>
                  {!habis && <Stepper it={it} />}
                  <button type="button" className="tautan text-[0.92rem]" onClick={() => hapusItem(it.kunci)}>
                    Hapus<span className="sr-only"> {it.p.nama}</span>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        <Link href="/koleksi" className="tautan mt-5 inline-block font-medium">
          Lanjut belanja
        </Link>
      </section>

      <aside aria-labelledby="judul-ringkas" className="lg:col-span-4">
        <div className="rounded-[3px] border border-garis-tua bg-kertas p-5 sm:p-6 lg:sticky lg:top-24">
          <h2 id="judul-ringkas" className="text-2xl">
            Ringkasan
          </h2>
          <dl className="mt-4 grid gap-2 text-[0.95rem]">
            <div className="flex justify-between gap-4">
              <dt className="text-tinta-2">Subtotal ({jumlah} keping)</dt>
              <dd className="font-semibold tabular-nums">{rupiah(subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-tinta-2">Berat keping</dt>
              <dd className="tabular-nums">{gram(berat)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-tinta-2">Perkiraan kemasan</dt>
              <dd className="tabular-nums">{gram(beratKemasan(berat))}</dd>
            </div>
          </dl>
          <p className="mt-4 border-t border-garis pt-4 text-[0.88rem] text-tinta-2">
            Ongkir dihitung di checkout dari provinsi tujuan dan berat kiriman (dibulatkan ke atas per kg).
          </p>
          {masalah.length > 0 ? (
            <>
              <p className="mt-4 text-[0.9rem] font-medium text-awas" role="status">
                Ada {masalah.length} barang yang tidak bisa dipesan. Hapus dulu untuk melanjutkan.
              </p>
              <span className="tombol mt-4 w-full" aria-disabled="true">
                Lanjut ke checkout
              </span>
            </>
          ) : (
            <Link href="/checkout" className="tombol tombol-utama mt-5 w-full">
              Lanjut ke checkout
            </Link>
          )}
        </div>
      </aside>

      {masalah.length === 0 && (
        <div className="sticky bottom-0 z-30 -mx-4 border-t border-garis-tua bg-kertas/95 px-4 py-3 shadow-[0_-8px_20px_-12px_rgba(35,28,23,0.35)] sm:-mx-6 sm:px-6 lg:hidden">
          <div className="flex items-center gap-3">
            <p className="min-w-0 flex-1">
              <span className="block text-[0.82rem] text-tinta-2">Subtotal {jumlah} keping</span>
              <span className="block font-semibold tabular-nums">{rupiah(subtotal)}</span>
            </p>
            <Link href="/checkout" className="tombol tombol-utama px-5">
              Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
