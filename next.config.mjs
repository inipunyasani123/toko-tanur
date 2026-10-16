/** @type {import('next').NextConfig} */
const nextConfig = {
  // Gambar statis tanpa Image Optimization Vercel: kuota tim (paket Hobby) habis dan /_next/image dijawab 402.
  // next/image memakai varian WebP di public/_img/ lewat image-loader.js (lihat image-manifest.json).
  // Setelah menambah/mengganti gambar di public/images, buat ulang variannya:
  //   node scripts/static-images.mjs . --dirs public/images
  images: {
    loader: 'custom',
    loaderFile: './image-loader.js',
    deviceSizes: [640, 828, 1080, 1280, 1920],
    imageSizes: [64, 128, 256, 384],
  },
  async headers() {
    return [{ source: '/_img/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] }];
  },
};

export default nextConfig;
