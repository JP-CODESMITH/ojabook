import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    tailwindcss(),
    tanstackStart({
      // SPA mode: ship a static client-rendered shell, no server runtime.
      // The shell mask is /app (the client-only area) so "/" stays free to be
      // prerendered as the real landing page.
      spa: {
        enabled: true,
        maskPath: '/app',
        prerender: {
          outputPath: '/_shell.html',
          crawlLinks: false,
        },
      },
      // Statically prerender the marketing pages to real HTML.
      // Everything else (the /app/* routes) falls back to the SPA shell.
      pages: [
        {
          path: '/',
          prerender: { enabled: true, outputPath: '/index.html' },
        },
        {
          path: '/privacy',
          prerender: { enabled: true, outputPath: '/privacy/index.html' },
        },
      ],
    }),
    viteReact(),
  ],
})

export default config
