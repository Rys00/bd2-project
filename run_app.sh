#!/bin/bash

docker container stop bufet-frontend bufet-backend bufetDB
docker container rm bufet-frontend bufet-backend bufetDB

# Check for --build argument
DO_BUILD=false
if [[ "$1" == "--build" ]]; then
  DO_BUILD=true
fi

# Load environment variables
cp .example_env frontend/.env
cp .example_env baza/.env
cp .example_env backend/bufet/.env
source .example_env

# Only pull/build if --build is passed
if [ "$DO_BUILD" = true ]; then
  echo "🔧 Building images..."

  # Pull custom Postgres image
  docker pull tracktor/postgres:17.5-alpine

  # Build backend
  docker build -t bufet-backend . -f backend/Dockerfile  

  # Build frontend
  cd frontend
  docker build -t bufet-frontend .
  cd ..
fi

# Create Docker network if it doesn't exist
if ! docker network ls | grep -q dbnetwork; then
  docker network create dbnetwork
fi

# Run Postgres container
docker run -d \
  --name bufetDB \
  --network dbnetwork \
  -e POSTGRES_USER=${DB_USER} \
  -e POSTGRES_PASSWORD=${DB_PASSWORD} \
  -e POSTGRES_DB=${DB_NAME} \
  -p 5432:5432 \
  tracktor/postgres:17.5-alpine -c shared_preload_libraries=pg_cron -c cron.database_name=${DB_NAME}

# Run frontend
docker run -it --network dbnetwork -d --name bufet-frontend -p 3000:3000 bufet-frontend

# Run backend
docker run -it --network dbnetwork -d --name bufet-backend bufet-backend
