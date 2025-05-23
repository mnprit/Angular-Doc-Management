# Angular Application

This project is a web application built with Angular and Dockerized for seamless deployment. It features a modular design with three applications:
1. **User Management**: Handles user authentication and profile management, including login, signup, and logout.
2. **Document Management**: Manages document-related operations.
3. **Ingestion Module**: Processes and ingests data/documents.

The project uses JWT (JSON Web Tokens) for secure authentication and authorization.

## Features
- User Authentication (Login, Signup, Logout)
- JWT-based Authentication
- Modular Applications for User, Document, and Ingestion
- Dockerized for Easy Deployment with NGINX
- Configured for Local Development using Docker Compose

---

## Directory Structure
.
├── Dockerfile           # Multi-stage Dockerfile for building and serving the application
├── docker-compose.yml   # Docker Compose configuration
├── nginx.conf           # NGINX configuration for serving the Angular app
├── package.json         # Dependencies and scripts
├── src/                 # Angular source files
└── dist/                # Built Angular files (auto-generated)

## Clone the Repository
git clone <repository-url>
cd <repository-directory>

## Build and Run the Containers
docker-compose up --build

## Access the Application
Frontend: http://localhost:4000
