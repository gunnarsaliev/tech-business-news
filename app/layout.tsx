import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import { SiteFooter } from '@/components/site-footer'
import { type NavItem, SiteHeader } from '@/components/site-header'
import { getCategories } from '@/lib/payload'
import { categoryPath } from '@/lib/routes'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

const SITE_NAME = 'Tech Business News'
/** Most categories the header can fit on one line. */
const MAX_NAV_ITEMS = 6

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Technology and business stories that matter`,
    template: `%s | ${SITE_NAME}`,
  },
  description: 'Daily reads on technology, startups, markets and the business of innovation, written for people who want clear answers and good ideas.',
  generator: 'v0.app',
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
    <html lang="en" id="top" className={`light ${geist.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <SiteHeader items={navItems} siteName={SITE_NAME} />
        {children}
        <SiteFooter items={navItems} siteName={SITE_NAME} />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
