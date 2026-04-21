# Quick Reference Guide

## Common Commands

### Docker Operations

```bash
# Start all services
docker-compose up -d

# Start with rebuild
docker-compose up --build -d

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v

# View logs (all services)
docker-compose logs -f

# View logs (specific service)
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Check service status
docker-compose ps

# Restart a service
docker-compose restart backend

# Rebuild a specific service
docker-compose build backend
docker-compose up -d backend
```

### Django Management

```bash
# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Create migrations
docker-compose exec backend python manage.py makemigrations

# Collect static files
docker-compose exec backend python manage.py collectstatic

# Django shell
docker-compose exec backend python manage.py shell

# Run tests
docker-compose exec backend python manage.py test

# Run specific app tests
docker-compose exec backend python manage.py test authentication
```

### Database Operations

```bash
# Access PostgreSQL shell
docker-compose exec db psql -U postgres college_portal

# Backup database
docker-compose exec db pg_dump -U postgres college_portal > backup.sql

# Restore database
docker-compose exec -T db psql -U postgres college_portal < backup.sql

# Check database size
docker-compose exec db psql -U postgres -c "SELECT pg_size_pretty(pg_database_size('college_portal'));"
```

### Container Access

```bash
# Backend shell
docker-compose exec backend bash

# Frontend shell
docker-compose exec frontend sh

# Database shell
docker-compose exec db sh
```

## API Testing

### Authentication

```bash
# Register student
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@college.edu",
    "password": "SecurePass123!",
    "student_id": "STU2024001"
  }'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@college.edu",
    "password": "SecurePass123!"
  }'

# Refresh token
curl -X POST http://localhost:8000/api/auth/token/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh": "YOUR_REFRESH_TOKEN"}'
```

### Announcements

```bash
# List announcements
curl -X GET http://localhost:8000/api/announcements \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create announcement (admin)
curl -X POST http://localhost:8000/api/announcements \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Announcement",
    "content": "This is a test"
  }'
```

### Events

```bash
# List events
curl -X GET http://localhost:8000/api/events \
  -H "Authorization: Bearer YOUR_TOKEN"

# Register for event
curl -X POST http://localhost:8000/api/events/1/register \
  -H "Authorization: Bearer STUDENT_TOKEN"

# Get my events
curl -X GET http://localhost:8000/api/events/my-events \
  -H "Authorization: Bearer STUDENT_TOKEN"
```

### Tickets

```bash
# Create ticket
curl -X POST http://localhost:8000/api/tickets \
  -H "Authorization: Bearer STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Help Needed",
    "description": "I need assistance with...",
    "category": "technical"
  }'

# List my tickets
curl -X GET http://localhost:8000/api/tickets \
  -H "Authorization: Bearer STUDENT_TOKEN"
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port (Linux/Mac)
lsof -i :8000

# Find process using port (Windows)
netstat -ano | findstr :8000

# Kill process (Linux/Mac)
kill -9 <PID>

# Kill process (Windows)
taskkill /PID <PID> /F
```

### Database Connection Issues

```bash
# Check database is running
docker-compose ps db

# Restart database
docker-compose restart db

# Check database logs
docker-compose logs db

# Wait for database to be ready
docker-compose up -d db
sleep 10
docker-compose up -d backend
```

### Migration Issues

```bash
# Reset migrations (WARNING: deletes data)
docker-compose down -v
docker-compose up -d db
sleep 10
docker-compose exec backend python manage.py migrate

# Force migrations
docker-compose exec backend python manage.py migrate --run-syncdb
```

### Permission Issues

```bash
# Fix media file permissions
docker-compose exec backend chown -R appuser:appuser /app/media

# Fix static file permissions
docker-compose exec backend chown -R appuser:appuser /app/staticfiles
```

### Clear Cache

```bash
# Clear Docker build cache
docker builder prune

# Remove all unused Docker resources
docker system prune -a

# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## Environment Variables

```bash
# Required variables in .env
DEBUG=False
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
DB_PASSWORD=secure_password
CORS_ALLOWED_ORIGINS=http://localhost:4200
```

## URLs

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8000/api/
- **API Docs**: http://localhost:8000/api/docs/
- **Django Admin**: http://localhost:8000/admin/
- **Database**: localhost:5432

## Default Credentials

After running `createsuperuser`, use those credentials for:
- Django Admin access
- Admin API operations

## File Locations

### In Containers

- Backend code: `/app/`
- Media files: `/app/media/`
- Static files: `/app/staticfiles/`
- Database data: `/var/lib/postgresql/data/`

### On Host

- Backend code: `./backend/`
- Frontend code: `./frontend/`
- Docker volumes: Managed by Docker

## Health Checks

```bash
# Check API health
curl http://localhost:8000/api/

# Check database health
docker-compose exec db pg_isready -U postgres

# Check all services
docker-compose ps
```

## Performance

```bash
# View resource usage
docker stats

# View container logs with timestamps
docker-compose logs -f --timestamps

# Limit log output
docker-compose logs --tail=100 backend
```

## Backup & Restore

```bash
# Full backup
docker-compose exec db pg_dump -U postgres college_portal > backup_$(date +%Y%m%d).sql
docker cp college-portal-backend:/app/media ./media_backup_$(date +%Y%m%d)

# Full restore
docker-compose exec -T db psql -U postgres college_portal < backup_20240116.sql
docker cp ./media_backup_20240116 college-portal-backend:/app/media
```

## Development Workflow

```bash
# 1. Make code changes
# 2. Rebuild affected service
docker-compose build backend

# 3. Restart service
docker-compose up -d backend

# 4. Check logs
docker-compose logs -f backend

# 5. Run tests
docker-compose exec backend python manage.py test
```

## Production Deployment

```bash
# 1. Update .env for production
DEBUG=False
SECRET_KEY=<strong-secret-key>
ALLOWED_HOSTS=your-domain.com
DB_PASSWORD=<strong-password>

# 2. Build and start
docker-compose up -d --build

# 3. Create superuser
docker-compose exec backend python manage.py createsuperuser

# 4. Verify
curl https://your-domain.com/api/
```

## Useful Aliases

Add to your `.bashrc` or `.zshrc`:

```bash
alias dcu='docker-compose up -d'
alias dcd='docker-compose down'
alias dcl='docker-compose logs -f'
alias dcp='docker-compose ps'
alias dcr='docker-compose restart'
alias dcb='docker-compose build'

alias dj='docker-compose exec backend python manage.py'
alias djmigrate='docker-compose exec backend python manage.py migrate'
alias djtest='docker-compose exec backend python manage.py test'
alias djshell='docker-compose exec backend python manage.py shell'
```

## Getting Help

- **Full Documentation**: See `README.md`
- **Verification Guide**: See `DEPLOYMENT_VERIFICATION.md`
- **API Documentation**: http://localhost:8000/api/docs/
- **Django Admin**: http://localhost:8000/admin/docs/ (if enabled)
