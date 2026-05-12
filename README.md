Secure Multi-Tier Live Voting Application (BJP vs INC)
1. Project Overview
This project demonstrates the design and implementation of a secure Multi-Tier Web Application using Docker containerization and isolated networks. It simulates a production-style environment by enforcing service isolation, network segmentation, and secure inter-container communication.

Core Objectives:
Implement a 3-tier architecture using Docker.

Enforce security using multiple Docker bridge networks.

Isolate the database tier from all public access.

Provide a dynamic, live-updating UI with real-time data persistence.

2. Architecture & Security Design
The application follows a classic 3-Tier Architecture:

Frontend Layer (Nginx): Serves static content and acts as a reverse proxy, forwarding API requests to the backend.

Backend Layer (Node.js): Handles business logic and acts as a controlled gateway between the frontend and database.

Database Layer (MongoDB): Stores data in document format; it is not exposed to the host system or public traffic.

Network Segmentation:
frontend-network: Restricted to UI and API communication.

backend-network: Restricted to API and Database communication.

3. Project Structure
The project is organized into dedicated directories for service isolation:

multi-tier-app/
├── backend/
│   ├── Dockerfile
│   └── server.js
├── frontend/
│   ├── Dockerfile
│   ├── index.html
│   └── nginx.conf
└── README.md
4. Implementation Steps
Step 1: Initialize Docker Networks
Create the isolated communication channels for the different tiers:

docker network create frontend-network
docker network create backend-network
Step 2: Set Up the Database Layer (MongoDB)
Deploy the database with a persistent volume to ensure data is not lost upon container restart:

# Create a volume for persistent storage
docker volume create vote-db-data

# Run the database container isolated on the backend network
docker run -d \
  --name db \
  --network backend-network \
  -v vote-db-data:/data/db \
  mongo:latest
Step 3: Build and Deploy the Backend Layer
The backend handles the voting logic and connects to both networks to bridge the tiers.

Navigate to the backend directory: cd backend

Build the image: docker build -t vote-backend .

Run and connect the container:

# Run on the backend network
docker run -d --name api --network backend-network vote-backend

# Connect to the frontend network for UI communication
docker network connect frontend-network api
Step 4: Build and Deploy the Frontend Layer
The frontend serves the UI and proxies requests to the backend.

Navigate to the frontend directory: cd ../frontend

Build the image: docker build -t vote-frontend .

Run the container:

# Expose port 80 to the internet
docker run -d --name ui --network frontend-network -p 80:80 vote-frontend
5. Verification & Testing
Ensure the application is running as intended:

Access URL: Open http://localhost in your browser
