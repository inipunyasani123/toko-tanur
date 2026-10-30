'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import KartuProduk from './KartuProduk';
import UbinUji from './UbinUji';
import FotoKeramik from './FotoKeramik';
import { produk, kategori, glasir } from '@/lib/data';
import { saringProduk, rentangFilter, urutan, produkAktif } from '@/lib/katalog';
import { useInventaris, useTerpasang } from '@/lib/store';

function bacaFilter(sp) {
  const daftar = (k) => (sp.get(k) || '').split(',').map((x) => x.trim()).filter(Boolean);
  return {
    q: sp.get('q') || '',
    kategori: daftar('kategori').filter((x) => kategori.some((k) => k.id === x)),
    glasir: daftar('glasir').filter((x) => glasir.some((g) => g.id === x)),
    harga: rentangFilter.some((r) => r.id === sp.get('harga')) ? sp.get('harga') : '',
    urut: urutan.some((u) => u.id === sp.get('urut')) ? sp.get('urut') : 'unggulan',
  };
}

function keQuery(f) {
  const p = new URLSearchParams();
  if (f.q.trim()) p.set('q', f.q);
  if (f.kategori.length) p.set('kategori', f.kategori.join(','));
  if (f.glasir.length) p.set('glasir', f.glasir.join(','));
  if (f.harga) p.set('harga', f.harga);
  if (f.urut && f.urut !== 'unggulan') p.set('urut', f.urut);
  const s = p.toString();
  return s ? `?${s}` : '';
}

