# ---------- Build stage ----------
FROM node:bookworm-slim AS builder

# Install OpenSSL (still needed for Prisma CLI tasks)
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# 1. Generate the client into your src/generated folder
RUN npx prisma generate

# 2. Build the app (tsc will now bundle the Prisma client into /dist)
RUN npm run build

# 3. Clean up dev dependencies
RUN npm prune --production

# ---------- Production stage ----------
FROM node:20-bookworm-slim 

# Install OpenSSL for production
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

# Copy production node_modules (includes @prisma/client and @prisma/adapter-pg)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# 4. Copy the compiled code and Prisma files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./ 

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]