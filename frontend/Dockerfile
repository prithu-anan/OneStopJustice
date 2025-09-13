# Multi-stage build for OneStopJustice Frontend
# Stage 1: Build the React application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Accept build-time environment variables
ARG VITE_API_BASE_URL
ARG VITE_IPFS_GATEWAY
ARG VITE_NODE_ENV
ARG VITE_GEMINI_API_KEY

# Set environment variables for build
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_IPFS_GATEWAY=$VITE_IPFS_GATEWAY
ENV VITE_NODE_ENV=$VITE_NODE_ENV
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY

# Build the application
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create non-root user (nginx group already exists in nginx:alpine)
RUN adduser -S onestop -u 1001 -G nginx

# Change ownership of nginx directories
RUN chown -R onestop:nginx /usr/share/nginx/html
RUN chown -R onestop:nginx /var/cache/nginx
RUN chown -R onestop:nginx /var/log/nginx
RUN chown -R onestop:nginx /etc/nginx/conf.d
RUN touch /var/run/nginx.pid
RUN chown -R onestop:nginx /var/run/nginx.pid

# Switch to non-root user
USER onestop

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
