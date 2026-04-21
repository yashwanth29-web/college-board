# Local Development Setup Guide

This guide helps you run the Smart College Activity Portal locally using your Neon PostgreSQL database.

## Prerequisites

- Python 3.11+
- Node.js 20+
- Docker Desktop (optional, for containerized deployment)
- Neon PostgreSQL database (already configured)

## Option 1: Run with Docker (Recommended)

### 1. Start Docker Desktop
Make sure Docker Desktop is running on your Windows machine.

### 2. Build and Start Containers
```bash
docker-compose up --build
```

This will:
- Build and start the Django backend (port 8000)
- Build and start the Angular frontend (port 4200)
- Connect to your Neon PostgreSQL database
- Run migrations automatically

### 3. Create Admin Superuser
Open a new terminal and run:
```bash
docker-compose exec backend python manage.py createsuperuser
```

### 4. Access the Application
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8000/api/
- **API Docs**: http://localhost:8000/api/docs/
- **Django Admin**: http://localhost:8000/admin/

### 5. Stop Containers
```bash
docker-compose down
```

---

## Option 2: Run Without Docker (Local Development)

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Create virtual environment**
```bash
python -m venv venv
```

3. **Activate virtual environment**
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

4. **Install dependencies**
```bash
pip install -r requirements.txt
```

5. **Run migrations**
```bash
python manage.py migrate
```

6. **Create superuser**
```bash
python manage.py createsuperuser
```

7. **Collect static files**
```bash
python manage.py collectstatic --noinput
```

8. **Run development server**
```bash
python manage.py runserver
```

Backend will be available at: http://localhost:8000

### Frontend Setup

1. **Open a new terminal and navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm start
```

Frontend will be available at: http://localhost:4200

---

## Environment Variables

The `.env` file is already configured with your Neon database:

```env
DEBUG=True
SECRET_KEY=django-insecure-dev-key-change-in-production-12345
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=postgresql://neondb_owner:npg_9l2nogeRfMjz@ep-withered-tree-andysdpj-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require
CORS_ALLOWED_ORIGINS=http://localhost:4200,http://127.0.0.1:4200
JWT_SECRET_KEY=jwt-secret-key-for-development
```

---

## Testing the Application

### 1. Register a Student Account
- Go to http://localhost:4200/register
- Fill in the registration form
- Login with your credentials

### 2. Test Student Features
- View announcements
- Browse and register for events
- View reels/media
- Create support tickets
- View your profile

### 3. Test Admin Features
- Login with superuser credentials at http://localhost:4200/login
- Access admin dashboard
- Manage students
- Create announcements, events, and reels
- Manage support tickets
- View analytics

---

## API Testing with curl

### Register a new user
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "SecurePass123",
    "first_name": "John",
    "last_name": "Doe",
    "student_id": "STU001",
    "phone": "1234567890",
    "department": "Computer Science",
    "year": 2
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "SecurePass123"
  }'
```

### Get announcements (requires authentication)
```bash
curl -X GET http://localhost:8000/api/announcements/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Troubleshooting

### Docker Issues
- **Docker daemon not running**: Start Docker Desktop
- **Port already in use**: Stop other services using ports 4200 or 8000
- **Build fails**: Run `docker-compose down -v` and try again

### Database Issues
- **Connection refused**: Check your Neon database URL in `.env`
- **SSL error**: Ensure `sslmode=require` is in the DATABASE_URL

### Frontend Issues
- **npm install fails**: Delete `node_modules` and `package-lock.json`, then run `npm install` again
- **Port 4200 in use**: Kill the process using port 4200 or change the port in `angular.json`

---

## Quick Commands Reference

### Docker
```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild containers
docker-compose up --build

# Create superuser
docker-compose exec backend python manage.py createsuperuser
```

### Django (without Docker)
```bash
# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver

# Run tests
python manage.py test
```

### Angular (without Docker)
```bash
# Install dependencies
npm install

# Run development server
npm start

# Build for production
npm run build

# Run tests
npm test
```
