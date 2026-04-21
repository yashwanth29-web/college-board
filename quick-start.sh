#!/bin/bash

# Quick Start Script for Smart College Activity & Resource Portal
# This script automates the initial setup and verification

set -e  # Exit on error

echo "=========================================="
echo "College Portal - Quick Start"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    echo "Please install Docker from https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed${NC}"
    echo "Please install Docker Compose from https://docs.docker.com/compose/install/"
    exit 1
fi

echo -e "${GREEN}✓ Docker and Docker Compose are installed${NC}"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created${NC}"
    echo -e "${YELLOW}⚠ Please edit .env file with your configuration before proceeding${NC}"
    echo ""
    read -p "Press Enter to continue after editing .env file..."
else
    echo -e "${GREEN}✓ .env file exists${NC}"
fi

echo ""
echo "=========================================="
echo "Step 1: Building Docker Images"
echo "=========================================="
echo ""

docker-compose build

echo ""
echo -e "${GREEN}✓ Docker images built successfully${NC}"
echo ""

echo "=========================================="
echo "Step 2: Starting Services"
echo "=========================================="
echo ""

docker-compose up -d

echo ""
echo -e "${GREEN}✓ Services started${NC}"
echo ""

echo "Waiting for services to be ready..."
sleep 10

echo ""
echo "=========================================="
echo "Step 3: Checking Service Status"
echo "=========================================="
echo ""

docker-compose ps

echo ""

# Check if all services are running
if docker-compose ps | grep -q "Up"; then
    echo -e "${GREEN}✓ All services are running${NC}"
else
    echo -e "${RED}✗ Some services failed to start${NC}"
    echo "Check logs with: docker-compose logs"
    exit 1
fi

echo ""
echo "=========================================="
echo "Step 4: Verifying Database Migrations"
echo "=========================================="
echo ""

# Wait a bit more for migrations to complete
sleep 5

if docker-compose logs backend | grep -q "Running migrations"; then
    echo -e "${GREEN}✓ Database migrations completed${NC}"
else
    echo -e "${YELLOW}⚠ Migrations may not have run automatically${NC}"
    echo "Running migrations manually..."
    docker-compose exec -T backend python manage.py migrate
fi

echo ""
echo "=========================================="
echo "Step 5: Creating Superuser"
echo "=========================================="
echo ""

echo "Please create an admin account:"
docker-compose exec backend python manage.py createsuperuser

echo ""
echo -e "${GREEN}✓ Superuser created${NC}"
echo ""

echo "=========================================="
echo "Step 6: Testing API Endpoints"
echo "=========================================="
echo ""

echo "Testing API root endpoint..."
API_RESPONSE=$(curl -s http://localhost:8000/api/)

if echo "$API_RESPONSE" | grep -q "Welcome"; then
    echo -e "${GREEN}✓ API is responding${NC}"
else
    echo -e "${RED}✗ API is not responding correctly${NC}"
    echo "Response: $API_RESPONSE"
fi

echo ""
echo "Testing API documentation endpoint..."
DOCS_RESPONSE=$(curl -s http://localhost:8000/api/docs/)

if echo "$DOCS_RESPONSE" | grep -q "Smart College"; then
    echo -e "${GREEN}✓ API documentation is accessible${NC}"
else
    echo -e "${RED}✗ API documentation is not accessible${NC}"
fi

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Your application is now running:"
echo ""
echo "  Frontend:        http://localhost:4200"
echo "  Backend API:     http://localhost:8000/api/"
echo "  API Docs:        http://localhost:8000/api/docs/"
echo "  Django Admin:    http://localhost:8000/admin/"
echo ""
echo "Next steps:"
echo "  1. Open http://localhost:4200 in your browser"
echo "  2. Login to Django Admin at http://localhost:8000/admin/"
echo "  3. Create test data (announcements, events, etc.)"
echo "  4. Test the student portal functionality"
echo ""
echo "Useful commands:"
echo "  View logs:       docker-compose logs -f"
echo "  Stop services:   docker-compose down"
echo "  Restart:         docker-compose restart"
echo ""
echo "For detailed verification, see DEPLOYMENT_VERIFICATION.md"
echo ""
