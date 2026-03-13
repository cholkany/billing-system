FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
# create-hono might not have a build script if we use tsx directly, but let's assume standard TS behavior or just copy files
RUN npm run build || npx tsc

FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
# If no dist, fallback
COPY --from=builder /app/src ./src

ENV NODE_ENV=production
ENV PORT=8787

EXPOSE 8787
CMD ["npm", "start"]
