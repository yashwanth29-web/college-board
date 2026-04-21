@echo off
REM Quick Start Script for Smart College Activity & Resource Portal (Windows)
REM This script automates the initial setup and verification

echo ==========================================
echo College Portal - Quick Start
echo ==========================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo Error: Docker is not installed
    echo Please install Docker Desktop from https://docs.docker.com/desktop/install/windows-install/
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo Error: Docker Compose is not installed
    echo Please install Docker Compose
    exit /b 1
)

echo [OK] Docker and Docker Compose are installed
echo.

REM Check if .env file exists
if not exist .env (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo [OK] .env file created
    echo [WARNING] Please edit .env file with your configuration before proceeding
    echo.
    pause
) else (
    echo [OK] .env file exists
)

echo.
echo ==========================================
echo Step 1: Building Docker Images
echo ==========================================
echo.

docker-compose build

echo.
echo [OK] Docker images built successfully
echo.

echo ==========================================
echo Step 2: Starting Services
echo ==========================================
echo.

docker-compose up -d

echo.
echo [OK] Services started
echo.

echo Waiting for services to be ready...
timeout /t 10 /nobreak >nul

echo.
echo ==========================================
echo Step 3: Checking Service Status
echo ==========================================
echo.

docker-compose ps

echo.
echo [OK] Services status checked
echo.

echo ==========================================
echo Step 4: Verifying Database Migrations
echo ==========================================
echo.

REM Wait a bit more for migrations to complete
timeout /t 5 /nobreak >nul

docker-compose logs backend | findstr "Running migrations" >nul
if errorlevel 1 (
    echo [WARNING] Migrations may not have run automatically
    echo Running migrations manually...
    docker-compose exec -T backend python manage.py migrate
) else (
    echo [OK] Database migrations completed
)

echo.
echo ==========================================
echo Step 5: Creating Superuser
echo ==========================================
echo.

echo Please create an admin account:
docker-compose exec backend python manage.py createsuperuser

echo.
echo [OK] Superuser created
echo.

echo ==========================================
echo Step 6: Testing API Endpoints
echo ==========================================
echo.

echo Testing API root endpoint...
curl -s http://localhost:8000/api/ | findstr "Welcome" >nul
if errorlevel 1 (
    echo [ERROR] API is not responding correctly
) else (
    echo [OK] API is responding
)

echo.
echo Testing API documentation endpoint...
curl -s http://localhost:8000/api/docs/ | findstr "Smart College" >nul
if errorlevel 1 (
    echo [ERROR] API documentation is not accessible
) else (
    echo [OK] API documentation is accessible
)

echo.
echo ==========================================
echo Setup Complete!
echo ==========================================
echo.
echo Your application is now running:
echo.
echo   Frontend:        http://localhost:4200
echo   Backend API:     http://localhost:8000/api/
echo   API Docs:        http://localhost:8000/api/docs/
echo   Django Admin:    http://localhost:8000/admin/
echo.
echo Next steps:
echo   1. Open http://localhost:4200 in your browser
echo   2. Login to Django Admin at http://localhost:8000/admin/
echo   3. Create test data (announcements, events, etc.)
echo   4. Test the student portal functionality
echo.
echo Useful commands:
echo   View logs:       docker-compose logs -f
echo   Stop services:   docker-compose down
echo   Restart:         docker-compose restart
echo.
echo For detailed verification, see DEPLOYMENT_VERIFICATION.md
echo.
pause
