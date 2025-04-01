
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

# Create Discord bot layer
FROM node:18-alpine as discord-bot

WORKDIR /app/bot

# Copy bot files
COPY discord-bot/ .

# Install bot dependencies
RUN npm ci

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Create a directory for the bot
RUN mkdir -p /app/bot

# Copy Discord bot from bot stage
COPY --from=discord-bot /app/bot /app/bot

# Install Node.js in the final image
RUN apk add --update nodejs npm

# Copy custom nginx config to change port to 8414
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose port 8414
EXPOSE 8414

# Run both nginx and the Discord bot
CMD ["/start.sh"]
