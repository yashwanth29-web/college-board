# Fix CORS Error on Render Backend

## Problem
Frontend is getting `status: 0` error when trying to connect to backend. This is a CORS (Cross-Origin Resource Sharing) error.

## Solution
Update environment variables on Render to allow requests from your Vercel frontend.

## Steps

### 1. Go to Render Dashboard
- Visit: https://dashboard.render.com
- Click on your backend service: `college-portal-backend-z7aq`

### 2. Update Environment Variables
Click "Environment" tab on the left, then add/update these variables:

**CORS_ALLOWED_ORIGINS**
```
https://frontend-college-board-qpfydackc-yashwanth29-webs-projects.vercel.app
```

**ALLOWED_HOSTS**
```
college-portal-backend-z7aq.onrender.com,frontend-college-board-qpfydackc-yashwanth29-webs-projects.vercel.app
```

**DEBUG** (set to False for production)
```
False
```

**SECRET_KEY** (use a secure random key)
```
django-insecure-dev-key-change-in-production-12345
```

**DATABASE_URL** (should already be set)
```
postgresql://neondb_owner:npg_9l2nogeRfMjz@ep-withered-tree-andysdpj-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### 3. Save and Wait
- Click "Save Changes"
- Render will automatically redeploy (takes 2-3 minutes)
- Wait for deployment to complete

### 4. Test
- Open your frontend: https://frontend-college-board-qpfydackc-yashwanth29-webs-projects.vercel.app
- Try logging in with:
  - Email: `admin@college.edu`
  - Password: `admin123`

## What This Fixes
- ✅ CORS error (status: 0)
- ✅ Backend will accept requests from Vercel frontend
- ✅ Login and registration will work

## Why This Happened
The backend was configured to only accept requests from `localhost:4200` (development). Now it will accept requests from your production Vercel domain.
