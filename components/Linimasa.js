// Linimasa status pesanan dengan waktu WIB.
import { statusPesanan } from '@/lib/data';
import { indeksStatus, waktuStatus } from '@/lib/pesanan';
import { waktuWIB } from '@/lib/format';

export default function Linimasa({ pesanan, ringkas = false }) {
  const kini = indeksStatus(pesanan.status);
  return (
    <ol className="relative grid gap-0">
      {statusPesanan.map((s, i) => {
        const selesai = i <= kini;
        const sekarang = i === kini;
        const waktu = waktuStatus(pesanan, s.id);
        return (
          <li key={s.id} className="relative grid grid-cols-[2rem_1fr] gap-3 pb-6 last:pb-0" aria-current={sekarang ? 'step' : undefined}>
            {i < statusPesanan.length - 1 && (
              <span
                aria-hidden="true"
                className={`absolute left-[0.94rem] top-6 h-[calc(100%-1.25rem)] w-0.5 ${i < kini ? 'bg-tinta' : 'bg-garis-tua/60'}`}
              />
            )}
            <span aria-hidden="true" className="relative mt-0.5 flex h-8 w-8 items-center justify-center">
              {sekarang ? (
                <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-liat-tua bg-kertas">
                  <span className="h-3 w-3 rounded-full bg-liat-tua" />
                </span>
              ) : selesai ? (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-tinta text-kertas">
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5">
                    <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              ) : (
                <span className="h-5 w-5 rounded-full border-2 border-garis-tua bg-bisque" />
              )}
            </span>
            <div>
              <p className={`font-semibold leading-tight ${selesai ? 'text-tinta' : 'text-tinta-3'}`}>
                {s.label}
                <span className="sr-only">{sekarang ? ' (status sekarang)' : selesai ? ' (selesai)' : ' (belum)'}</span>
              </p>
              <p className="label-tanur mt-1 text-[0.75rem] text-tinta-2">{waktu ? waktuWIB(waktu) : 'Belum'}</p>
              {!ringkas && selesai && <p className="mt-1 text-[0.9rem] text-tinta-2">{s.ket}</p>}
              {!ringkas && s.id === 'dikirim' && pesanan.resi && (
                <p className="mt-1 text-[0.9rem]">
                  Resi contoh: <span className="label-tanur text-[0.75rem] text-tinta">{pesanan.resi}</span>
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
