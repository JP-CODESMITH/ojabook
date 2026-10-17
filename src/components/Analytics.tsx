import { useEffect } from 'react'

/**
 * Analytics placeholder.
 *
 * This is where the web-analytics snippet goes (Cloudflare Web Analytics or
 * similar). It is intentionally inert until a token is configured, and it is
 * loaded defensively so that being offline — or the analytics host being
 * blocked — can never break the page or throw:
 *   - the script is only injected when a token is present
 *   - it is `defer`red and appended asynchronously
 *   - `onerror` is swallowed
 *
 * Set VITE_ANALYTICS_TOKEN (and optionally VITE_ANALYTICS_SRC) to enable it.
 */
const TOKEN = import.meta.env.VITE_ANALYTICS_TOKEN as string | undefined
const SRC =
  (import.meta.env.VITE_ANALYTICS_SRC as string | undefined) ??
  'https://static.cloudflareinsights.com/beacon.min.js'

export default function Analytics() {
  useEffect(() => {
    if (!TOKEN || typeof document === 'undefined') return
    if (document.querySelector('script[data-analytics]')) return

    const script = document.createElement('script')
    script.src = SRC
    script.defer = true
    script.setAttribute('data-analytics', 'cloudflare')
    script.setAttribute('data-cf-beacon', JSON.stringify({ token: TOKEN }))
    script.onerror = () => {
      // Never let analytics failure surface as an error.
      script.remove()
    }
    document.head.appendChild(script)
  }, [])

  // Visible-to-devs marker only; renders nothing on the page.
  return <span className="analytics-note" data-analytics-placeholder hidden />
}
