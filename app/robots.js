import { site } from '@/lib/data';

export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/checkout', '/keranjang', '/pesanan/'] },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
