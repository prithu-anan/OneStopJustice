# OneStopJustice Docker Setup

This document provides instructions for containerizing and deploying the OneStopJustice application using Docker.

## 🏗️ Project Structure

```
OneStopJustice/
├── Dockerfile.backend          # Backend Node.js container
├── frontend/
│   ├── Dockerfile             # Frontend React + Nginx container
│   ├── nginx.conf             # Nginx configuration
│   └── .dockerignore          # Frontend-specific ignore rules
├── docker-compose.yml         # Development environment
├── docker-compose.prod.yml    # Production environment
├── .dockerignore              # Backend-specific ignore rules
├── mongo-init.js              # MongoDB initialization script
├── build-and-push.sh          # Build and push script
└── .env.example               # Environment variables template
```

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed
- DockerHub account (for pushing images)

### 1. Environment Setup

Copy the environment template and configure your variables:

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env
```

Edit the `.env` files with your actual configuration values.

### 2. Development Environment

Run the application locally with Docker Compose:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 3. Production Deployment

For production deployment using pre-built images:

```bash
# Use production compose file
docker-compose -f docker-compose.prod.yml up -d
```

## 🐳 Docker Images

### Backend Image
- **Base**: Node.js 18 Alpine
- **Port**: 3001
- **Health Check**: `/health` endpoint
- **Features**: 
  - Non-root user for security
  - Production dependencies only
  - WebSocket support

### Frontend Image
- **Base**: Nginx Alpine (multi-stage build)
- **Port**: 80
- **Features**:
  - React build optimized for production
  - Nginx with gzip compression
  - Security headers
  - Client-side routing support
  - API proxy configuration

## 🔧 Building and Pushing Images

### Automated Build and Push

Use the provided script to build and push images to DockerHub:

```bash
./build-and-push.sh
```

### Manual Build and Push

```bash
# Build backend
docker build -f Dockerfile.backend -t prithuanan/onestopjustice-backend:latest .

# Build frontend
docker build -f frontend/Dockerfile -t prithuanan/onestopjustice-frontend:latest ./frontend

# Push to DockerHub
docker push prithuanan/onestopjustice-backend:latest
docker push prithuanan/onestopjustice-frontend:latest
```

## 🌐 Services

### MongoDB
- **Image**: mongo:7.0
- **Port**: 27018 (external), 27017 (internal)
- **Data**: Persistent volume
- **Initialization**: Custom script for collections and indexes

### Backend API
- **Image**: prithuanan/onestopjustice-backend:latest
- **Port**: 3001
- **Dependencies**: MongoDB
- **Features**: Express.js, WebSocket, JWT auth

### Frontend
- **Image**: prithuanan/onestopjustice-frontend:latest
- **Port**: 5910
- **Dependencies**: Backend API
- **Features**: React, Nginx, SPA routing

## 🔒 Security Features

- Non-root users in containers
- Security headers in Nginx
- Environment variable isolation
- Health checks for all services
- Network isolation

## 📊 Monitoring

### Health Checks

All services include health checks:

- **MongoDB**: `mongosh --eval "db.adminCommand('ping')"`
- **Backend**: `GET /health`
- **Frontend**: `GET /health`

### Logs

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

## 🛠️ Development

### Local Development with Docker

```bash
# Start only database
docker-compose up -d mongodb

# Run backend locally
npm run dev

# Run frontend locally
cd frontend && npm run dev
```

### Debugging

```bash
# Access container shell
docker exec -it onestopjustice-backend sh
docker exec -it onestopjustice-frontend sh

# Check container status
docker-compose ps

# View resource usage
docker stats
```

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 5910, 3001, and 27018 are available
2. **Environment variables**: Check `.env` files are properly configured
3. **Database connection**: Verify MongoDB is healthy before starting backend
4. **Build failures**: Check Dockerfile syntax and dependencies

### Reset Everything

```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v

# Remove all images
docker rmi $(docker images -q)

# Clean up system
docker system prune -a
```

## 📝 Environment Variables

### Backend (.env)
- `DATABASE_URL`: MongoDB connection string
- `JWT_SECRET`: JWT signing secret
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (development/production)

### Frontend (frontend/.env)
- `VITE_API_BASE_URL`: Backend API URL
- `VITE_IPFS_GATEWAY`: IPFS gateway URL
- `VITE_NODE_ENV`: Environment (development/production)

## 🎯 Production Considerations

1. **Use production compose file** with pre-built images
2. **Configure proper environment variables** for production
3. **Set up reverse proxy** (nginx/traefik) for SSL termination
4. **Configure monitoring** and logging
5. **Set up backup strategy** for MongoDB data
6. **Use secrets management** for sensitive data

## 📞 Support

For issues related to Docker setup, check:
1. Docker and Docker Compose logs
2. Container health status
3. Environment variable configuration
4. Network connectivity between services
