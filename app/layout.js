import './globals.css';
import { Young_Serif, Hanken_Grotesk, Spline_Sans_Mono } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StripTanur from '@/components/StripTanur';
import Benih from '@/components/Benih';
import { site } from '@/lib/data';

const youngSerif = Young_Serif({ weight: '400', subsets: ['latin'], variable: '--font-young-serif', display: 'swap' });
const hanken = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-hanken', display: 'swap' });
const splineMono = Spline_Sans_Mono({ subsets: ['latin'], variable: '--font-spline-mono', display: 'swap' });

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: site.nama,
  url: site.url,
  description: site.deskripsi,
  inLanguage: 'id-ID',
};

export const metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.judul, template: `%s — ${site.nama}` },
  description: site.deskripsi,
  applicationName: site.nama,
  keywords: ['keramik buatan tangan', 'mangkuk keramik', 'piring stoneware', 'toko online keramik', 'demo toko online'],
  authors: [{ name: 'PintuWeb', url: 'https://www.pintuweb.id' }],
  creator: 'PintuWeb',
  publisher: 'PintuWeb',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: site.url,
    siteName: site.nama,
    title: site.judul,
    description: site.deskripsi,
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'Beranda toko demo Tanur: mangkuk seladon di atas meja putar' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: site.judul,
    description: site.deskripsi,
    images: ['/og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
};

export const viewport = {
  themeColor: '#f3ece1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${youngSerif.variable} ${hanken.variable} ${splineMono.variable}`}>
      <body className="antialiased">
        <a href="#isi" className="sr-only-fokus fixed left-3 top-3 z-50 rounded-sm bg-tinta px-4 py-2 text-kertas">
          Langsung ke isi
        </a>
        <StripTanur />
        <Header />
        <Benih />
        <main id="isi">{children}</main>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <aside aria-label="Tentang situs demo ini" style={{ display: 'block', margin: 0, padding: '12px 16px', background: '#0f1b33', color: '#dfe6f3', font: '400 13px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', textAlign: 'center' }}>
          Situs demo buatan PintuWeb — nama dan isinya rekaan.{' '}
          <a href="https://www.pintuweb.id/kontak?demo=tanur" style={{ color: '#ffffff', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px', display: 'inline-block', padding: '8px 4px' }}>Buat yang seperti ini →</a>
        </aside>
      </body>
    </html>
  );
}
