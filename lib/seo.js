// Metadata Open Graph lengkap per halaman (Next.js mengganti objek openGraph induk, tidak menggabungkannya).
import { site } from './data';

export function ogHalaman({ path = '', judul, deskripsi }) {
  const url = `${site.url}${path}`;
  const title = judul ? `${judul} — ${site.nama}` : site.judul;
  return {
    openGraph: {
      type: 'website',
      locale: 'id_ID',
      url,
      siteName: site.nama,
      title,
      description: deskripsi,
      images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'Beranda toko demo Tanur: mangkuk seladon di atas meja putar' }],
    },
    twitter: { card: 'summary_large_image', title, description: deskripsi, images: ['/og.jpg'] },
  };
}
