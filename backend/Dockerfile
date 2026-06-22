FROM node:20-alpine

WORKDIR /app

# Install OpenSSL (required by Prisma)
RUN apk add --no-cache openssl

# Install dependencies
COPY package*.json ./
RUN npm ci --legacy-peer-deps --no-audit

# Copy prisma schema and generate client
COPY prisma ./prisma
RUN node_modules/.bin/prisma generate

# Copy rest of source
COPY . .

# Create logs directory
RUN mkdir -p logs

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/health || exit 1

CMD ["node", "src/app.js"]
