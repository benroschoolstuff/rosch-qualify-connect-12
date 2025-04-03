
#!/bin/sh

# Create directories
mkdir -p /app/config

# Initialize and start PostgreSQL
echo "Initializing PostgreSQL..."
/app/db/init-postgres.sh &
# Wait for PostgreSQL to start
sleep 5

# Check if PostgreSQL is running
pg_isready -h localhost -U postgres
if [ $? -eq 0 ]; then
  echo "PostgreSQL is running"
else
  echo "PostgreSQL failed to start"
  exit 1
fi

# Start Express API server for Discord configuration
cd /app/bot && node api-server.js > /var/log/api-server.log 2>&1 &
API_PID=$!
echo "Started API server with PID: $API_PID"

# Wait a moment for the API server to start
sleep 2

# Start nginx in the background
nginx -g "daemon off;" &
NGINX_PID=$!
echo "Started Nginx with PID: $NGINX_PID"

# Start the Discord bot in the background
cd /app/bot && node index.js > /var/log/discord-bot.log 2>&1 &
BOT_PID=$!
echo "Started Discord bot with PID: $BOT_PID"

# Output log to help with debugging
echo "All services started. Monitoring logs..."

# Monitor processes
wait -n
EXIT_CODE=$?

echo "A process exited with code: $EXIT_CODE"

# Check which process died
if ! kill -0 $API_PID 2>/dev/null; then
  echo "API server crashed. Check logs at /var/log/api-server.log"
  cat /var/log/api-server.log
elif ! kill -0 $NGINX_PID 2>/dev/null; then
  echo "Nginx crashed. Check nginx error logs."
  cat /var/log/nginx/error.log
elif ! kill -0 $BOT_PID 2>/dev/null; then
  echo "Discord bot crashed. Check logs at /var/log/discord-bot.log"
  cat /var/log/discord-bot.log
fi

# Exit with the status of the process that exited first
exit $EXIT_CODE
