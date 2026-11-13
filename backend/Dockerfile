# =================================================================
# Stage 1: Install all workspace dependencies from root lockfile
# =================================================================
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

RUN npm ci

# =================================================================
# Stage 2: Production Dependencies - Lean dependencies without devDeps
# =================================================================
FROM node:22-alpine AS prod-deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/backend/node_modules ./backend/node_modules
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules

RUN npm prune --omit=dev

# =================================================================
# Stage 3: Builder - Generate Prisma client & compile TypeScript
# =================================================================
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/backend/node_modules ./backend/node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/package-lock.json ./package-lock.json

COPY backend/ ./backend/

# Generate Prisma Client (builds Linux musl query engine inside backend/node_modules/.prisma)
WORKDIR /app/backend
RUN npx prisma generate --schema=prisma/schema.prisma

# Compile TypeScript to dist/
WORKDIR /app
RUN npm --prefix backend run build

# =================================================================
# Stage 4: Dedicated Migration & Seed Runner (includes Prisma CLI & tsx)
# =================================================================
FROM node:22-alpine AS migration
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy root manifests and full node_modules with prisma CLI and tsx
COPY --from=deps /app/package.json /app/package-lock.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/backend/node_modules ./backend/node_modules

# Copy Prisma schema, migrations, seed, and generated client from builder
COPY --from=builder /app/backend/prisma ./backend/prisma
COPY --from=builder /app/backend/package.json ./backend/package.json
COPY --from=builder /app/backend/node_modules/.prisma ./backend/node_modules/.prisma

WORKDIR /app/backend

USER node

CMD ["npx", "prisma", "migrate", "deploy", "--schema=prisma/schema.prisma"]

# =================================================================
# Stage 5: Minimal Production Application Runtime Image
# =================================================================
FROM node:22-alpine AS runner
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# Create unprivileged system user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 expressjs

# Copy production node_modules from prod-deps stage
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/backend/node_modules ./backend/node_modules
COPY --from=prod-deps /app/package.json ./package.json

# Copy compiled backend output, package.json, prisma schema, and generated client
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/package.json ./backend/package.json
COPY --from=builder /app/backend/prisma ./backend/prisma
COPY --from=builder /app/backend/node_modules/.prisma ./backend/node_modules/.prisma

WORKDIR /app/backend

# Set ownership to unprivileged user
RUN chown -R expressjs:nodejs /app

USER expressjs

EXPOSE 4000

CMD ["node", "dist/server.js"]
