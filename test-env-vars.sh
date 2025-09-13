#!/bin/bash

# Test script to verify environment variables are properly embedded in frontend build
echo "🧪 Testing environment variable embedding in frontend build..."

# Load environment variables from .env file
if [ -f .env ]; then
    echo "📄 Loading environment variables from .env file..."
    export $(grep -v '^#' .env | xargs)
else
    echo "❌ .env file not found!"
    exit 1
fi

# Check if VITE_GEMINI_API_KEY is set
if [ -z "$VITE_GEMINI_API_KEY" ]; then
    echo "❌ VITE_GEMINI_API_KEY is not set in environment!"
    exit 1
fi

echo "✅ VITE_GEMINI_API_KEY is set: ${VITE_GEMINI_API_KEY:0:10}..."

# Build frontend with environment variables
echo "🔨 Building frontend with environment variables..."
docker build \
  --build-arg VITE_API_BASE_URL="${VITE_API_BASE_URL:-http://localhost:3001}" \
  --build-arg VITE_IPFS_GATEWAY="${VITE_IPFS_GATEWAY:-https://ipfs.io/ipfs}" \
  --build-arg VITE_NODE_ENV="${VITE_NODE_ENV:-production}" \
  --build-arg VITE_GEMINI_API_KEY="${VITE_GEMINI_API_KEY}" \
  -f frontend/Dockerfile \
  -t test-frontend-env \
  ./frontend

# Test if the environment variable is embedded in the built JavaScript
echo "🔍 Checking if VITE_GEMINI_API_KEY is embedded in the built JavaScript..."
docker run --rm test-frontend-env sh -c "find /usr/share/nginx/html -name '*.js' -exec grep -l 'VITE_GEMINI_API_KEY' {} \; | head -1 | xargs -I {} sh -c 'echo \"Found in: {}\"; grep -o \"VITE_GEMINI_API_KEY[^\"]*\" {} | head -1'"

# Clean up test image
echo "🧹 Cleaning up test image..."
docker rmi test-frontend-env

echo "✅ Test completed!"
