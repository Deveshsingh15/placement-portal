# Multi-stage Dockerfile for Placement Portal (server + client build)

# Stage 1 - build client
FROM node:20-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci --silent
COPY client/ ./
ENV VITE_API_URL=/api
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
