import { siteConfig } from '@/shared/config/site';
import type { MetadataRoute } from 'next';

/**
 * Generate robots.txt configuration.
 * Allows all crawlers to index the site.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/static/'],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
