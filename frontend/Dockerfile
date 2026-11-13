# =================================================================
# Stage 1: Install workspace dependencies using root lockfile
# =================================================================
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy root monorepo manifests and workspace package manifests
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install all workspace dependencies strictly using root package-lock.json
RUN npm ci

# =================================================================
# Stage 2: Build the Next.js production bundle with standalone output
# =================================================================
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Bring in installed dependencies and package manifests
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/package-lock.json ./package-lock.json

# Copy frontend source files
COPY frontend/ ./frontend/

# Build argument for client-side API URL (inlined by Next.js at build time)
ARG NEXT_PUBLIC_API_URL=http://localhost:4000/api
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Compile Next.js with standalone tracing
RUN npm --prefix frontend run build

# =================================================================
# Stage 3: Minimal production runtime image
# =================================================================
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create unprivileged system user and group
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone build output (which mirrors the monorepo workspace)
COPY --from=builder /app/frontend/.next/standalone ./
COPY --from=builder /app/frontend/.next/static ./frontend/.next/static

# Ensure public assets directory exists
RUN mkdir -p ./frontend/public

# Set ownership to unprivileged user
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

# In standalone monorepo builds, the entrypoint is at frontend/server.js
CMD ["node", "frontend/server.js"]
