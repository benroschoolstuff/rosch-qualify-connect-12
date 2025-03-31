
# Use Node.js as the base image
FROM node:20-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the codebase
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy the built files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration to set the port
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8414
EXPOSE 8414

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
