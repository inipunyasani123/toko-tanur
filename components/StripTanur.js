'use client';

import { useTerpasang } from '@/lib/store';
import { site } from '@/lib/data';
import { hariTanurBerikutnya, tanggalPanjang } from '@/lib/format';

// Pita info di atas header: tanggal tanur berikutnya dihitung dari hari ini (WIB).
export default function StripTanur() {
  const terpasang = useTerpasang();
  const berikut = terpasang ? hariTanurBerikutnya(Date.now(), site.hariTanur) : null;
  return (
    <aside aria-label="Jadwal pembakaran" className="gelap bg-jelaga text-[#efe5d8] print:hidden">
      <p className="wadah flex min-h-9 flex-wrap items-center justify-center gap-x-3 py-1.5 text-center text-[0.8rem] leading-snug">
        <span>Tanur kami dibuka tiap Kamis.</span>
        <span className="label-tanur text-[0.75rem] text-[#e9c6a6]">
          {berikut ? `Angkatan ${site.angkatanTerbaru + 1} keluar ${tanggalPanjang(berikut)}` : `Angkatan ${site.angkatanTerbaru + 1} sedang disiapkan`}
        </span>
      </p>
    </aside>
  );
}
