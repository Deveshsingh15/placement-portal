# Multi-stage Dockerfile for Placement Portal (server + client build)

# Stage 1 - build client
FROM node:20-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
COPY client/vite.config.js ./
COPY client/postcss.config.js ./ || true
COPY client/tailwind.config.js ./ || true
RUN npm ci --silent
COPY client/ ./
RUN npm run build

# Stage 2 - build server
FROM node:20-alpine AS server-build
WORKDIR /app
COPY server/package*.json ./server/
RUN npm ci --silent --prefix server
COPY server/ ./server/
# Copy built client from previous stage into server
COPY --from=client-build /app/client/dist ./server/client/dist

WORKDIR /app/server
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "index.js"]
