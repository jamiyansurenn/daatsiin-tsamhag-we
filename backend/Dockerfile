# Backend Dockerfile for Render
# Note: For Render, it's recommended to use Node build mode instead of Docker
# This Dockerfile is kept for reference or other deployment platforms

FROM node:18-alpine

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Copy Prisma schema before npm install (needed for postinstall script)
COPY prisma ./prisma

# Install ALL dependencies (including dev dependencies needed for build)
RUN npm ci

# Copy rest of the application
COPY . .

# Generate Prisma Client (explicitly, in case postinstall didn't work)
RUN npx prisma generate

# Build the application
RUN npm run build

# Start the application (use node directly instead of npm)
CMD ["node", "dist/main.js"]
