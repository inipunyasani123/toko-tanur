'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import FotoKeramik from './FotoKeramik';
import UbinUji from './UbinUji';
import Stempel from './Stempel';
import { cariProduk, cariGlasir, perawatanUmum, perawatanGlasir, catatanVariasi, site } from '@/lib/data';
import { hargaVarian, stokVarian, varianAwal, stokGlasir, produkAktif } from '@/lib/katalog';
import { rupiah, gram, suhu } from '@/lib/format';
import { fotoProduk } from '@/lib/foto';
import { useInventaris, useKeranjang, useTerpasang, tambahKeKeranjang } from '@/lib/store';

const LATAR = {
  seladon: 'bg-seladon-muda',
  kobalt: 'bg-kobalt-muda',
  tenmoku: 'bg-tanah',
  abu: 'bg-[#ece3d4]',
};


export default function DetailProduk({ slug }) {
  const p = cariProduk(slug);
  const terpasang = useTerpasang();
  const invAsli = useInventaris();
  const inv = terpasang ? invAsli : undefined;
  const keranjang = useKeranjang();
  const awal = varianAwal(p);
  const [g, setG] = useState(awal.glasir);
  const [u, setU] = useState(awal.ukuran);
  const [qty, setQty] = useState(1);
  const [gambar, setGambar] = useState(0);
  const [pesan, setPesan] = useState(null);
  const [lengket, setLengket] = useState(false);
  const tombolRef = useRef(null);
  const sudahAtur = useRef(false);

  // Setelah terpasang: pakai glasir dari URL (?glasir=) dan stok sebenarnya di browser.
  useEffect(() => {
    if (!terpasang || sudahAtur.current) return;
    sudahAtur.current = true;
    const dariUrl = new URLSearchParams(window.location.search).get('glasir');
    let gBaru = g;
    let uBaru = u;
    if (dariUrl && p.glasir.includes(dariUrl)) gBaru = dariUrl;
    if (stokVarian(p, gBaru, uBaru, invAsli) <= 0) {
      const adaUkuran = p.ukuran.find((x) => stokVarian(p, gBaru, x.id, invAsli) > 0);
      if (adaUkuran) uBaru = adaUkuran.id;
      else {
        const v = varianAwal(p, invAsli);
        gBaru = v.glasir;
        uBaru = v.ukuran;
      }
    }
    setG(gBaru);
    setU(uBaru);
  }, [terpasang, invAsli, p, g, u]);

  // Bilah beli di ponsel muncul saat tombol utama tidak terlihat.
  useEffect(() => {
    const el = tombolRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setLengket(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const aktif = produkAktif(p, inv);
  const gl = cariGlasir(g);
  const ukuran = p.ukuran.find((x) => x.id === u) || p.ukuran[0];
  const harga = hargaVarian(p, g, u);
  const tambahan = (p.tambahanGlasir || {})[g] || 0;
  const stok = stokVarian(p, g, u, inv);
  const diKeranjang = terpasang
    ? keranjang.filter((it) => it.slug === p.slug && it.glasir === g && it.ukuran === u).reduce((n, it) => n + it.qty, 0)
    : 0;
  const bisaTambah = Math.max(0, stok - diKeranjang);
  const qtyAman = Math.min(Math.max(1, qty), Math.max(1, bisaTambah));
  const iU = p.ukuran.findIndex((x) => x.id === u);

  const pilihGlasir = (id) => {
    setG(id);
    setQty(1);
    setPesan(null);
    setGambar(0);
    if (stokVarian(p, id, u, inv) <= 0) {
      const lain = p.ukuran.find((x) => stokVarian(p, id, x.id, inv) > 0);
      if (lain) setU(lain.id);
    }
  };

  const pilihUkuran = (id) => {
    setU(id);
    setQty(1);
    setPesan(null);
  };

  const tambah = () => {
    if (!aktif || bisaTambah <= 0) return;
    const r = tambahKeKeranjang({ slug: p.slug, glasir: g, ukuran: u, qty: qtyAman });
    if (r.ok) {
      setPesan({ ok: true, teks: `${r.ditambahkan} × ${p.nama} (${gl.nama} · ${ukuran.label}) masuk keranjang.` });
      setQty(1);
    } else {
      setPesan({ ok: false, teks: 'Stok varian ini sudah habis atau semuanya sudah ada di keranjangmu.' });
    }
  };

  const galeri = [
    { jenis: 'foto', ...fotoProduk[p.slug], label: `Foto ${p.nama}` },
    { jenis: 'jajaran', label: 'Semua pilihan glasir' },
    ...p.foto.map((f) => ({ jenis: 'foto', ...f, label: `Foto suasana, glasir ${cariGlasir(f.glasir)?.nama}` })),
  ];
  const tampil = galeri[Math.min(gambar, galeri.length - 1)];

  const perawatan = [...perawatanUmum, ...(p.perawatan || []), ...(perawatanGlasir[g] ? [perawatanGlasir[g]] : [])];

  const statusStok =
    stok <= 0 ? 'Habis untuk pilihan ini' : stok <= 3 ? `Sisa ${stok}` : `Stok ${stok}`;

  return (
    <div className="relative">
      <div className="wadah grid gap-x-12 gap-y-8 lg:grid-cols-12">
        {/* Galeri */}
        <div className="lg:col-span-7">
          <div className="lg:sticky lg:top-24">
            <div className={`cincin relative aspect-square overflow-hidden rounded-[3px] ${tampil.jenis === 'foto' ? 'bg-jelaga' : LATAR[g]}`}>
              {tampil.jenis === 'jajaran' && (
                <div className="absolute inset-0 grid grid-cols-2 place-items-center gap-2 p-6" role="img" aria-label={`${p.nama} dalam ${p.glasir.length} glasir: ${p.glasir.map((x) => cariGlasir(x).nama).join(', ')}`}>
                  {p.glasir.map((x) => (
                    <div key={x} className="flex w-full flex-col items-center">
                      <UbinUji glasir={x} className="w-[34%]" />
                      <span className="label-tanur text-[0.64rem] text-tinta-2">{cariGlasir(x).nama}</span>
                    </div>
                  ))}
                </div>
              )}
              {tampil.jenis === 'foto' && (
                <figure className="absolute inset-0 m-0">
                  <Image src={tampil.src} alt={tampil.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
                  <figcaption className="label-tanur absolute bottom-3 left-3 bg-kertas/90 px-2 py-1 text-[0.64rem] text-tinta">
                    {tampil.glasir ? `Foto suasana · glasir ${cariGlasir(tampil.glasir)?.nama}` : 'Foto contoh bentuk · warna glasir ada di ubin uji'}
                  </figcaption>
                </figure>
              )}
              <p className="label-tanur absolute left-3 top-3 bg-kertas/90 px-2 py-1 text-[0.64rem] text-tinta-2">
                Angkatan {p.angkatan} · {gl.kode}
              </p>
            </div>
            <ul className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Gambar produk">
              {galeri.map((it, i) => (
                <li key={`${it.jenis}-${i}`} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setGambar(i)}
                    aria-label={it.label}
                    aria-pressed={i === gambar}
                    className={`relative block h-20 w-20 overflow-hidden rounded-[3px] border-2 sm:h-24 sm:w-24 ${
                      i === gambar ? 'border-tinta' : 'border-transparent hover:border-garis-tua'
                    } ${it.jenis === 'foto' ? 'bg-tanah' : LATAR[g]}`}
                  >
                    {it.jenis === 'foto' ? (
                      <Image src={it.src} alt="" fill sizes="96px" className="object-cover" />
                    ) : it.jenis === 'jajaran' ? (
                      <span className="grid h-full w-full grid-cols-2 place-items-center p-1">
                        {p.glasir.slice(0, 4).map((x) => (
                          <span key={x} className="block h-4 w-4 rounded-[2px]" style={{ background: cariGlasir(x).warna }} />
                        ))}
                      </span>
                    
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Info beli */}
        <div className="lg:col-span-5">
          <p className="label-tanur text-[0.68rem] text-liat-tua">
            Stoneware · {suhu(site.suhuPuncak)} · angkatan {p.angkatan}
          </p>
          <h1 className="mt-2 text-[2.4rem] leading-[1.05] sm:text-5xl">{p.nama}</h1>
          <p className="mt-3 text-[1.05rem] text-tinta-2">{p.ringkas}</p>

          <div className="mt-6 flex flex-wrap items-end gap-x-4 gap-y-1 border-y border-garis py-4">
            <p className="text-[2rem] font-semibold leading-none tracking-tight">{rupiah(harga)}</p>
            <p className="pb-0.5 text-[0.9rem] text-tinta-2">
              {gl.nama}, {ukuran.label}
              {tambahan > 0 && ` · termasuk tambahan glasir ${rupiah(tambahan)}`}
            </p>
          </div>

          {!aktif && (
            <p className="mt-5 rounded-[3px] border border-awas bg-[#fdf4ef] p-3 text-awas" role="status">
              Produk ini sedang tidak dijual. Penjual menonaktifkannya dari dasbor demo.
            </p>
          )}

          <fieldset className="mt-6">
            <legend className="font-semibold">
              Glasir: <span className="font-normal text-tinta-2">{gl.nama}</span>
            </legend>
            <div className="mt-3 grid grid-cols-4 gap-2 sm:flex sm:flex-wrap">
              {p.glasir.map((id) => {
                const x = cariGlasir(id);
                const habis = stokGlasir(p, id, inv) <= 0;
                return (
                  <label
                    key={id}
                    className={`relative flex flex-col items-center rounded-[3px] border-2 px-1 pb-2 pt-2 text-center sm:w-[5.4rem] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-liat-tua ${
                      g === id ? 'border-tinta bg-kertas' : 'border-transparent hover:border-garis-tua'
                    } ${habis ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                  >
                    <input
                      type="radio"
                      name={`glasir-${p.slug}`}
                      value={id}
                      checked={g === id}
                      disabled={habis}
                      onChange={() => pilihGlasir(id)}
                      className="sr-only"
                    />
                    <UbinUji glasir={id} className="w-9" />
                    <span className="mt-1.5 text-[0.8rem] leading-tight">{x.nama}</span>
                    {habis && <span className="label-tanur mt-0.5 text-[0.6rem] text-awas">Habis</span>}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="mt-6">
            <legend className="font-semibold">{p.ukuran.length > 1 ? 'Ukuran atau isi' : 'Ukuran'}</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {p.ukuran.map((x) => {
                const s = stokVarian(p, g, x.id, inv);
                const habis = s <= 0;
                return (
                  <label
                    key={x.id}
                    className={`flex items-start justify-between gap-3 rounded-[3px] border-2 p-3 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-liat-tua ${
                      u === x.id ? 'border-tinta bg-kertas' : 'border-garis hover:border-garis-tua'
                    } ${habis ? 'cursor-not-allowed bg-bisque text-tinta-3' : 'cursor-pointer'}`}
                  >
                    <input
                      type="radio"
                      name={`ukuran-${p.slug}`}
                      value={x.id}
                      checked={u === x.id}
                      disabled={habis}
                      onChange={() => pilihUkuran(x.id)}
                      className="sr-only"
                    />
                    <span>
                      <span className="block font-medium text-tinta">{x.label}</span>
                      <span className="block text-[0.85rem] text-tinta-2">{x.detail}</span>
                    </span>
                    <span className="text-end">
                      <span className="block text-[0.9rem] font-medium text-tinta">{rupiah(hargaVarian(p, g, x.id))}</span>
                      <span className={`label-tanur block text-[0.6rem] ${habis ? 'text-awas' : s <= 3 ? 'text-awas' : 'text-tinta-3'}`}>
                        {habis ? 'Habis' : s <= 3 ? `Sisa ${s}` : `Stok ${s}`}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-6">
            <p className={`text-[0.95rem] font-medium ${stok <= 3 ? 'text-awas' : 'text-aman'}`}>
              {statusStok}
              {diKeranjang > 0 && <span className="font-normal text-tinta-2"> · {diKeranjang} sudah di keranjangmu</span>}
            </p>
            <div className="mt-3 flex flex-wrap items-stretch gap-3">
              <div className="flex items-stretch rounded-[3px] border-[1.5px] border-garis-tua bg-kertas" role="group" aria-label="Jumlah">
                <button
                  type="button"
                  className="w-11 text-xl disabled:text-tinta-3"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qtyAman <= 1 || bisaTambah <= 0}
                  aria-label="Kurangi jumlah"
                >
                  −
                </button>
                <label htmlFor={`qty-${p.slug}`} className="sr-only">
                  Jumlah
                </label>
                <input
                  id={`qty-${p.slug}`}
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={Math.max(1, bisaTambah)}
                  value={qtyAman}
                  onChange={(e) => setQty(Number(e.target.value) || 1)}
                  disabled={bisaTambah <= 0 || !aktif}
                  className="w-12 bg-transparent text-center font-semibold [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  className="w-11 text-xl disabled:text-tinta-3"
                  onClick={() => setQty((q) => Math.min(bisaTambah, q + 1))}
                  disabled={qtyAman >= bisaTambah}
                  aria-label="Tambah jumlah"
                >
                  +
                </button>
              </div>
              <button
                ref={tombolRef}
                type="button"
                className="tombol tombol-utama flex-1 px-6"
                onClick={tambah}
                disabled={!aktif || bisaTambah <= 0}
              >
                {!aktif ? 'Tidak dijual' : stok <= 0 ? 'Habis' : bisaTambah <= 0 ? 'Semua stok ada di keranjang' : 'Masukkan keranjang'}
              </button>
            </div>
            <p className="mt-2 text-[0.85rem] text-tinta-3">
              Maksimal {Math.max(0, bisaTambah)} lagi untuk pilihan ini, sesuai stok.
            </p>
            <div role="status" aria-live="polite" className="min-h-[1.5rem]">
              {pesan && (
                <p className={`mt-3 rounded-[3px] p-3 text-[0.95rem] ${pesan.ok ? 'bg-seladon-muda text-tinta' : 'bg-[#fdf4ef] text-awas'}`}>
                  {pesan.teks}{' '}
                  {pesan.ok && (
                    <Link href="/keranjang" className="tautan font-semibold">
                      Lihat keranjang
                    </Link>
                  )}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex gap-4 rounded-[3px] border border-garis-tua bg-kertas p-4">
            <Stempel className="h-12 w-12 shrink-0 text-liat-tua" />
            <p className="text-[0.92rem] text-tinta-2">{catatanVariasi}</p>
          </div>

          <div className="mt-8 grid gap-7">
            <section aria-labelledby="judul-tentang">
              <h2 id="judul-tentang" className="font-sans text-lg font-semibold tracking-normal">
                Tentang keping ini
              </h2>
              <p className="mt-2 text-tinta-2">{p.deskripsi}</p>
            </section>

            <section aria-labelledby="judul-ukuran">
              <h2 id="judul-ukuran" className="font-sans text-lg font-semibold tracking-normal">
                Ukuran dan berat
              </h2>
              <div className="mt-3">
                <table className="w-full border-collapse text-left text-[0.92rem]">
                  <thead>
                    <tr className="border-b border-tinta">
                      <th scope="col" className="py-2 pe-3 font-semibold">Pilihan</th>
                      <th scope="col" className="py-2 pe-3 font-semibold">Ukuran</th>
                      <th scope="col" className="py-2 text-end font-semibold">Berat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.ukuran.map((x) => (
                      <tr key={x.id} className={`border-b border-garis ${x.id === u ? 'bg-kertas' : ''}`}>
                        <th scope="row" className="py-2.5 pe-3 font-medium">{x.label}</th>
                        <td className="py-2.5 pe-3 text-tinta-2">{x.detail}</td>
                        <td className="py-2.5 text-end tabular-nums">{gram(x.berat)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section aria-labelledby="judul-glasir">
              <h2 id="judul-glasir" className="font-sans text-lg font-semibold tracking-normal">
                Glasir {gl.nama}
              </h2>
              <p className="mt-2 text-tinta-2">
                {gl.catatan} Permukaan {gl.kilap.toLowerCase()}. Kode ubin uji {gl.kode}.
              </p>
            </section>

            <section aria-labelledby="judul-rawat">
              <h2 id="judul-rawat" className="font-sans text-lg font-semibold tracking-normal">
                Perawatan
              </h2>
              <ul className="mt-2 grid gap-2 text-tinta-2">
                {perawatan.map((t) => (
                  <li key={t} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-liat" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="judul-kirim">
              <h2 id="judul-kirim" className="font-sans text-lg font-semibold tracking-normal">
                Pengiriman
              </h2>
              <p className="mt-2 text-tinta-2">
                Dikirim dari studio di {site.asal}. Pesanan yang dibayar sebelum {site.batasKemas} dikemas hari itu juga. Ongkir dihitung
                otomatis di checkout dari berat ({gram(ukuran.berat)} per pilihan ini) dan provinsi tujuan.{' '}
                <Link href="/bantuan#pengiriman" className="tautan">
                  Lihat contoh tarif
                </Link>
              </p>
            </section>
          </div>
        </div>
      </div>

      {/* Bilah beli lengket untuk ponsel */}
      <div
        className={`sticky bottom-0 z-30 mt-10 border-t border-garis-tua bg-kertas/95 py-3 shadow-[0_-8px_20px_-12px_rgba(35,28,23,0.35)] transition-opacity lg:hidden ${
          lengket ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!lengket}
      >
        <div className="wadah flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.85rem] text-tinta-2">
              {gl.nama} · {ukuran.label}
            </p>
            <p className="font-semibold">{rupiah(harga)}</p>
          </div>
          <button type="button" className="tombol tombol-utama px-5" onClick={tambah} disabled={!aktif || bisaTambah <= 0} tabIndex={lengket ? 0 : -1}>
            {bisaTambah <= 0 ? 'Habis' : 'Masukkan keranjang'}
          </button>
        </div>
      </div>
    </div>
  );
}

