FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./
RUN npm install

FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Some Next setups need these at runtime
COPY --from=builder /app/app ./app
COPY --from=builder /app/components ./components
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/styles ./styles
COPY --from=builder /app/hooks ./hooks
COPY --from=builder /app/contexts ./contexts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

EXPOSE 3000

# Bind to 0.0.0.0 so it's reachable from outside container
CMD ["npm", "start", "--", "-H", "0.0.0.0", "-p", "3000"]

