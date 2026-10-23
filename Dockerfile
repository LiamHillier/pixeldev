# Production image for apps/web (Next.js standalone + Payload on SQLite).
# Build from the repo root: docker build -t pixeldev-web .
# apps/web/payload.db must be present in the build context: static params and ISR pages read it at build time.
FROM node:22-bookworm-slim AS base
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable
WORKDIR /app

FROM base AS builder
COPY . .
RUN pnpm install --frozen-lockfile
ARG NEXT_PUBLIC_SERVER_URL=https://pixeldev.com.au
ENV NODE_ENV=production \
    NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL \
    DATABASE_URL=file:/app/apps/web/payload.db \
    PAYLOAD_SECRET=build-only
RUN pnpm --filter web build

FROM base AS runner
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
# Payload resolves the media upload dir relative to cwd, so uploads land in /app/apps/web/media (mount a volume there).
WORKDIR /app/apps/web
EXPOSE 3000
CMD ["node", "server.js"]
