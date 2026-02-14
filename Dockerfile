# ---------- Build stage ----------
FROM node:alpine AS builder

# App directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build TypeScript -> dist
RUN npm run build

# ---------- Production stage ----------
FROM node:alpine

# Set environment
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# App directory
WORKDIR /app

# Install production-only dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled output
COPY --from=builder /app/dist ./dist

# Start server
CMD ["node","dist/server.js"]
