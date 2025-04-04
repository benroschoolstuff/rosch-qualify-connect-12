
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

# Start nginx in the background
nginx -g "daemon off;" &
NGINX_PID=$!
echo "Started Nginx with PID: $NGINX_PID"

# Output log to help with debugging
echo "All services started. Monitoring logs..."

# Monitor processes
wait -n
EXIT_CODE=$?

echo "A process exited with code: $EXIT_CODE"

# Check which process died
if ! kill -0 $NGINX_PID 2>/dev/null; then
  echo "Nginx crashed. Check nginx error logs."
  cat /var/log/nginx/error.log
fi

# Exit with the status of the process that exited first
exit $EXIT_CODE
