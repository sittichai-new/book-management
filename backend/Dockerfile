# Builder stage: install all deps (including devDeps) and generate Prisma client
FROM node:20-bullseye AS builder

WORKDIR /app

# copy package manifests first to leverage Docker cache
COPY package*.json ./
COPY package-lock.json ./
RUN npm ci

# copy only source + prisma schema to avoid copying local node_modules
COPY prisma ./prisma
COPY tsconfig*.json ./
COPY src ./src

# generate prisma client (explicit schema path)
RUN npx prisma generate --schema=./prisma/schema.prisma

# build TypeScript
RUN npm run build

# Runtime stage: smaller image with production deps
FROM node:20-slim

WORKDIR /app

# install runtime deps only and small utilities (pg_isready used in entrypoint)
RUN apt-get update && apt-get install -y --no-install-recommends postgresql-client curl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY package-lock.json ./
RUN npm ci --omit=dev

# ensure the Prisma PG adapter is available at runtime for Prisma v7
RUN npm install --no-audit --no-fund @prisma/adapter-pg@latest

# copy built app and Prisma client artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/prisma ./prisma

# copy entrypoint and make executable
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 4001

ENTRYPOINT ["/app/docker-entrypoint.sh"]
