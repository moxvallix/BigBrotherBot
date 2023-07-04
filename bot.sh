until node bot.js; do
    echo "Server 'bot.js' crashed with exit code $?.  Respawning.." >&2
    sleep 1
done
