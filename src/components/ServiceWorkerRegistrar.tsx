import { useEffect } from 'react'

// Registers the offline cache-first service worker after mount (browser only).
export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // offline support is best-effort
    })
  }, [])

  return null
}
