# Secure Multi-Tier Live Voting Application

## Project Overview

This project demonstrates the design and implementation of a secure Multi-Tier Web Application using Docker containerization. The application follows a classic 3-tier architecture with:
- **Frontend**: Nginx serving a static UI and acting as reverse proxy
- **Backend**: Node.js & Express.js API handling voting logic
- **Database**: MongoDB for data persistence

### Key Objectives
- Implement a 3-tier architecture using Docker
- Enforce security using multiple Docker bridge networks
- Isolate the database from public access
- Understand real-world container networking concepts

## Tech Stack
- **Containerization**: Docker
- **Networking**: Docker Bridge Networks
- **Frontend**: Nginx
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB

## Project Structure
```
multi-tier-app/
├── backend/
│   ├── Dockerfile
│   └── server.js
├── frontend/
│   ├── Dockerfile
│   ├── index.html
│   └── nginx.conf
├── .gitignore
└── README.md
```

## Security Design
Security is prioritized through network-level isolation:
1. **Database Isolation**: The database container is not exposed to the host system and is fully isolated from the internet
2. **Backend Protection**: The backend container is not publicly accessible; it acts as a controlled gateway between frontend and database
3. **Single Entry Point**: Only the frontend container exposes port 80 to the public
4. **Network Segmentation**: Separate Docker bridge networks restrict communication only to necessary services

## Detailed Implementation Steps

### Step 1: Create Docker Networks
Initialize the isolated communication channels:
```bash
# For communication between Frontend and Backend
docker network create frontend-network

# For communication between Backend and Database
docker network create backend-network
```

### Step 2: Set Up Database Layer (MongoDB)
Deploy the database with a persistent volume:
```bash
# Create a Docker volume for data persistence
docker volume create vote-db-data

# Run the MongoDB container on the backend network
docker run -d `
  --name db `
  --network backend-network `
  -v vote-db-data:/data/db `
  mongo:latest
```

### Step 3: Build and Run Backend (Node.js API)
Navigate to the backend directory and build the image:
```bash
cd backend
docker build -t vote-backend .
```

Run the container and connect to both networks:
```bash
# Initially connect to the backend network
docker run -d --name api --network backend-network vote-backend

# Connect to the frontend network to bridge communication
docker network connect frontend-network api
```

### Step 4: Build and Run Frontend (Nginx UI)
Navigate to the frontend directory and build the image:
```bash
cd ../frontend
docker build -t vote-frontend .
```

Run the container:
```bash
# Expose port 80 to the host for public access
docker run -d --name ui --network frontend-network -p 80:80 vote-frontend
```

## Verification
1. **Access URL**: Open http://localhost in your browser
2. **Network Integrity**: Verify that the database has no direct access to the frontend-network
3. **Data Persistence**: Cast votes and restart containers; the vote counts should remain consistent

## Cleanup
To stop and remove all containers, networks, and volume:
```bash
docker stop ui api db
docker rm ui api db
docker network rm frontend-network backend-network
docker volume rm vote-db-data
```

## Conclusion
This project successfully simulates a production-grade environment, providing hands-on experience in container orchestration, network-level security, and scalable multi-tier application design.
