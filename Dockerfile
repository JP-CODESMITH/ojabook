# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Build stage — install with the locked dependency set and build the static SPA
# (Vite output in dist/client, plus the generated service worker).
# ---------------------------------------------------------------------------
FROM oven/bun:1.4.3-alpine AS build
WORKDIR /app

# Dependencies first, so this layer is cached until the lockfile changes.
COPY package.json bun.lock .bun-version ./
RUN bun install --frozen-lockfile

# Build the app. VITE_* build-time variables are intentionally not baked in;
# pass them with --build-arg / --secret only if analytics is needed.
COPY . .
RUN bun run build

# ---------------------------------------------------------------------------
# Runtime stage — unprivileged nginx serving the static build as a non-root
# user on port 8080. No shell, no package manager, no build tooling shipped.
# ---------------------------------------------------------------------------
FROM nginxinc/nginx-unprivileged:1.29-alpine AS runtime

# Base images lag behind Alpine's security patches. Upgrade the OS packages to
# the patched versions (this is what clears most Trivy HIGH/CRITICAL findings).
USER root
RUN apk --no-cache upgrade

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/client /usr/share/nginx/html

# The base image already drops to UID 101; stated here explicitly.
USER 101

EXPOSE 8080
