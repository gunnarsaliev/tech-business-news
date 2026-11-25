'use client'

import { useEffect } from 'react'
import * as CookieConsent from 'vanilla-cookieconsent'
import 'vanilla-cookieconsent/dist/cookieconsent.css'
import { CONSENT_CATEGORIES } from '@/lib/consent'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

/** Passes the visitor's current choices to Google Consent Mode. */
function updateGoogleConsent() {
  const consent = Object.fromEntries(
    CONSENT_CATEGORIES.map((category) => [
      category.id,
      CookieConsent.acceptedCategory(category.id) ? 'granted' : 'denied',
    ]),
  )
  window.gtag?.('consent', 'update', consent)
}

/** Cookie banner and preferences modal. Choices are forwarded to Google Consent Mode. */
export function CookieConsentBanner() {
  useEffect(() => {
    CookieConsent.run({
      // Bump to re-ask everyone when categories change.
      revision: 0,
      guiOptions: {
        consentModal: { layout: 'box', position: 'bottom left', equalWeightButtons: true },
        preferencesModal: { layout: 'box', equalWeightButtons: true },
      },
      categories: Object.fromEntries(
        CONSENT_CATEGORIES.map((category) => [
          category.id,
          category.necessary ? { enabled: true, readOnly: true } : {},
        ]),
      ),
      onConsent: updateGoogleConsent,
      onChange: updateGoogleConsent,
      language: {
        default: 'en',
        translations: {
          en: {
            consentModal: {
              title: 'We value your privacy',
              description:
                'We use cookies for analytics only if you agree. You can accept all, reject all, or choose by category. You can change your choices at any time from “Cookie settings” in the footer.',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Reject all',
              showPreferencesBtn: 'Manage preferences',
              footer: '<a href="/privacy">Privacy policy</a>',
            },
            preferencesModal: {
              title: 'Cookie preferences',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Reject all',
              savePreferencesBtn: 'Save preferences',
              closeIconLabel: 'Close',
              sections: [
                {
                  title: 'Your choices',
                  description:
                    'Choose which kinds of cookies and similar storage we may use. Everything except security storage stays off until you turn it on.',
                },
                ...CONSENT_CATEGORIES.map((category) => ({
                  title: category.title,
                  description: category.description,
                  linkedCategory: category.id,
                })),
                {
                  title: 'More information',
                  description: 'Read our <a href="/privacy">privacy policy</a> for details.',
                },
              ],
            },
          },
        },
      },
    })
  }, [])

  return null
}
