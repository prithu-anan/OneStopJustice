#!/bin/bash

# OneStopJustice Deployment Script
# This script pulls and runs the Docker images

set -e

echo "🚀 Starting OneStopJustice deployment..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file with your environment variables."
    echo "You can copy from .env.example and modify the values."
    exit 1
fi

# Pull the latest images
echo "📦 Pulling Docker images..."
docker pull prithuanan/onestopjustice-backend:latest
docker pull prithuanan/onestopjustice-frontend:latest

# Create network if it doesn't exist
echo "🌐 Creating network..."
docker network create onestopjustice-network 2>/dev/null || true

# Stop and remove existing containers
echo "🧹 Cleaning up existing containers..."
docker stop onestopjustice-mongodb onestopjustice-backend onestopjustice-frontend 2>/dev/null || true
docker rm onestopjustice-mongodb onestopjustice-backend onestopjustice-frontend 2>/dev/null || true

# Run MongoDB
echo "🗄️ Starting MongoDB..."
docker run -d \
  --name onestopjustice-mongodb \
  --network onestopjustice-network \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  -e MONGO_INITDB_DATABASE=justice \
  -v mongodb_data:/data/db \
  mongo:7.0

# Wait for MongoDB to be ready
echo "⏳ Waiting for MongoDB to be ready..."
sleep 10

# Run Backend
echo "🔧 Starting Backend..."
docker run -d \
  --name onestopjustice-backend \
  --network onestopjustice-network \
  -p 3001:3001 \
  --env-file .env \
  prithuanan/onestopjustice-backend:latest

# Wait for Backend to be ready
echo "⏳ Waiting for Backend to be ready..."
sleep 15

# Run Frontend
echo "🎨 Starting Frontend..."
docker run -d \
  --name onestopjustice-frontend \
  --network onestopjustice-network \
  -p 5910:80 \
  prithuanan/onestopjustice-frontend:latest

# Wait for Frontend to be ready
echo "⏳ Waiting for Frontend to be ready..."
sleep 10

# Check if services are running
echo "🔍 Checking service status..."
if docker ps | grep -q "onestopjustice-mongodb" && \
   docker ps | grep -q "onestopjustice-backend" && \
   docker ps | grep -q "onestopjustice-frontend"; then
    echo "✅ All services are running successfully!"
    echo ""
    echo "🌐 Application URLs:"
    echo "   Frontend: http://$(hostname -I | awk '{print $1}'):5910"
    echo "   Backend API: http://$(hostname -I | awk '{print $1}'):3001"
    echo "   Health Check: http://$(hostname -I | awk '{print $1}'):3001/health"
    echo ""
    echo "📊 Container Status:"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
else
    echo "❌ Some services failed to start. Check logs:"
    echo "   docker logs onestopjustice-backend"
    echo "   docker logs onestopjustice-frontend"
    echo "   docker logs onestopjustice-mongodb"
    exit 1
fi

echo ""
echo "🎉 Deployment completed successfully!"
echo "💡 To view logs: docker logs -f onestopjustice-backend"
echo "💡 To stop: docker stop onestopjustice-mongodb onestopjustice-backend onestopjustice-frontend"
