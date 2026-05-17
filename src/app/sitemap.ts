import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mawt.ch'
  const locales = ['en', 'fr']
  const routes = [
    '',
    '/services',
    '/process',
    '/projects',
    '/about',
    '/contact',
    '/docs',
    '/blog',
    '/help',
    '/faqs',
    '/results',
    '/pricing',
    '/integrations',
    '/partners',
    '/community',
    '/careers',
    '/security',
    '/status',
    '/legal',
    '/enterprise',
    '/small-business',
    '/personal',
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
