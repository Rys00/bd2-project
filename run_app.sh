#!/bin/bash
docker pull postgres

cp .example_env frontend/.env
cp .example_env backend/bufet/.env
source .example_env

# Build backend
docker build -t bufet-backend . -f backend/Dockerfile  

# Build frontend
cd frontend
docker build -t bufet-frontend .
cd ..

docker network create dbnetwork
# Database
docker run -d --name bufetDB --network dbnetwork \
-e POSTGRES_PASSWORD=$DB_PASSWORD -e POSTGRES_USER=$DB_USER -e POSTGRES_DB=$DB_NAME -p 5432:5432 postgres

# Frontend
docker run -it --network dbnetwork -d --name bufet-frontend -p 3000:3000 bufet-frontend

# Backend
docker run -it --network dbnetwork -d --name bufet-backend bufet-backend