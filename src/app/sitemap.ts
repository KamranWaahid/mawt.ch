import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mawt.ch'
  const locales = ['en', 'fr']
  const routes = [
    '',
    '/services',
    '/our-process',
    '/notre-methode',
    '/projects',
    '/about',
    '/contact',
    '/blog',
    '/faqs',
    '/partners',
    '/clients',
    '/security',
    '/securite',
    '/legal',
    '/terms',
    '/cookies',
  ]

  const sitemapEntries: MetadataRoute.Sitemap = []

  locales.forEach((lang) => {
    routes.forEach((route) => {
      sitemapEntries.push({
        url: `${baseUrl}/${lang}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
      })
    })
  })

  return sitemapEntries
}
