import Image from 'next/image';
import { fotoProduk } from '@/lib/foto';

// Foto keramik persegi yang memenuhi induknya (induk harus relative + berukuran).
export default function FotoKeramik({ slug, foto, sizes = '320px', priority = false, alt, className = '' }) {
  const x = foto || fotoProduk[slug];
  if (!x) return null;
  return <Image src={x.src} alt={alt ?? x.alt} fill sizes={sizes} priority={priority} className={`object-cover ${className}`} />;
}
