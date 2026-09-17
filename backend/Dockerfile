# ---------------------------------------------------------------------------
# Stage 1 - build the application
# ---------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# `bcrypt` compiles from source when no prebuilt binary matches the platform and
# the Prisma engines need OpenSSL to detect the right libssl version.
RUN apk add --no-cache openssl python3 make g++

# Copy the lockfile when it exists; `npm ci` requires it, so fall back to
# `npm install` for checkouts that have not been bootstrapped yet.
COPY package.json package-lock.json* ./
ENV PRISMA_ENGINES_MIRROR="https://registry.npmmirror.com/-/binary/prisma"
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY prisma ./prisma
RUN npx prisma generate

COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src ./src
RUN npm run build

# ---------------------------------------------------------------------------
# Stage 2 - runtime
# ---------------------------------------------------------------------------
FROM node:20-alpine AS runtime

ENV NODE_ENV=production
WORKDIR /app

# OpenSSL is required by the Prisma query engine at runtime.
RUN apk add --no-cache openssl

# The Prisma CLI is kept in node_modules on purpose: it applies migrations when
# the container starts.
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package.json ./

EXPOSE 4000

# Apply pending migrations when a migrations folder exists, otherwise push the
# schema straight to the database (useful before the first migration exists).
CMD ["sh", "-c", "if [ -d prisma/migrations ]; then npx prisma migrate deploy; else npx prisma db push --skip-generate; fi && node dist/main.js"]
