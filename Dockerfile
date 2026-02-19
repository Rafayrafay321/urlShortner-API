# ---------- Build stage ----------
FROM node:alpine AS builder

# App directory
WORKDIR /app

# Install OpenSSL for prisma
RUN apk add --no--cache openssl

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript -> dist
RUN npm run build

# ---------- Production stage ----------
FROM node:alpine

# Set environment
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# App directory
WORKDIR /app

# Install OpenSSL for prisma
RUN apk add --no--cache openssl

# Install production-only dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy prisma schema (required at runtime)
# Copy compiled output
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Run migrations then start server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
