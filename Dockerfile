FROM node:22-slim

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10

# Copy package files first for better caching
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy ALL source code (this layer changes on every commit)
COPY . .

# ALWAYS clean cache and rebuild from scratch
RUN rm -rf node_modules/.cache dist && pnpm run build

# Expose port
EXPOSE 8080

# Set environment
ENV NODE_ENV=production
ENV PORT=8080

# Start server
CMD ["node", "dist/standalone.js"]
