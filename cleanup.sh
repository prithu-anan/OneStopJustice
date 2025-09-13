#!/bin/bash

# OneStopJustice Cleanup Script
# This script stops and removes OneStopJustice containers and images (undoes deploy)

set -e

echo "🧹 Cleaning up OneStopJustice project..."

# Stop OneStopJustice containers
echo "⏹️ Stopping OneStopJustice containers..."
docker stop onestopjustice-mongodb onestopjustice-backend onestopjustice-frontend 2>/dev/null || true

# Remove OneStopJustice containers
echo "🗑️ Removing OneStopJustice containers..."
docker rm onestopjustice-mongodb onestopjustice-backend onestopjustice-frontend 2>/dev/null || true

# Remove OneStopJustice images
echo "🖼️ Removing OneStopJustice images..."
docker rmi prithuanan/onestopjustice-backend:latest 2>/dev/null || true
docker rmi prithuanan/onestopjustice-frontend:latest 2>/dev/null || true

# Remove OneStopJustice volumes
echo "💾 Removing OneStopJustice volumes..."
docker volume rm onestopjustice_mongodb_data 2>/dev/null || true

# Remove OneStopJustice network
echo "🌐 Removing OneStopJustice network..."
docker network rm onestopjustice-network 2>/dev/null || true

echo "✅ OneStopJustice cleanup completed!"
echo ""
echo "📊 Remaining containers:"
docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Image}}"
