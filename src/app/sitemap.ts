import type { MetadataRoute } from 'next';
import { NAV, SITE } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', ...NAV.map((n) => n.href), '/contact'].map((path) => ({
    url: new URL(path, SITE.url).toString(),
    changeFrequency: 'monthly',
    priority: path === '/' ? 1 : 0.7,
  }));
}
