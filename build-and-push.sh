#!/bin/bash

# OneStopJustice Docker Build and Push Script
# This script builds and pushes Docker images to DockerHub

set -e

# Configuration
DOCKERHUB_USERNAME="prithuanan"
BACKEND_IMAGE_NAME="onestopjustice-backend"
FRONTEND_IMAGE_NAME="onestopjustice-frontend"
TAG="latest"

echo "🚀 Starting Docker build and push process..."

# Build backend image
echo "📦 Building backend image..."
docker build -f Dockerfile.backend -t ${DOCKERHUB_USERNAME}/${BACKEND_IMAGE_NAME}:${TAG} .

# Build frontend image
echo "📦 Building frontend image..."
docker build -f frontend/Dockerfile -t ${DOCKERHUB_USERNAME}/${FRONTEND_IMAGE_NAME}:${TAG} ./frontend

# Login to DockerHub (you'll need to enter your credentials)
echo "🔐 Logging into DockerHub..."
docker login

# Push backend image
echo "⬆️ Pushing backend image..."
docker push ${DOCKERHUB_USERNAME}/${BACKEND_IMAGE_NAME}:${TAG}

# Push frontend image
echo "⬆️ Pushing frontend image..."
docker push ${DOCKERHUB_USERNAME}/${FRONTEND_IMAGE_NAME}:${TAG}

echo "✅ Successfully built and pushed all images!"
echo "Backend: ${DOCKERHUB_USERNAME}/${BACKEND_IMAGE_NAME}:${TAG}"
echo "Frontend: ${DOCKERHUB_USERNAME}/${FRONTEND_IMAGE_NAME}:${TAG}"

# Optional: Clean up local images to save space
read -p "🗑️ Do you want to remove local images to save space? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🧹 Cleaning up local images..."
    docker rmi ${DOCKERHUB_USERNAME}/${BACKEND_IMAGE_NAME}:${TAG}
    docker rmi ${DOCKERHUB_USERNAME}/${FRONTEND_IMAGE_NAME}:${TAG}
    echo "✅ Local images cleaned up!"
fi

echo "🎉 All done! Your images are now available on DockerHub."
