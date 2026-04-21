# 🚀 Quick Deployment Guide

## Prerequisites
- ✅ Code pushed to GitHub
- ✅ Neon PostgreSQL database URL ready
- ✅ Accounts: Vercel + Render

---

## 🔧 Backend (Render) - 5 Steps

### 1. Make build.sh executable
```bash
chmod +x backend/build.sh
git add backend/build.sh
git commit -m "Make build.sh executable"
git push
```

### 2. Go to Render.com
- New + → Web Service
- Connect your GitHub repo

### 3. Configure
```
Name: college-portal-backend
Root Directory: backend
Runtime: Python 3
Build Command: ./build.sh
Start Command: gunicorn config.wsgi:application
```

### 4. Add Environment Variables
```
DEBUG=False
SECRET_KEY=<Generate>
DATABASE_URL=<Your Neon PostgreSQL URL>
ALLOWED_HOSTS=<will update after deploy>
CORS_ALLOWED_ORIGINS=<will update after frontend deploy>
```

### 5. Deploy
- Click "Create Web Service"
- Wait 5-10 minutes
- **Copy your backend URL**: `https://xxx.onrender.com`

---

## 🎨 Frontend (Vercel) - 4 Steps

### 1. Update API URL
Edit `frontend/src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://YOUR-BACKEND-URL.onrender.com/api'
};
```

Commit and push:
```bash
git add frontend/src/environments/environment.prod.ts
git commit -m "Update production API URL"
git push
```

### 2. Go to Vercel.com
- Add New → Project
- Import your GitHub repo

### 3. Configure
```
Framework: Angular
Root Directory: frontend
Build Command: npm run build
Output Directory: dist/frontend/browser
```

### 4. Deploy
- Click "Deploy"
- Wait 3-5 minutes
- **Copy your frontend URL**: `https://xxx.vercel.app`

---

## 🔄 Update Backend CORS

### Go back to Render
1. Select your backend service
2. Environment tab
3. Update these variables:
```
ALLOWED_HOSTS=xxx.onrender.com,xxx.vercel.app
CORS_ALLOWED_ORIGINS=https://xxx.vercel.app
```
4. Save (auto-redeploys)

---

## ✅ Test Your App

Visit: `https://your-app.vercel.app`

**Login Credentials**:
- Admin: `admin@college.edu` / `admin123`
- Student: `john.doe@student.edu` / `student123`

---

## 🐛 Common Issues

### Backend won't start
```bash
# Check build.sh is executable
chmod +x backend/build.sh
```

### CORS errors
```
# Update CORS_ALLOWED_ORIGINS in Render
CORS_ALLOWED_ORIGINS=https://your-vercel-url.vercel.app
```

### Database connection fails
```
# Verify DATABASE_URL in Render matches your Neon URL
# Format: postgresql://user:pass@host/dbname
```

### Frontend can't reach backend
```
# Check environment.prod.ts has correct backend URL
# Should be: https://your-backend.onrender.com/api
```

---

## 📊 Deployment URLs

After deployment, save these:

```
Frontend: https://_____.vercel.app
Backend:  https://_____.onrender.com
Database: <Your Neon PostgreSQL URL>
```

---

## 🎉 Done!

Your app is live! 

**Note**: Render free tier sleeps after 15 min inactivity. First request after sleep takes ~30 seconds to wake up.

For production, upgrade to Render paid plan ($7/month) for always-on service.
