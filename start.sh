
#!/bin/sh

# Create directories
mkdir -p /app/config

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
