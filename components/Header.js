'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Stempel from './Stempel';
import { nav } from '@/lib/data';
import { useKeranjang, useTerpasang } from '@/lib/store';

function IkonTas({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path d="M5 8.5h14l-1.1 11.2a1.5 1.5 0 0 1-1.5 1.3H7.6a1.5 1.5 0 0 1-1.5-1.3L5 8.5Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M8.8 8.5V7a3.2 3.2 0 0 1 6.4 0v1.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export default function Header() {
  const path = usePathname();
  const [buka, setBuka] = useState(false);
  const keranjang = useKeranjang();
  const terpasang = useTerpasang();
  const jumlah = terpasang ? keranjang.reduce((n, it) => n + it.qty, 0) : 0;

  useEffect(() => {
    setBuka(false);
  }, [path]);

  const aktif = (href) => {
    if (href.startsWith('/#')) return false;
    return path === href || path.startsWith(`${href}/`);
  };

  return (
    <header data-situs className="sticky top-0 z-40 border-b border-garis bg-bisque">
      <div className="wadah flex h-16 items-center gap-3">
        <Link href="/" className="group flex shrink-0 items-center gap-2 rounded-sm sm:gap-2.5" aria-label="Tanur, ke beranda">
          <Stempel className="h-8 w-8 text-liat-tua transition-transform duration-300 group-hover:rotate-[18deg] sm:h-9 sm:w-9" />
          <span className="font-display text-[1.5rem] leading-none tracking-tight sm:text-[1.7rem]">Tanur</span>
        </Link>

        <nav aria-label="Navigasi utama" className="ms-auto hidden md:block">
          <ul className="flex items-center gap-1">
            {nav.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={aktif(n.href) ? 'page' : undefined}
                  className="rounded-sm px-3 py-2 text-[0.95rem] font-medium text-tinta-2 underline-offset-[6px] hover:text-tinta hover:underline aria-[current=page]:text-tinta aria-[current=page]:underline aria-[current=page]:decoration-liat aria-[current=page]:decoration-2"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          href="/keranjang"
          className="ms-auto flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-sm px-2 py-2 font-medium hover:bg-tanah md:ms-3"
          aria-current={path === '/keranjang' ? 'page' : undefined}
        >
          {/* Nama tautan dirakit dari isinya ("Keranjang 0 barang"), jadi selalu memuat teks yang terlihat. */}
          <IkonTas className="h-6 w-6" />
          <span className="sr-only sm:not-sr-only">Keranjang</span>{' '}
          <span
            className={`label-tanur inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[0.75rem] font-semibold ${
              jumlah ? 'bg-liat-tua text-kertas' : 'bg-tanah text-tinta-2'
            }`}
          >
            {jumlah}
          </span>
          <span className="sr-only"> barang</span>
        </Link>

        <button
          type="button"
          className="flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-sm px-2 py-2 font-medium hover:bg-tanah md:hidden"
          aria-expanded={buka}
          aria-controls="menu-ponsel"
          onClick={() => setBuka((b) => !b)}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" focusable="false">
            {buka ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <path d="M4 8h16M4 16h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            )}
          </svg>
          <span className="max-[359px]:sr-only">Menu</span>
        </button>
      </div>

      <nav id="menu-ponsel" aria-label="Navigasi utama (ponsel)" hidden={!buka} className="border-t border-garis md:hidden">
        <ul className="wadah grid py-2">
          {nav.map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                aria-current={aktif(n.href) ? 'page' : undefined}
                className="flex min-h-12 items-center justify-between border-b border-garis/70 py-3 font-display text-xl last:border-0 aria-[current=page]:text-liat-tua"
                onClick={() => setBuka(false)}
              >
                {n.label}
                <span aria-hidden="true" className="text-tinta-3">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