export function GridStatis() {
  return (
    <div className="wadah pb-20">
      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
        {produk.map((p) => (
          <li key={p.slug}>
            <KartuProduk produk={p} judulTag="h2" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Katalog() {
  const sp = useSearchParams();
  const path = usePathname();
  const inventaris = useInventaris();
  const terpasang = useTerpasang();
  const [filter, setFilter] = useState(() => bacaFilter(sp));
  const [panel, setPanel] = useState(false);
  const idPanel = useId();

  // Sinkron bila URL berubah dari luar (tautan, tombol kembali).
  const kunciSp = sp.toString();
  useEffect(() => {
    setFilter(bacaFilter(new URLSearchParams(kunciSp)));
  }, [kunciSp]);

  const ubah = (patch) => {
    const baru = { ...filter, ...patch };
    setFilter(baru);
    window.history.replaceState(null, '', `${path}${keQuery(baru)}`);
  };

  const balik = (kunci, id) => {
    const ada = filter[kunci].includes(id);
    ubah({ [kunci]: ada ? filter[kunci].filter((x) => x !== id) : [...filter[kunci], id] });
  };

  const hasil = useMemo(() => saringProduk(produk, filter, terpasang ? inventaris : undefined), [filter, inventaris, terpasang]);
  const aktifSemua = produk.filter((p) => produkAktif(p, terpasang ? inventaris : undefined));
  const jumlahFilter = filter.kategori.length + filter.glasir.length + (filter.harga ? 1 : 0) + (filter.q.trim() ? 1 : 0);

  const chip = [
    ...(filter.q.trim() ? [{ label: `“${filter.q.trim()}”`, hapus: () => ubah({ q: '' }) }] : []),
    ...filter.kategori.map((id) => ({ label: kategori.find((k) => k.id === id).nama, hapus: () => balik('kategori', id) })),
    ...filter.glasir.map((id) => ({ label: glasir.find((g) => g.id === id).nama, hapus: () => balik('glasir', id) })),
    ...(filter.harga ? [{ label: rentangFilter.find((r) => r.id === filter.harga).label, hapus: () => ubah({ harga: '' }) }] : []),
  ];

  const kosongkan = () => ubah({ q: '', kategori: [], glasir: [], harga: '' });

  return (
    <div className="wadah grid gap-8 pb-20 lg:grid-cols-12">
      <div className="flex flex-wrap items-center gap-3 lg:hidden">
        <button
          type="button"
          className="tombol tombol-garis min-h-11 py-2"
          aria-expanded={panel}
          aria-controls={idPanel}
          onClick={() => setPanel((v) => !v)}
        >
          {panel ? 'Tutup saringan' : 'Saring'}
          {jumlahFilter > 0 && <span className="label-tanur rounded-full bg-liat-tua px-2 py-0.5 text-[0.75rem] text-kertas">{jumlahFilter}</span>}
        </button>
        <label className="ms-auto flex items-center gap-2 text-[0.9rem]">
          <span className="text-tinta-2">Urutkan</span>
          <select className="isian min-h-11 w-auto py-2" value={filter.urut} onChange={(e) => ubah({ urut: e.target.value })}>
            {urutan.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <aside
        id={idPanel}
        aria-label="Saringan koleksi"
        className={`${panel ? 'block' : 'hidden'} lg:sticky lg:top-24 lg:col-span-3 lg:block lg:self-start`}
      >
        <form role="search" onSubmit={(e) => e.preventDefault()} className="border-t-2 border-tinta pt-4">
          <label htmlFor="cari-koleksi" className="font-semibold">
            Cari
          </label>
          <input
            id="cari-koleksi"
            type="search"
            className="isian mt-2"
            placeholder="mis. mangkuk, kobalt"
            value={filter.q}
            onChange={(e) => ubah({ q: e.target.value })}
            autoComplete="off"
          />
        </form>

        <fieldset className="mt-7 border-t border-garis pt-4">
          <legend className="float-left w-full font-semibold">Kategori</legend>
          <ul className="clear-both grid gap-1 pt-2">
            {kategori.map((k) => {
              const n = aktifSemua.filter((p) => p.kategori === k.id).length;
              return (
                <li key={k.id}>
                  <label className="flex min-h-10 cursor-pointer items-center gap-3 rounded-sm py-1 hover:bg-tanah/60">
                    <input
                      type="checkbox"
                      className="h-[1.1rem] w-[1.1rem] accent-[#8f3f1d]"
                      checked={filter.kategori.includes(k.id)}
                      onChange={() => balik('kategori', k.id)}
                    />
                    <span>{k.nama}</span>
                    <span className="label-tanur ms-auto text-[0.75rem] text-tinta-3">{n}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>

        <fieldset className="mt-6 border-t border-garis pt-4">
          <legend className="float-left w-full font-semibold">Glasir</legend>
          <ul className="clear-both grid grid-cols-2 gap-2 pt-3">
            {glasir.map((g) => {
              const pilih = filter.glasir.includes(g.id);
              return (
                <li key={g.id}>
                  <label
                    className={`flex h-full cursor-pointer items-center gap-2 rounded-[3px] border p-2 text-[0.88rem] leading-tight has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-liat-tua ${
                      pilih ? 'border-tinta bg-kertas' : 'border-garis hover:border-garis-tua'
                    }`}
                  >
                    <input type="checkbox" className="sr-only" checked={pilih} onChange={() => balik('glasir', g.id)} />
                    <UbinUji glasir={g.id} className="w-6 shrink-0" />
                    <span>
                      {g.nama}
                      {pilih && <span className="sr-only"> (dipilih)</span>}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>

        <fieldset className="mt-6 border-t border-garis pt-4">
          <legend className="float-left w-full font-semibold">Harga</legend>
          <ul className="clear-both grid gap-1 pt-2">
            {[{ id: '', label: 'Semua harga' }, ...rentangFilter].map((r) => (
              <li key={r.id || 'semua'}>
                <label className="flex min-h-10 cursor-pointer items-center gap-3 rounded-sm py-1 hover:bg-tanah/60">
                  <input
                    type="radio"
                    name="harga"
                    className="h-[1.1rem] w-[1.1rem] accent-[#8f3f1d]"
                    checked={filter.harga === r.id}
                    onChange={() => ubah({ harga: r.id })}
                  />
                  <span>{r.label}</span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>

        {jumlahFilter > 0 && (
          <button type="button" className="tautan mt-6 font-medium" onClick={kosongkan}>
            Hapus semua saringan
          </button>
        )}
      </aside>

      <div className="lg:col-span-9">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-t-2 border-tinta pt-4">
          <p aria-live="polite" className="font-medium">
            {hasil.length === aktifSemua.length && jumlahFilter === 0
              ? `${hasil.length} keping`
              : `Menampilkan ${hasil.length} dari ${aktifSemua.length} keping`}
          </p>
          <label className="ms-auto hidden items-center gap-2 text-[0.9rem] lg:flex">
            <span className="text-tinta-2">Urutkan</span>
            <select className="isian min-h-10 w-auto py-1.5" value={filter.urut} onChange={(e) => ubah({ urut: e.target.value })}>
              {urutan.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label}
                </option>
              ))}
            </select>
          </label>
          {chip.length > 0 && (
            <ul className="flex w-full flex-wrap gap-2" aria-label="Saringan aktif">
              {chip.map((c) => (
                <li key={c.label}>
                  <button
                    type="button"
                    onClick={c.hapus}
                    className="inline-flex min-h-9 items-center gap-2 rounded-[3px] bg-tanah px-3 py-1.5 text-[0.88rem] hover:bg-tanah-2"
                  >
                    {c.label}
                    <span aria-hidden="true">×</span>
                    <span className="sr-only">, hapus saringan ini</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {hasil.length > 0 ? (
          <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3">
            {hasil.map((p) => (
              <li key={p.slug}>
                <KartuProduk produk={p} inventaris={terpasang ? inventaris : undefined} judulTag="h2" glasirTampil={filter.glasir[0]} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-8 grid items-center gap-6 rounded-[3px] border border-dashed border-garis-tua bg-kertas p-6 sm:grid-cols-[10rem_1fr] sm:p-8">
            <span className="relative mx-auto block aspect-square w-32 overflow-hidden rounded-full bg-tanah opacity-80 sm:w-40"><FotoKeramik slug="piring-kecil-jajan" sizes="160px" alt="" /></span>
            <div>
              <h2 className="text-2xl">Rak ini kosong</h2>
              <p className="mt-2 text-tinta-2">
                Tidak ada keping yang cocok dengan saringanmu. Coba kurangi saringan glasir atau harga, atau cari dengan kata lain.
              </p>
              <button type="button" className="tombol tombol-utama mt-5" onClick={kosongkan}>
                Hapus semua saringan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
