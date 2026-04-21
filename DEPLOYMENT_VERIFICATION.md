# Deployment Verification Guide

This guide provides step-by-step instructions to verify the complete deployment of the Smart College Activity & Resource Portal.

## Prerequisites

- Docker and Docker Compose installed
- `.env` file configured (copy from `.env.example`)
- Ports 4200, 8000, and 5432 available

## Step 1: Start All Services

```bash
# Build and start all containers
docker-compose up --build -d

# Wait for all services to be healthy (about 30 seconds)
docker-compose ps
```

**Expected Output:**
```
NAME                          STATUS              PORTS
college-portal-backend        Up                  0.0.0.0:8000->8000/tcp
college-portal-db             Up (healthy)        0.0.0.0:5432->5432/tcp
college-portal-frontend       Up                  0.0.0.0:4200->4200/tcp
```

## Step 2: Verify Database Migrations

```bash
# Check that migrations were applied automatically
docker-compose logs backend | grep "Running migrations"

# Manually verify migrations (optional)
docker-compose exec backend python manage.py showmigrations
```

**Expected Output:**
All migrations should show `[X]` indicating they've been applied.

## Step 3: Create Django Superuser

```bash
# Create an admin account for testing
docker-compose exec backend python manage.py createsuperuser
```

**Prompts:**
- Email: `admin@college.edu`
- Name: `Admin User`
- Password: (choose a secure password)

## Step 4: Verify Backend API

### Test API Root

```bash
curl http://localhost:8000/api/
```

**Expected Response:**
```json
{
  "message": "Welcome to the Smart College Activity & Resource Portal API",
  "version": "1.0.0",
  "documentation": "http://localhost:8000/api/docs/",
  "endpoints": {
    "authentication": "http://localhost:8000/api/auth/",
    "announcements": "http://localhost:8000/api/announcements/",
    ...
  }
}
```

### Test API Documentation

```bash
curl http://localhost:8000/api/docs/
```

**Expected Response:**
JSON object with comprehensive API documentation.

### Test Student Registration

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Student",
    "email": "test.student@college.edu",
    "password": "TestPass123!",
    "student_id": "STU2024001"
  }'
```

**Expected Response (201 Created):**
```json
{
  "id": 1,
  "email": "test.student@college.edu",
  "name": "Test Student",
  "is_student": true,
  ...
}
```

### Test Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.student@college.edu",
    "password": "TestPass123!"
  }'
```

**Expected Response (200 OK):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "email": "test.student@college.edu",
    "name": "Test Student",
    "is_student": true
  }
}
```

**Save the access token for subsequent tests!**

### Test Protected Endpoint (Announcements)

```bash
# Replace YOUR_ACCESS_TOKEN with the token from login
curl -X GET http://localhost:8000/api/announcements \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected Response (200 OK):**
```json
{
  "count": 0,
  "next": null,
  "previous": null,
  "results": []
}
```

## Step 5: Verify Django Admin

1. Open browser: http://localhost:8000/admin/
2. Login with superuser credentials
3. Verify you can see:
   - Users
   - Students
   - Announcements
   - Events
   - Event Registrations
   - Media
   - Tickets

## Step 6: Create Test Data via Admin

### Create an Announcement

1. Go to http://localhost:8000/admin/announcements/announcement/
2. Click "Add Announcement"
3. Fill in:
   - Title: "Welcome to College Portal"
   - Content: "This is a test announcement"
4. Click "Save"

### Create an Event

1. Go to http://localhost:8000/admin/events/event/
2. Click "Add Event"
3. Fill in:
   - Title: "Tech Fest 2024"
   - Description: "Annual technology festival"
   - Date: (future date)
   - Time: 09:00:00
   - Location: "Main Auditorium"
   - Capacity: 100
4. Click "Save"

## Step 7: Verify Frontend

### Access Frontend

Open browser: http://localhost:4200

**Expected:**
- Angular application loads successfully
- No console errors in browser DevTools
- Login page or dashboard is visible

### Test Frontend-Backend Connection

1. Try to login with the test student account:
   - Email: `test.student@college.edu`
   - Password: `TestPass123!`

2. Verify you can see:
   - Dashboard
   - Announcements (should show the test announcement)
   - Events (should show the test event)

## Step 8: Test Media File Upload

### Upload a Test Image/Video

```bash
# Create a test image file
echo "Test image content" > test_image.txt

# Upload via API (requires admin token)
curl -X POST http://localhost:8000/api/reels \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  -F "title=Test Media" \
  -F "description=Test upload" \
  -F "file=@test_image.txt" \
  -F "file_type=image"
```

**Expected Response (201 Created):**
```json
{
  "id": 1,
  "title": "Test Media",
  "file_url": "http://localhost:8000/media/reels/...",
  ...
}
```

### Verify Media Files Volume

```bash
# Check media files are persisted
docker-compose exec backend ls -la /app/media/reels/
```

## Step 9: Test Event Registration

```bash
# Register for an event (requires student token)
curl -X POST http://localhost:8000/api/events/1/register \
  -H "Authorization: Bearer STUDENT_ACCESS_TOKEN"
```

