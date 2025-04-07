
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage without PostgreSQL
FROM nginx:alpine

# Install required packages
RUN apk add --update --no-cache nodejs npm bash postgresql-client

# Create directories
RUN mkdir -p /app/config

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy updated startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose ports
EXPOSE 8418

# Run nginx
CMD ["/start.sh"]
