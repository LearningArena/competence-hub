#!/bin/bash

# Exit when a command fails
set -e

echo "run.sh: Running migrations with psql..."
export PGPASSWORD="$POSTGRES_PASSWORD"
psql --host="$POSTGRES_HOST" \
     --port="$POSTGRES_PORT" \
     --username="$POSTGRES_USER" \
     --dbname="$POSTGRES_DB" \
     --file=migrations.sql \
     --echo-queries
unset PGPASSWORD
echo "run.sh: Migration script run complete"

echo "run.sh: Starting server..."
./Arena --urls=http://0.0.0.0:8000
