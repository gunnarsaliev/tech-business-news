import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import { JsonLd } from '@/components/json-ld'
import { SiteFooter } from '@/components/site-footer'
import { type NavItem, SiteHeader } from '@/components/site-header'
import { getCategories } from '@/lib/payload'
import { categoryPath } from '@/lib/routes'
import { IS_INDEXABLE, OPEN_GRAPH_DEFAULTS, SITE_DESCRIPTION, SITE_LANGUAGE, SITE_NAME, SITE_TAGLINE, SITE_URL } from '@/lib/site'
import { siteSchema } from '@/lib/structured-data'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

/** Most categories the header can fit on one line. */
const MAX_NAV_ITEMS = 6

export const metadata: Metadata = {
  // Resolves relative canonical, Open Graph and Twitter URLs to absolute ones.
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  publisher: SITE_NAME,
  category: 'news',
  // Pages set their own canonical; this keeps the RSS feed discoverable on pages that don't.
  alternates: { types: { 'application/rss+xml': [{ url: '/feed.xml', title: `${SITE_NAME} RSS feed` }] } },
  openGraph: { ...OPEN_GRAPH_DEFAULTS, type: 'website' },
  twitter: { card: 'summary_large_image' },
  robots: IS_INDEXABLE
    ? {
        index: true,
        follow: true,
        // Large image previews are needed for Google Discover and Top Stories.
        googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
      }
    : { index: false, follow: false },
  formatDetection: { telephone: false, email: false, address: false },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffffff',
}

async function getNavItems(): Promise<NavItem[]> {
  try {
    const categories = await getCategories()
    return categories.slice(0, MAX_NAV_ITEMS).map((category) => ({ label: category.label, href: categoryPath(category.id) }))
  } catch (error) {
    // The header still renders, without categories, while the CMS is unreachable.
    console.error(error)
    return []
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const navItems = await getNavItems()

  return (
    <html lang={SITE_LANGUAGE} id="top" className={`light ${geist.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <JsonLd data={siteSchema()} />
        <SiteHeader items={navItems} siteName={SITE_NAME} />
        {children}
        <SiteFooter items={navItems} siteName={SITE_NAME} />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
