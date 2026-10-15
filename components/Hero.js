'use client';

import Link from 'next/link';
import { useState } from 'react';
import Ware from './Ware';
import UbinUji from './UbinUji';
import LabelTanur from './LabelTanur';
import { glasir, site, cariProduk } from '@/lib/data';
import { hariTanurTerakhir, tanggalPendek, rupiah, suhu } from '@/lib/format';
import { hargaVarian } from '@/lib/katalog';
import { useTerpasang } from '@/lib/store';

const PRODUK_HERO = 'mangkuk-nasi-genggam';

export default function Hero() {
  const [pilih, setPilih] = useState('seladon');
  const [putar, setPutar] = useState(0);
  const terpasang = useTerpasang();
  const p = cariProduk(PRODUK_HERO);
  const g = glasir.find((x) => x.id === pilih);
  const terakhir = terpasang ? hariTanurTerakhir(Date.now(), site.hariTanur) : null;

  const ganti = (id) => {
    setPilih(id);
    setPutar((r) => r + 120);
  };

  return (
    <section aria-labelledby="judul-hero" className="relative overflow-hidden">
      <div className="wadah grid gap-x-10 gap-y-9 pb-14 pt-10 md:pt-14 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:pb-20">
        <div className="lg:col-span-6 lg:row-start-1">
          <h1 id="judul-hero" className="text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-[4.6rem]">
            Dibentuk di meja putar, dibakar per&nbsp;angkatan.
          </h1>
          <p className="mt-6 max-w-xl text-[1.08rem] leading-relaxed text-tinta-2">
            Mangkuk, piring, cangkir, dan teko stoneware untuk dipakai setiap hari. Tanur kami dibuka tiap Kamis, dan hanya
            keping yang lolos pemeriksaan yang masuk ke toko ini.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href="/koleksi" className="tombol tombol-utama px-6">
              Lihat koleksi
            </Link>
            <Link href="/#proses" className="tautan font-medium">
              Cara kami membuat
            </Link>
          </div>
        </div>

        <div className="relative lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:self-center">
          <div className="relative mx-auto aspect-square w-full max-w-[34rem]">
            <div
              aria-hidden="true"
              className="cincin absolute inset-0 rounded-full bg-tanah transition-transform duration-[1100ms] ease-out motion-reduce:transition-none"
              style={{ transform: `rotate(${putar}deg)` }}
            >
              <span className="absolute left-1/2 top-[3%] h-3 w-6 -translate-x-1/2 rounded-full bg-tanah-2" />
              <span className="absolute bottom-[9%] left-[14%] h-2 w-2 rounded-full bg-[#c4a17f]" />
            </div>
            <div aria-hidden="true" className="absolute inset-[13%] rounded-full border border-[#cdb497]" />
            <Ware
              key={pilih}
              bentuk={p.bentuk}
              glasir={pilih}
              ukuranId="besar"
              iUkuran={1}
              nUkuran={2}
              judul={`Ilustrasi ${p.nama} dengan glasir ${g.nama}`}
              className="absolute inset-[6%] h-[88%] w-[88%] animate-[muncul_0.5s_ease-out] motion-reduce:animate-none"
            />
            <LabelTanur
              className="absolute right-[2%] top-[4%] w-40 sm:right-[4%]"
              baris={[
                `Angkatan ${site.angkatanTerbaru}`,
                `${suhu(site.suhuPuncak)} · 13 jam`,
                terakhir ? `Keluar ${tanggalPendek(terakhir)}` : 'Keluar Kamis lalu',
              ]}
            />
          </div>
          <p className="mx-auto mt-4 flex max-w-[34rem] flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-garis-tua pt-3 text-[0.92rem]">
            <span>
              <span className="text-tinta-3">Di gambar: </span>
              {p.nama}, {g.nama}
            </span>
            <Link href={`/produk/${p.slug}?glasir=${pilih}`} className="tautan font-medium">
              mulai {rupiah(hargaVarian(p, pilih, p.ukuran[0].id))}
              <span className="sr-only">, lihat {p.nama}</span>
            </Link>
          </p>
        </div>

        <fieldset className="max-w-xl lg:col-span-6 lg:row-start-2 lg:self-start">
          <legend className="label-tanur text-tinta-2">Coba ganti glasirnya</legend>
          <div className="relative mt-4">
            <div aria-hidden="true" className="absolute inset-x-0 top-[5px] h-[3px] rounded-full bg-[#8a6a4f]" />
            <div className="relative grid grid-cols-4 gap-3 sm:gap-5">
              {glasir.map((x) => (
                <div key={x.id} className="relative">
                  <input
                    type="radio"
                    id={`hero-${x.id}`}
                    name="glasir-hero"
                    value={x.id}
                    checked={pilih === x.id}
                    onChange={() => ganti(x.id)}
                    className="peer sr-only"
                  />
                  <label
                    htmlFor={`hero-${x.id}`}
                    className="group flex cursor-pointer flex-col items-center rounded-sm pb-1 text-center peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-liat-tua peer-checked:[&_.ubin]:translate-y-2 peer-checked:[&_.nama]:underline"
                  >
                    <span aria-hidden="true" className="relative z-10 block h-3 w-3 rounded-full border-2 border-[#5b4434] bg-[#c9a37f]" />
                    <UbinUji glasir={x.id} className="ubin -mt-1.5 h-auto w-12 transition-transform duration-300 group-hover:translate-y-1 sm:w-14" />
                    <span className="label-tanur mt-2 text-[0.62rem] text-tinta-3">{x.kode}</span>
                    <span className="nama mt-0.5 text-[0.85rem] font-medium leading-tight decoration-liat decoration-2 underline-offset-4">
                      {x.nama}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </fieldset>
      </div>
    </section>
  );
}
