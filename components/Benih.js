'use client';

import { useEffect } from 'react';
import { pastikanContoh } from '@/lib/store';

// Saat kunjungan pertama, isi beberapa pesanan contoh dengan tanggal relatif hari ini (WIB).
export default function Benih() {
  useEffect(() => {
    pastikanContoh();
  }, []);
  return null;
}