**Expected Response (201 Created):**
```json
{
  "id": 1,
  "student_id": 1,
  "event_id": 1,
  "registered_at": "2024-01-16T15:30:00Z"
}
```

### Verify Registration in Database

```bash
docker-compose exec backend python manage.py shell
```

```python
from events.models import EventRegistration
registrations = EventRegistration.objects.all()
print(f"Total registrations: {registrations.count()}")
for reg in registrations:
    print(f"Student: {reg.student.user.name}, Event: {reg.event.title}")
exit()
```

## Step 10: Test Support Ticket Creation

```bash
# Create a support ticket (requires student token)
curl -X POST http://localhost:8000/api/tickets \
  -H "Authorization: Bearer STUDENT_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Test Ticket",
    "description": "This is a test support ticket",
    "category": "technical"
  }'
```

**Expected Response (201 Created):**
```json
{
  "id": 1,
  "subject": "Test Ticket",
  "description": "This is a test support ticket",
  "category": "technical",
  "status": "open",
  ...
}
```

## Step 11: Verify Security Headers

```bash
# Check security headers (in production with DEBUG=False)
curl -I http://localhost:8000/api/
```

**Expected Headers (in production):**
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

## Step 12: Test Analytics Endpoints

```bash
# Get dashboard statistics (requires admin token)
curl -X GET http://localhost:8000/api/analytics/dashboard \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

**Expected Response (200 OK):**
```json
{
  "total_students": 1,
  "total_events": 1,
  "total_announcements": 1,
  "total_tickets": 1,
  "open_tickets": 1
}
```

## Step 13: Verify Database Persistence

```bash
# Stop containers
docker-compose down

# Start containers again
docker-compose up -d

# Wait for services to be ready
sleep 10

# Verify data persists
curl -X GET http://localhost:8000/api/announcements \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected:**
Previously created announcements should still be present.

## Step 14: Check Container Logs

```bash
# Check for any errors in logs
docker-compose logs backend | grep -i error
docker-compose logs frontend | grep -i error
docker-compose logs db | grep -i error
```

**Expected:**
No critical errors should be present.

## Step 15: Performance Check

```bash
# Test API response time
time curl -X GET http://localhost:8000/api/announcements \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected:**
Response time should be under 500ms for most endpoints.

## Verification Checklist

Use this checklist to ensure all components are working:

### Infrastructure
- [ ] All three containers are running
- [ ] Database health check passes
- [ ] Backend waits for database before starting
- [ ] Migrations run automatically on startup
- [ ] Volumes are mounted correctly (postgres_data, media_files, static_files)

### Backend API
- [ ] API root endpoint accessible
- [ ] API documentation endpoint accessible
- [ ] Student registration works
- [ ] Login returns JWT tokens
- [ ] Token authentication works for protected endpoints
- [ ] Admin endpoints require admin permissions
- [ ] Rate limiting is active
- [ ] CORS headers are present

### Database
- [ ] All migrations applied successfully
- [ ] Superuser created
- [ ] Data persists after container restart
- [ ] Foreign key relationships work correctly

### Frontend
- [ ] Angular app loads without errors
- [ ] Can connect to backend API
- [ ] Login functionality works
- [ ] Protected routes require authentication
- [ ] API proxy works through nginx

### Features
- [ ] Announcements can be created and viewed
- [ ] Events can be created and registered for
- [ ] Media files can be uploaded
- [ ] Support tickets can be created
- [ ] Student management works (admin)
- [ ] Analytics endpoints return data (admin)

### Security
- [ ] Passwords are hashed
- [ ] JWT tokens expire correctly
- [ ] Unauthorized requests are rejected
- [ ] CORS policy is enforced
- [ ] Security headers present (in production)
- [ ] File upload size limits enforced

### Media Handling
- [ ] Media files upload successfully
- [ ] Files are stored in correct directory
- [ ] Media URLs are accessible
- [ ] Volume persistence works

## Troubleshooting

If any verification step fails, refer to the Troubleshooting section in README.md.

### Quick Fixes

**Backend won't start:**
```bash
docker-compose logs backend
docker-compose restart backend
```

**Database connection error:**
```bash
docker-compose restart db
docker-compose up -d
```

**Frontend can't reach backend:**
```bash
# Check nginx configuration
docker-compose exec frontend cat /etc/nginx/conf.d/default.conf
```

**Migrations not applied:**
```bash
docker-compose exec backend python manage.py migrate
```

## Success Criteria

The deployment is successful if:

1. All containers are running and healthy
2. Database migrations are applied
3. Superuser can login to Django admin
4. Student can register and login via API
5. Protected endpoints require authentication
6. Frontend loads and connects to backend
7. Test data can be created and retrieved
8. Media files can be uploaded
9. Data persists after container restart
10. No critical errors in logs

## Next Steps

After successful verification:

1. Create additional test data
2. Test all frontend features
3. Run automated tests: `docker-compose exec backend python manage.py test`
4. Review security settings for production
5. Set up monitoring and logging
6. Configure backups
7. Document any custom configurations

## Support

If you encounter issues during verification:
- Check the README.md troubleshooting section
- Review container logs: `docker-compose logs -f`
- Verify environment variables in `.env`
- Ensure ports are not in use by other services
- Check Docker and Docker Compose versions
