# Quick Start Guide - Authentication System

## ✅ Task 3.1 Completed

The custom User model with email-based authentication has been successfully implemented.

## What's Ready

1. **Custom User Model** - Email-based authentication with student/staff flags
2. **User Manager** - Methods to create users and superusers
3. **Database Migration** - Ready to apply (0001_initial.py)
4. **Admin Interface** - Configured for user management
5. **Unit Tests** - Comprehensive test coverage
6. **Documentation** - Complete setup instructions

## Quick Commands

### Start Database (Docker)
```bash
docker-compose up db -d
```

### Apply Migrations
```bash
# Wait 10 seconds for database to start, then:
cd backend
python manage.py migrate
```

### Create Admin User
```bash
python manage.py createsuperuser
# Enter email: admin@college.edu
# Enter name: Admin User
# Enter password: (your secure password)
```

### Run Tests
```bash
python manage.py test authentication
```

### Verify Setup
```bash
python manage.py check
```

## What's Next (Task 3.2)

The next task will implement:
- User registration endpoint (POST /api/auth/register)
- Login endpoint (POST /api/auth/login)
- Token refresh endpoint (POST /api/auth/token/refresh)
- Custom permission classes
- Serializers for user data

## Current Status

✅ User model created
✅ Migrations generated
✅ Tests written
✅ Admin configured
✅ Settings updated
⏳ Database migrations pending (need Docker/PostgreSQL running)
⏳ Authentication endpoints (next task)

## Troubleshooting

### Docker not running?
- Start Docker Desktop
- Run: `docker-compose up db -d`

### PostgreSQL connection error?
- Check `.env` file has correct DB_PASSWORD
- Ensure database container is running: `docker ps`

### Migration issues?
- Delete `db.sqlite3` if it exists
- Run: `python manage.py migrate --run-syncdb`

## File Structure

```
backend/
├── authentication/
│   ├── migrations/
│   │   └── 0001_initial.py
│   ├── management/
│   │   └── commands/
│   ├── models.py          # User model
│   ├── admin.py           # Admin config
│   ├── tests.py           # Unit tests
│   ├── apps.py            # App config
│   └── README.md          # Detailed docs
├── config/
│   └── settings.py        # Updated with AUTH_USER_MODEL
└── .env                   # Environment variables
```
