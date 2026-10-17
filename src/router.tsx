import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import AppLoading from './components/app/AppLoading'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    // The SPA shell renders this in place of matched routes, so it must be
    // route-independent and stable for hydration to match.
    defaultPendingComponent: AppLoading,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
