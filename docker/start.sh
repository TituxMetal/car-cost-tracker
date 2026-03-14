#!/bin/sh
set -e

# Create the backups directory if it doesn't exist
mkdir -p /data/backups

# Extract the database file path from DATABASE_URL
DB_FILE=${DATABASE_URL#file:}

echo "=== Car Cost Tracker API ==="
echo "DATABASE_URL: $DATABASE_URL"
echo "DB_FILE: $DB_FILE"
echo "RUN_MIGRATIONS: $RUN_MIGRATIONS"

# Check if RUN_MIGRATIONS is true
if [ "$RUN_MIGRATIONS" = "true" ]; then
  # Backup existing database if present
  if [ -f "$DB_FILE" ]; then
    echo "Database file exists, creating backup..."
    BACKUP_FILE="/data/backups/$(basename "$DB_FILE").$(date +%Y%m%d%H%M%S).backup"
    cp "$DB_FILE" "$BACKUP_FILE" && echo "Backup created: $BACKUP_FILE"
  fi

  # Run migrations
  echo "Running Prisma migrations..."
  cd /app/apps/api && bunx prisma migrate deploy
  echo "Migrations completed successfully"
  cd /app
fi

# Start the application
echo "Starting application..."
exec bun run --filter @app/api start:prod
