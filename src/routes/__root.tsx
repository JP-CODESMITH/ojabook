import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import ServiceWorkerRegistrar from '../components/ServiceWorkerRegistrar'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, viewport-fit=cover',
      },
      { name: 'theme-color', content: '#1b6b3a' },
      {
        name: 'description',
        content:
          'Ojabook is a simple, offline bookkeeping app for small traders and agro-businesses in Nigeria. Record sales, expenses and debts. Your records stay on your phone.',
      },
      { title: 'Ojabook — simple bookkeeping that works offline' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'manifest', href: '/manifest.json' },
      { rel: 'icon', href: '/icon.svg', type: 'image/svg+xml' },
      { rel: 'apple-touch-icon', href: '/icon-192.png' },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <ServiceWorkerRegistrar />
        <Scripts />
      </body>
    </html>
  )
}
