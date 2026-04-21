# Quick Start Guide for Windows

## Issue: Python 3.14 Compatibility

Your system has Python 3.14, but Pillow (required for image handling) doesn't support Python 3.14 yet. 

**Recommended Solution: Use Docker** (handles all dependencies automatically)

---

## Option 1: Run with Docker (RECOMMENDED)

### Step 1: Start Docker Desktop
1. Open Docker Desktop application
2. Wait for it to fully start (Docker icon in system tray should be stable)

### Step 2: Build and Run
Open PowerShell or Command Prompt in the project directory and run:

```powershell
docker-compose up --build
```

This will:
- Build the Django backend with Python 3.11 (compatible)
- Build the Angular frontend with Node 20
- Connect to your Neon PostgreSQL database
- Run migrations automatically
- Start both services

### Step 3: Wait for Services to Start
Watch the logs until you see:
- Backend: "Booting worker" or "Listening at"
- Frontend: "Compiled successfully"

### Step 4: Create Admin User
Open a NEW terminal and run:

```powershell
docker-compose exec backend python manage.py createsuperuser
```

Follow the prompts to create an admin account.

### Step 5: Access the Application
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8000/api/
- **API Docs**: http://localhost:8000/api/docs/
- **Django Admin**: http://localhost:8000/admin/

### Stop the Application
```powershell
docker-compose down
```

---

## Option 2: Install Python 3.11 (Alternative)

If you prefer running without Docker:

### Step 1: Install Python 3.11
1. Download Python 3.11 from https://www.python.org/downloads/
2. Install it (make sure to check "Add Python to PATH")
3. Verify installation:
   ```powershell
   python3.11 --version
   ```

### Step 2: Create Virtual Environment with Python 3.11
```powershell
cd backend
python3.11 -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### Step 3: Run Migrations
```powershell
python manage.py migrate
```

### Step 4: Create Superuser
```powershell
python manage.py createsuperuser
```

### Step 5: Run Backend
```powershell
python manage.py runserver
```

### Step 6: Run Frontend (New Terminal)
```powershell
cd frontend
npm install
npm start
```

---

## Troubleshooting

### Docker Desktop Not Starting
- Restart your computer
- Check if WSL 2 is installed (required for Docker Desktop on Windows)
- Run: `wsl --install` in PowerShell as Administrator

### Port Already in Use
```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Database Connection Issues
- Check your `.env` file has the correct DATABASE_URL
- Verify your Neon database is accessible

---

## What's Configured

Your `.env` file is already set up with:
- Neon PostgreSQL database connection
- CORS settings for localhost:4200
- JWT secret key
- Debug mode enabled

No additional configuration needed!

---

## Next Steps After Starting

1. **Register a Student Account**
   - Go to http://localhost:4200/register
   - Fill in the form and create an account

2. **Test Student Features**
   - View announcements
   - Browse events and register
   - View reels/media
   - Create support tickets

3. **Test Admin Features**
   - Login with superuser credentials
   - Access admin dashboard
   - Create announcements, events, reels
   - Manage students and tickets
   - View analytics

---

## Quick Commands

### Docker Commands
```powershell
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

# Run Django shell
docker-compose exec backend python manage.py shell

# Run migrations
docker-compose exec backend python manage.py migrate
```

### Without Docker
```powershell
# Backend (in backend/ directory)
python manage.py runserver
python manage.py migrate
python manage.py createsuperuser

# Frontend (in frontend/ directory)
npm start
npm run build
```
