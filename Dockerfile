
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

# Production stage with PostgreSQL
FROM nginx:alpine

# Install PostgreSQL and required packages
RUN apk add --update --no-cache postgresql postgresql-client nodejs npm bash

# Create directories
RUN mkdir -p /app/bot /app/config /app/db /var/run/postgresql

# Set environment variables for PostgreSQL
ENV PGDATA=/app/db
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=localdbpass
ENV POSTGRES_DB=rosch_qualify
ENV PGHOST=localhost

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy Discord bot from bot stage
COPY --from=discord-bot /app/bot /app/bot

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create PostgreSQL initialization script
RUN echo '#!/bin/bash\n\
if [ ! -d "$PGDATA" ]; then\n\
  mkdir -p "$PGDATA"\n\
  chown -R postgres:postgres "$PGDATA"\n\
  su postgres -c "initdb -D $PGDATA"\n\
  echo "host all all 0.0.0.0/0 md5" >> "$PGDATA/pg_hba.conf"\n\
  echo "listen_addresses = '"'*'"'" >> "$PGDATA/postgresql.conf"\n\
  su postgres -c "pg_ctl -D $PGDATA start"\n\
  su postgres -c "psql -c \"ALTER USER postgres WITH PASSWORD '"'$POSTGRES_PASSWORD'"';\""\n\
  su postgres -c "createdb $POSTGRES_DB"\n\
  echo "PostgreSQL initialized successfully"\n\
else\n\
  echo "Using existing PostgreSQL data directory"\n\
  # Just start the PostgreSQL server\n\
  su postgres -c "pg_ctl -D $PGDATA start"\n\
fi\n\
' > /app/db/init-postgres.sh

# Make the script executable
RUN chmod +x /app/db/init-postgres.sh

# Copy updated startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose ports
EXPOSE 8418 5432

# Run both nginx, PostgreSQL and the Discord bot
CMD ["/start.sh"]
