# LinkVault - Developer's Bookmark Manager

A modern, full-stack web application for developers to save, organize, and search valuable links, articles, and code snippets. Built with a production-ready DevOps architecture.

## 🏗️ DevOps Architecture Overview

This project showcases a complete DevOps implementation with:

- **Containerization**: Multi-stage Docker builds for optimized deployment
- **Orchestration**: Docker Compose for local development
- **CI/CD Pipeline**: GitHub Actions for automated testing and deployment
- **Infrastructure**: AWS EC2 with Nginx reverse proxy
- **Database**: PostgreSQL with Prisma ORM and automated migrations
- **Monitoring**: Health checks and logging
- **Security**: Environment variable management and secure configurations

## 🚀 Tech Stack

### Backend
- **Runtime**: Bun (JavaScript runtime)
- **Framework**: Custom HTTP server with Bun.serve()
- **Database**: PostgreSQL with Prisma ORM
- **API**: RESTful API with JSON responses

### Frontend
- **Framework**: Next.js 15 with App Router
- **UI Components**: Tailwind CSS + Radix UI primitives
- **State Management**: React hooks
- **Styling**: Tailwind CSS with CSS variables for theming

### DevOps Tools
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Infrastructure**: AWS EC2, Nginx
- **Database**: PostgreSQL (Neon hosting)
- **Package Manager**: Bun

## 📁 Project Structure

```
├── apps/
│   ├── backend/           # Bun.js backend server
│   │   ├── index.ts       # Main API server
│   │   └── package.json
│   ├── web/              # Next.js frontend
│   │   ├── app/          # Next.js app router
│   │   ├── components/   # React components
│   │   └── lib/          # Utility functions
│   └── socket/           # WebSocket server
├── packages/
│   ├── db/               # Database package
│   │   ├── prisma/       # Database schema
│   │   └── migrations/   # Database migrations
│   ├── ui/               # Shared UI components
│   ├── eslint-config/    # ESLint configuration
│   └── typescript-config/ # TypeScript configuration
├── docker/               # Docker configuration
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── Dockerfile.ws
└── .github/workflows/    # CI/CD pipelines
```

## 🐳 Docker Configuration

### Multi-stage Builds

Each service uses optimized multi-stage Docker builds:

#### Backend Dockerfile
```dockerfile
# Build stage
FROM oven/bun:latest as builder
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun build

# Production stage
FROM oven/bun:slim
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/index.ts ./
EXPOSE 8080
CMD ["bun", "run", "index.ts"]
```

#### Frontend Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 3000
```

### Docker Compose

Local development orchestration:

```yaml
version: '3.8'
services:
  backend:
    build: ./docker/Dockerfile.backend
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=${DATABASE_URL}
    depends_on:
      - postgres

  frontend:
    build: ./docker/Dockerfile.frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=linkvault
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 🔌 API Endpoints

### Links Management
- `GET /api/links` - Fetch all links (with optional search)
- `POST /api/links` - Create a new link
- `PUT /api/links/[id]` - Update an existing link
- `DELETE /api/links/[id]` - Delete a link

### Search Functionality
```bash
# Search links by title, description, or tags
GET /api/links?search=react

# Get all links
GET /api/links
```

## 🗄️ Database Schema

### Links Table
```sql
CREATE TABLE links (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Automated Triggers
```sql
-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_links_updated_at
BEFORE UPDATE ON links
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

## 🚀 Deployment Architecture

### AWS EC2 Setup
1. **Instance**: Ubuntu 22.04 LTS
2. **Security Groups**: HTTP (80, 443), SSH (22)
3. **Storage**: 30GB SSD
4. **Monitoring**: CloudWatch integration

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name devops.skartik.xyz;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
      - name: Install dependencies
        run: bun install
      - name: Run tests
        run: bun test

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker images
        run: |
          docker build -f docker/Dockerfile.backend -t linkvault-backend .
          docker build -f docker/Dockerfile.frontend -t linkvault-frontend .
      - name: Deploy to AWS
        run: |
          # Deploy script here
```

## 📊 Monitoring & Logging

### Health Checks
- Backend: `GET /` - Returns server status
- Database: Prisma connection health checks
- Frontend: Next.js health endpoints

### Logging Strategy
- Structured logging with timestamps
- Environment-specific log levels
- Docker container logs aggregation
- AWS CloudWatch integration

## 🔒 Security Considerations

### Environment Variables
- Database credentials in environment variables
- API keys and secrets not committed to repo
- Different configs for development/production

### Security Best Practices
- Multi-stage Docker builds for minimal attack surface
- Non-root user in containers
- Regular dependency updates
- HTTPS enforcement in production

## 🎯 Features

### Core Functionality
- ✅ Create, read, update, delete links
- ✅ Search by title, description, and tags
- ✅ Tag-based organization
- ✅ Responsive design for all devices
- ✅ Real-time search with debouncing
- ✅ Modal forms for link management

### User Experience
- 🎨 Modern, clean interface
- 📱 Mobile-responsive design
- ⚡ Fast search and filtering
- 🏷️ Tag-based organization
- 🔄 Real-time updates
- 📋 Copy-friendly link display

## 🛠️ Development Setup

### Prerequisites
- Bun runtime
- Docker & Docker Compose
- Node.js 18+
- PostgreSQL (or Neon account)

### Local Development
```bash
# Clone repository
git clone <repository-url>
cd devops-monorepo

# Install dependencies
bun install

# Set up database
cp packages/db/.env.example packages/db/.env
bunx prisma migrate dev

# Start development servers
bun run dev:backend
bun run dev:frontend
```

### Docker Development
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📈 Performance Optimization

### Backend
- Connection pooling with Prisma
- Database indexing on search fields
- GIN indexes for array operations
- Efficient query patterns

### Frontend
- Next.js static site generation
- Image optimization
- Code splitting
- Caching strategies

### Infrastructure
- Nginx caching
- CDN for static assets
- Database connection pooling
- Load balancing ready

## 🚀 Production Deployment

### Deployment Script
```bash
#!/bin/bash

# Build Docker images
docker build -f docker/Dockerfile.backend -t linkvault-backend:latest .
docker build -f docker/Dockerfile.frontend -t linkvault-frontend:latest .

# Deploy to AWS
docker save linkvault-backend:latest | ssh user@server docker load
docker save linkvault-frontend:latest | ssh user@server docker load

# Restart services
ssh user@server 'docker-compose up -d'
```

### Domain Configuration
- DNS A record pointing to EC2 instance
- SSL certificate with Let's Encrypt
- Nginx configuration for HTTPS

## 🔄 Maintenance

### Database Maintenance
- Regular backups
- Index optimization
- Query performance monitoring
- Schema migrations

### Application Updates
- Zero-downtime deployments
- Rolling updates
- Health checks during deployment
- Automated rollback on failure

## 📚 Documentation

- API documentation available at `/api/docs`
- Component documentation in source code
- Architecture diagrams in `/docs`
- Deployment guides in `/docs/deployment`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---
<img width="1792" height="1131" alt="Screenshot 2025-09-23 at 6 54 26 PM" src="https://github.com/user-attachments/assets/9c33881c-a69d-4ac7-bb95-2779ba4644be" />

**Built with ❤️ using modern DevOps practices**


For more information about the implementation details, check out the source code and documentation in each service directory.
