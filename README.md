Welcome to your new TanStack Start app!

# Getting Started

To run this application:

```bash
bun install
bun --bun run dev
```

# Building For Production

To build this application for production:

```bash
bun --bun run build
```

## Deploying to Vercel

The app is a client-only TanStack Start SPA: `vite build` emits a static site
into `dist/client`, plus a small server bundle in `dist/server` that is only
used at build time for prerendering and is **not** deployed.

`vercel.json` wires this up:

- **Build** `bun install` → `bun run build`
- **Output** `dist/client`
- **Routing** `/` and `/privacy` are prerendered to real HTML; every other
  path (i.e. `/app` and its child routes) falls back to the SPA shell
  `dist/client/_shell.html`. Vercel checks the filesystem before applying the
  catch-all rewrite, so static assets are still served directly.
- **Caching** hashed assets in `/assets` are immutable; `sw.js` is never
  cached so service-worker updates propagate.

To deploy, import the repository at [vercel.com/new](https://vercel.com/new);
the committed `vercel.json` supplies all settings, so no dashboard build
configuration is needed.

Optional analytics: set `VITE_ANALYTICS_TOKEN` (and optionally
`VITE_ANALYTICS_SRC`) as build-time environment variables in the Vercel
project. Leave them unset to disable analytics entirely (see `.env.example`).

## Security & CI

[![CI](https://github.com/JP-CODESMITH/ojabook/actions/workflows/ci.yml/badge.svg)](https://github.com/JP-CODESMITH/ojabook/actions/workflows/ci.yml)
[![Security](https://github.com/JP-CODESMITH/ojabook/actions/workflows/security.yml/badge.svg)](https://github.com/JP-CODESMITH/ojabook/actions/workflows/security.yml)

Every pull request, and every push to the default branch, runs two workflows:
**CI** (`.github/workflows/ci.yml`) and **Security**
(`.github/workflows/security.yml`). The security workflow also runs on a weekly
schedule. All third-party actions are pinned to a version tag and each job only
gets the permissions it needs.

### What gets scanned

| Area | Tool | Job / config | Fails the build on |
| ---- | ---- | ------------ | ------------------ |
| Secrets in the full git history | Gitleaks | `security.yml` → `secret-scan` | any finding |
| Dependencies + misconfiguration | Trivy `fs` (scans `bun.lock`, `Dockerfile`, config) | `security.yml` → `dependency-scan` | HIGH / CRITICAL (SARIF → Security tab) |
| Dependency advisories | `bun audit --audit-level=high` | `security.yml` → `audit` | high / critical advisories |
| Source code (SAST) | CodeQL (`javascript-typescript`) | `security.yml` → `codeql` | CodeQL findings |
| Container image | Trivy `image` on the built `Dockerfile` | `security.yml` → `container-scan` | HIGH / CRITICAL (SARIF → Security tab) |
| Response security headers | `vercel.json` (CSP, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`, HSTS) | deploy-time | — |

The **CI** workflow runs `quality` (lint when a `lint` script exists, then
`typecheck`, then `build`) and a `tests` job that runs only when a `test` script
is defined. Dependency updates are opened weekly by Dependabot
(`.github/dependabot.yml`) for the Bun lockfile, GitHub Actions and Docker.

Reports are published to the repository's **Security → Code scanning** tab.

### Run the scanners locally

```bash
# 1. Secrets across the whole git history.
gitleaks detect --source . --redact

# 2. Dependencies + misconfiguration at HIGH/CRITICAL.
trivy fs --scanners vuln,misconfig --severity HIGH,CRITICAL .
```

Both exit non-zero when they find something, so they work as local gates too.

### Pre-commit hook (optional)

No hook is committed: Gitleaks and Trivy are external binaries, so enabling one
for everyone would require extra setup on each machine. If you already have
Gitleaks installed and want it to run on your staged changes, opt in once:

```bash
printf '#!/bin/sh\ngitleaks protect --staged --redact\n' > .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.

### Removing Tailwind CSS

If you prefer not to use Tailwind CSS:

1. Remove the demo pages in `src/routes/demo/`
2. Replace the Tailwind import in `src/styles.css` with your own styles
3. Remove `tailwindcss()` from the plugins array in `vite.config.ts`
4. Remove `@tailwindcss/vite` and `tailwindcss` from `package.json`



## Routing

This project uses [TanStack Router](https://tanstack.com/router) with file-based routing. Routes are managed as files in `src/routes`.

### Adding A Route

To add a new route to your application just add a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from "@tanstack/react-router";
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you render `{children}` in the `shellComponent`.

Here is an example layout that includes a header:

```tsx
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'My App' },
    ],
  }),
  shellComponent: ({ children }) => (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <header>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
          </nav>
        </header>
        {children}
        <Scripts />
      </body>
    </html>
  ),
})
```

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).

## Server Functions

TanStack Start provides server functions that allow you to write server-side code that seamlessly integrates with your client components.

```tsx
import { createServerFn } from '@tanstack/react-start'

const getServerTime = createServerFn({
  method: 'GET',
}).handler(async () => {
  return new Date().toISOString()
})

// Use in a component
function MyComponent() {
  const [time, setTime] = useState('')
  
  useEffect(() => {
    getServerTime().then(setTime)
  }, [])
  
  return <div>Server time: {time}</div>
}
```

## API Routes

You can create API routes by using the `server` property in your route definitions:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'

export const Route = createFileRoute('/api/hello')({
  server: {
    handlers: {
      GET: () => json({ message: 'Hello, World!' }),
    },
  },
})
```

## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/people')({
  loader: async () => {
    const response = await fetch('https://swapi.dev/api/people')
    return response.json()
  },
  component: PeopleComponent,
})

function PeopleComponent() {
  const data = Route.useLoaderData()
  return (
    <ul>
      {data.results.map((person) => (
        <li key={person.name}>{person.name}</li>
      ))}
    </ul>
  )
}
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).


# Demo files

Files prefixed with `demo` can be safely deleted. They are there to provide a starting point for you to play around with the features you've installed.


# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).

For TanStack Start specific documentation, visit [TanStack Start](https://tanstack.com/start).
