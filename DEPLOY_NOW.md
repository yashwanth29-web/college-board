# 🚀 Deploy Now - Copy & Paste Commands

## Step 1: Prepare Your Code (5 minutes)

### Make build.sh executable and commit
```bash
# Make build script executable
chmod +x backend/build.sh

# Check what will be committed
git status

# Add all changes
git add .

# Commit
git commit -m "Prepare for deployment to Vercel and Render"

# Push to GitHub
git push origin main
```

---

## Step 2: Deploy Backend to Render (10 minutes)

### Go to Render Dashboard
1. Open: https://render.com/dashboard
2. Click: **"New +"** → **"Web Service"**
3. Click: **"Connect account"** (if first time)
4. Select: Your `college-activity-portal` repository
5. Click: **"Connect"**

### Configure Service
```
Name: college-portal-backend
Region: Oregon (US West) or closest to you
Branch: main
Root Directory: backend
Runtime: Python 3
Build Command: ./build.sh
Start Command: gunicorn config.wsgi:application
Instance Type: Free
```

### Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**

Add these one by one:

```
Variable 1:
Name: DEBUG
Value: False

Variable 2:
Name: SECRET_KEY
Value: <Click "Generate" button>

Variable 3:
Name: DATABASE_URL
Value: <Paste your Neon PostgreSQL URL>

Variable 4:
Name: ALLOWED_HOSTS
Value: localhost,127.0.0.1

Variable 5:
Name: CORS_ALLOWED_ORIGINS
Value: http://localhost:4200
```

**Note**: We'll update ALLOWED_HOSTS and CORS_ALLOWED_ORIGINS after frontend deployment.

### Deploy
1. Click: **"Create Web Service"**
2. Wait 5-10 minutes (watch the logs)
3. When done, you'll see: ✅ **"Live"**
4. **COPY YOUR BACKEND URL**: `https://college-portal-backend-xxxx.onrender.com`

---

## Step 3: Update Frontend with Backend URL (2 minutes)

### Edit environment.prod.ts
Open: `frontend/src/environments/environment.prod.ts`

Replace with (use YOUR backend URL):
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://YOUR-BACKEND-URL.onrender.com/api'
};
```

### Commit and Push
```bash
# Add the change
git add frontend/src/environments/environment.prod.ts

# Commit
git commit -m "Update production API URL"

# Push
git push origin main
```

---

## Step 4: Deploy Frontend to Vercel (5 minutes)

### Go to Vercel Dashboard
1. Open: https://vercel.com/dashboard
2. Click: **"Add New..."** → **"Project"**
3. Find your `college-activity-portal` repository
4. Click: **"Import"**

### Configure Project
```
Framework Preset: Angular
Root Directory: frontend
Build Command: npm run build
Output Directory: dist/frontend/browser
Install Command: npm install
```

### Deploy
1. Click: **"Deploy"**
2. Wait 3-5 minutes
3. When done, you'll see: 🎉 **"Congratulations!"**
4. **COPY YOUR FRONTEND URL**: `https://college-activity-portal-xxxx.vercel.app`

---

## Step 5: Update Backend CORS (3 minutes)

### Go Back to Render
1. Open: https://render.com/dashboard
2. Click: Your **"college-portal-backend"** service
3. Click: **"Environment"** tab
4. Find and edit these variables:

```
ALLOWED_HOSTS
Old: localhost,127.0.0.1
New: college-portal-backend-xxxx.onrender.com,college-activity-portal-xxxx.vercel.app

CORS_ALLOWED_ORIGINS
Old: http://localhost:4200
New: https://college-activity-portal-xxxx.vercel.app
```

**Important**: 
- Replace `xxxx` with your actual URLs
- Use `https://` for Vercel URL
- No trailing slashes

5. Click: **"Save Changes"**
6. Wait 2-3 minutes for auto-redeploy

---

## Step 6: Test Your Application (5 minutes)

### Open Your App
Visit: `https://college-activity-portal-xxxx.vercel.app`

### Test Login
**Admin Account**:
```
Email: admin@college.edu
Password: admin123
```

**Student Account**:
```
Email: john.doe@student.edu
Password: student123
```

### Test Features
- [ ] Login works
- [ ] Dashboard loads
- [ ] View announcements
- [ ] View events
- [ ] View reels
- [ ] Submit ticket
- [ ] Dark mode toggle
- [ ] No console errors

---

## 🎉 Success!

If everything works, your app is now live!

### Your URLs
```
Frontend: https://college-activity-portal-xxxx.vercel.app
Backend:  https://college-portal-backend-xxxx.onrender.com
```

### Share with Users
Send them the Vercel URL and login credentials!

---

## 🐛 If Something Goes Wrong

### Backend not working?
```bash
# Check Render logs
1. Go to Render dashboard
2. Click your service
3. Click "Logs" tab
4. Look for errors
```

### Frontend not working?
```bash
# Check Vercel logs
1. Go to Vercel dashboard
2. Click your project
3. Click latest deployment
4. Click "View Function Logs"
```

### CORS errors?
```bash
# Double-check CORS settings in Render
CORS_ALLOWED_ORIGINS=https://your-exact-vercel-url.vercel.app

# Make sure:
- Uses https:// (not http://)
- No trailing slash
- Exact URL from Vercel
```

### Database errors?
```bash
# Verify DATABASE_URL in Render
1. Go to Render dashboard
2. Click your service
3. Click "Environment" tab
4. Check DATABASE_URL is correct
5. Should start with: postgresql://
```

---

## 📊 Deployment Status

After completing all steps:

- [x] Code pushed to GitHub
- [x] Backend deployed to Render
- [x] Frontend deployed to Vercel
- [x] CORS configured
- [x] Application tested
- [x] Ready for users!

---

## 🔄 Future Updates

When you make changes:

```bash
# 1. Make your changes
# 2. Commit and push
git add .
git commit -m "Your changes"
git push origin main

# 3. Both Render and Vercel will auto-deploy!
```

---

## 💡 Pro Tips

1. **Render Free Tier**: Sleeps after 15min. First request takes ~30 seconds.
2. **Upgrade to Paid**: $7/month for always-on backend.
3. **Custom Domain**: Add in Vercel/Render settings.
4. **Monitoring**: Check logs regularly for errors.
5. **Backups**: Export database regularly from Neon.

---

## 📞 Need Help?

- **Render Issues**: Check `DEPLOYMENT_GUIDE.md` troubleshooting section
- **Vercel Issues**: Check Vercel documentation
- **General Issues**: Review browser console and server logs

---

**You're all set! 🚀**

Your College Activity Portal is now live and ready for users!
