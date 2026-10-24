# Multi-stage Dockerfile for BharatConnect (Production Ready)

# ==========================================
# Stage 1: Build & Dependencies
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy dependency manifests
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies with legacy peer deps
RUN npm install --legacy-peer-deps

# Generate Prisma Client
RUN npx prisma generate

# Copy application source code
COPY . .

# Build the client SPA into /dist and compile server.ts to dist/server.js
RUN npm run build

# ==========================================
# Stage 2: Production Runner
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Security: run as non-root user
USER node

# Copy built artifacts and production dependencies
COPY --chown=node:node --from=builder /app/package*.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/prisma ./prisma
COPY --chown=node:node --from=builder /app/scripts ./scripts
COPY --chown=node:node --from=builder /app/public ./public
COPY --chown=node:node --from=builder /app/index.html ./

EXPOSE 3000

# Health check matching /api/health
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["npm", "run", "start:prod"]
