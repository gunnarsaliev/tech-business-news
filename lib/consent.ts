/**
 * Cookie consent categories. Their ids are exactly the Google Consent Mode v2 consent types, so a visitor's choice
 * maps one-to-one onto `gtag('consent', …)`. The cookie banner and the privacy policy both render this list.
 */
export type ConsentCategory = {
  id: ConsentType
  title: string
  description: string
  /** Necessary categories are always granted and can't be switched off. */
  necessary: boolean
}

export type ConsentType =
  | 'security_storage'
  | 'functionality_storage'
  | 'personalization_storage'
  | 'analytics_storage'
  | 'ad_storage'
  | 'ad_user_data'
  | 'ad_personalization'

export const CONSENT_CATEGORIES: readonly ConsentCategory[] = [
  {
    id: 'security_storage',
    title: 'Security',
    description:
      'Storage needed to keep the site secure and working, such as remembering your cookie choices and preventing abuse.',
    necessary: true,
  },
  {
    id: 'functionality_storage',
    title: 'Functionality',
    description: 'Storage that remembers settings you pick on the site, such as preferences for how pages are shown.',
    necessary: false,
  },
  {
    id: 'personalization_storage',
    title: 'Personalization',
    description: 'Storage used to personalize content for you, such as suggesting stories based on what you have read.',
    necessary: false,
  },
  {
    id: 'analytics_storage',
    title: 'Analytics',
    description:
      'Cookies used by Google Analytics to measure how visitors use the site, such as which pages are viewed and how people arrive, so we can improve it.',
    necessary: false,
  },
  {
    id: 'ad_storage',
    title: 'Advertising storage',
    description: 'Cookies used to show and measure advertising.',
    necessary: false,
  },
  {
    id: 'ad_user_data',
    title: 'Advertising user data',
    description: 'Permission to send data about your visit to Google for advertising purposes.',
    necessary: false,
  },
  {
    id: 'ad_personalization',
    title: 'Personalized advertising',
    description: 'Permission to use data about your visit to personalize the ads you see.',
    necessary: false,
  },
]

const consentDefaults = {
  ...Object.fromEntries(
    CONSENT_CATEGORIES.map((category) => [category.id, category.necessary ? 'granted' : 'denied']),
  ),
  // Must be a key of the consent object: GTM rejects the whole command if it's passed as a separate argument.
  wait_for_update: 500,
}

/**
 * Runs before any Google tag: sets up the dataLayer and the `gtag` helper, and denies every optional consent type
 * until the visitor chooses. `gtag` must push the `arguments` object itself; GTM ignores plain arrays.
 */
export const CONSENT_DEFAULTS_SCRIPT = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', ${JSON.stringify(consentDefaults)});
gtag('set', 'ads_data_redaction', true);
`.trim()

/** Google Tag Manager container ID for this site. GTM doesn't load when it's unset. */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID?.trim() || undefined

/** The standard GTM loader snippet. The `gtm.js` event it pushes is what fires GTM's Initialization/All Pages triggers. */
export function gtmScript(id: string): string {
  return `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer',${JSON.stringify(id)});`
}
