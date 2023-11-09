# Install dependency
FROM node:19-alpine AS dependency

RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma

RUN npm ci
RUN npx prisma generate

# Builder
FROM node:19-alpine AS builder
WORKDIR /app
COPY --from=dependency /app/node_modules ./node_modules
COPY . .
RUN npm run build
RUN npx tsc prisma/seeder/index.ts

# Runner
FROM node:19-alpine AS runner

ARG DATABASE_URL
ARG NEXT_PUBLIC_URL
ARG NEXTAUTH_SECRET
ARG BACKEND_URL
ARG ADMIN_PASSWORD

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

ENV DATABASE_URL ${DATABASE_URL}
ENV NEXT_PUBLIC_URL ${NEXT_PUBLIC_URL}
ENV NEXTAUTH_SECRET ${NEXTAUTH_SECRET}
ENV BACKEND_URL ${BACKEND_URL}
ENV ADMIN_PASSWORD ${ADMIN_PASSWORD}

CMD ["node", "server.js"]
