#!/bin/sh
set -e

echo "Environment Variables:"
echo "DATABASE_URL: ${DATABASE_URL}"
echo "NODE_ENV: ${NODE_ENV}"
echo ""
echo "Waiting for database to be ready..."
RETRY_LIMIT=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $RETRY_LIMIT ]; do
  if pg_isready -h $(echo ${DATABASE_URL} | sed 's/.*@//;s/:.*//' || echo "database") -U postgres 2>/dev/null; then
    echo "Database is ready!"
    break
  fi
  RETRY_COUNT=$((RETRY_COUNT + 1))
  echo "Database not ready, retrying... ($RETRY_COUNT/$RETRY_LIMIT)"
  sleep 2
done

if [ $RETRY_COUNT -eq $RETRY_LIMIT ]; then
  echo "Database did not become ready in time!"
  exit 1
fi

if [ "$RUN_MIGRATIONS" != "false" ]; then
  echo "Running Prisma migrations..."
  # Ensure Prisma client is generated for runtime
  npx prisma generate --schema=./prisma/schema.prisma || true
  # Run migrations (may require Prisma v7 config). If migrations fail,
  # the container will continue to start unless RUN_MIGRATIONS=false.
  npx prisma migrate deploy || true
fi

echo "Starting application..."
echo "DATABASE_URL: ${DATABASE_URL}"
exec npm start
