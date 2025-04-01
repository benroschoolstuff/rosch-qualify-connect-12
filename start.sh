
#!/bin/sh

# Create directories
mkdir -p /app/config

# Start Express API server for Discord configuration
cd /app/bot && node api-server.js &

# Start nginx in the background
nginx -g "daemon off;" &

# Start the Discord bot in the background
cd /app/bot && node index.js &

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?
