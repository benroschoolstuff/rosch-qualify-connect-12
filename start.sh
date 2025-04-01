
#!/bin/sh

# Start nginx in the background
nginx -g "daemon off;" &

# Start the Discord bot if environment variables are set
if [ -n "$DISCORD_BOT_TOKEN" ]; then
  echo "Starting Discord bot..."
  cd /app/bot && node index.js &
else
  echo "Discord bot token not set. Bot will not start."
fi

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?
