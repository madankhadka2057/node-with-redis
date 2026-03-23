# Stage 1: Build
FROM node:20-slim AS builder

# Install OpenSSL, CA-certificates and libssl-dev for Prisma
RUN apt-get update && apt-get install -y openssl ca-certificates libssl-dev && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files and prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install ALL dependencies (including devDependencies for build)
# This will also trigger the 'postinstall' prisma generate
RUN npm install

# Copy the rest of the source code
COPY . .

# Set a dummy DATABASE_URL to satisfy Prisma config during build
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

# Build the TypeScript project (runs prisma generate && tsc)
RUN npm run build

# ---
# Stage 2: Production
FROM node:20-slim AS runner

# Install OpenSSL (required by Prisma at runtime)
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy built files and dependencies from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Expose the API port
EXPOSE 3000

# Start command
# This runs your combined server & worker start command
CMD ["npm", "start"]
