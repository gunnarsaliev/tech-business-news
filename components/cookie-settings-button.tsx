'use client'

import { showPreferences } from 'vanilla-cookieconsent'

/**
 * Reopens the cookie preferences modal. Uses a click handler rather than the library's `data-cc` attribute, which
 * only binds elements present when the library starts and so breaks after client-side navigation.
 */
export function CookieSettingsButton({
  className,
  children = 'Cookie settings',
}: {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <button type="button" className={className} onClick={() => showPreferences()}>
      {children}
    </button>
  )
}
