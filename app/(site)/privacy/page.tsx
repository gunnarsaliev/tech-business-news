import Link from 'next/link'
import { CookieSettingsButton } from '@/components/cookie-settings-button'
import { StaticPage, staticPageMetadata } from '@/components/static-page'
import { CONSENT_CATEGORIES } from '@/lib/consent'
import { CONTACT_EMAIL, SITE_NAME } from '@/lib/site'

// TEMPLATE: describes what this codebase does today; it is not legal advice. Have it reviewed (e.g. for GDPR)
// before launch, and update it whenever analytics, ads, newsletters or accounts are added — including any tag
// added inside Google Tag Manager, which doesn't show up in this codebase.
const LAST_UPDATED = 'November 25, 2026'

const page = {
  path: '/privacy',
  title: 'Privacy policy',
  description: `What information ${SITE_NAME} collects when you read the site, and how it is used.`,
}

const linkClassName = 'cursor-pointer font-medium underline underline-offset-2'

export const metadata = staticPageMetadata(page)

export default function PrivacyPage() {
  return (
    <StaticPage {...page}>
      <p>
        <em>Last updated: {LAST_UPDATED}</em>
      </p>

      <h2>The short version</h2>
      <p>
        You can read {SITE_NAME} without an account. We don&apos;t show ads and we don&apos;t sell personal
        information. We use Google Analytics only if you agree to analytics cookies. You can change your choices at any
        time in <CookieSettingsButton className={linkClassName} />, which is also linked in the footer of every page.
      </p>

      <h2>Cookies and your consent</h2>
      <p>
        On your first visit, a banner asks which kinds of cookies and similar storage we may use. Everything except
        security storage stays off until you choose. We remember your choice in a cookie, and we may ask again if we
        change these categories.
      </p>
      <ul>
        {CONSENT_CATEGORIES.map((category) => (
          <li key={category.id}>
            <strong>{category.title}</strong>
            {category.necessary && ' (always on)'}: {category.description}
          </li>
        ))}
      </ul>

      <h2>Google Analytics and Google Tag Manager</h2>
      <p>
        We use Google Analytics 4, loaded through Google Tag Manager, to understand how the site is used. With your
        consent to analytics, Google Analytics records things like the pages you view, how long you stay, how you
        arrived (for example from a search engine or social network), your approximate location (city or country) and
        your device and browser type. It identifies returning browsers with first-party cookies named{' '}
        <code>_ga</code> and <code>_ga_&lt;ID&gt;</code>, which last up to two years. Google Analytics 4 doesn&apos;t
        log or store IP addresses.
      </p>
      <p>
        Google Tag Manager itself only loads the Google Analytics tag and sets no cookies. We use Google Consent Mode to
        pass your choices to Google. If you decline analytics, Google Analytics doesn&apos;t set or read its cookies,
        though Google may still receive basic cookieless signals, such as that a page was loaded.
      </p>
      <p>
        Learn more in{' '}
        <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
          how Google uses information from sites that use its services
        </a>{' '}
        and{' '}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
          Google&apos;s privacy policy
        </a>
        . You can also install the{' '}
        <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
          Google Analytics opt-out browser add-on
        </a>
        .
      </p>
      <p>
        We don&apos;t currently show ads. The advertising and personalization choices in our cookie settings are there
        so that any such features are off unless you agree to them.
      </p>

      <h2>Vercel Analytics</h2>
      <p>
        We also use Vercel Web Analytics and Speed Insights to understand which pages are read and how fast they load.
        They work without cookies and report aggregated statistics, such as page views, referring sites, countries,
        device types and loading times, rather than profiles of individual visitors.
      </p>

      <h2>Hosting and server logs</h2>
      <p>
        The site is hosted by Vercel. Like most web hosts, its servers briefly keep technical logs of requests, such as IP
        addresses, browser types and the pages requested, to keep the service running and secure.
      </p>

      <h2>Sharing buttons</h2>
      <p>
        The share buttons on our stories only contact X or LinkedIn when you click them. Those services then handle your
        information under their own privacy policies.
      </p>

      <h2>Your choices</h2>
      <p>
        You can change or withdraw your cookie consent at any time in{' '}
        <CookieSettingsButton className={linkClassName} />. You can also block or delete cookies in your browser&apos;s
        settings.
      </p>

      <h2>Questions</h2>
      <p>
        {CONTACT_EMAIL ? (
          <>
            For any privacy question or request, email us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </>
        ) : (
          <>
            For any privacy question or request, please <Link href="/contact">contact us</Link>.
          </>
        )}
      </p>
    </StaticPage>
  )
}
