# Deployment Guide: Vercel + Render

This guide will help you deploy your College Activity Portal with:
- **Frontend (Angular)** → Vercel
- **Backend (Django)** → Render
- **Database (PostgreSQL)** → Neon (already configured)

---

## 📋 Prerequisites

1. ✅ GitHub account with repository pushed
2. ✅ Vercel account (sign up at https://vercel.com)
3. ✅ Render account (sign up at https://render.com)
4. ✅ Neon PostgreSQL database (you already have this)

---

## 🚀 Part 1: Deploy Backend to Render

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repositories

### Step 2: Create PostgreSQL Database on Render (Optional)

**Note**: You're already using Neon PostgreSQL, so you can skip this and use your existing DATABASE_URL.

If you want to use Render's PostgreSQL instead:
1. Click "New +" → "PostgreSQL"
2. Name: `college-portal-db`
3. Database: `college_portal`
4. User: `college_portal_user`
5. Region: Choose closest to you
6. Plan: Free
7. Click "Create Database"
8. Copy the "External Database URL" (you'll need this)

### Step 3: Deploy Backend Web Service

1. **Click "New +" → "Web Service"**

2. **Connect Repository**
   - Select your `college-activity-portal` repository
   - Click "Connect"

3. **Configure Service**
   ```
   Name: college-portal-backend
   Region: Oregon (US West) or closest to you
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: ./build.sh
   Start Command: gunicorn config.wsgi:application
   ```

4. **Select Plan**
   - Choose "Free" plan (or paid for better performance)

5. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable"
   
   Add these variables:
   ```
   DEBUG=False
   SECRET_KEY=<click "Generate" button>
   DATABASE_URL=<your Neon PostgreSQL URL or Render DB URL>
   ALLOWED_HOSTS=college-portal-backend.onrender.com
   CORS_ALLOWED_ORIGINS=https://your-app.vercel.app
   ```

   **Important**: 
   - For `DATABASE_URL`, use your existing Neon connection string
   - For `CORS_ALLOWED_ORIGINS`, you'll update this after deploying frontend
   - For `ALLOWED_HOSTS`, use your actual Render URL (shown after creation)

6. **Make build.sh Executable**
   Before deploying, run locally:
   ```bash
   chmod +x backend/build.sh
   git add backend/build.sh
   git commit -m "Make build.sh executable"
   git push
   ```

7. **Click "Create Web Service"**
   - Render will start building and deploying
   - Wait 5-10 minutes for first deployment
   - You'll see logs in real-time

8. **Note Your Backend URL**
   - After deployment, you'll get a URL like: `https://college-portal-backend.onrender.com`
   - **Copy this URL** - you'll need it for frontend configuration

### Step 4: Test Backend

1. Visit: `https://your-backend-url.onrender.com/api/`
2. You should see Django REST Framework browsable API
3. Test login endpoint: `https://your-backend-url.onrender.com/api/auth/login/`

---

## 🎨 Part 2: Deploy Frontend to Vercel

### Step 1: Update Environment Configuration

1. **Update `frontend/src/environments/environment.prod.ts`**
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://your-backend-url.onrender.com/api'
   };
   ```
   Replace `your-backend-url` with your actual Render backend URL.

2. **Commit and push changes**
   ```bash
   git add frontend/src/environments/environment.prod.ts
   git commit -m "Update production API URL"
   git push
   ```

### Step 2: Deploy to Vercel

1. **Go to https://vercel.com/dashboard**

2. **Click "Add New..." → "Project"**

3. **Import Repository**
   - Click "Import" next to your `college-activity-portal` repository
   - If not listed, click "Adjust GitHub App Permissions"

4. **Configure Project**
   ```
   Framework Preset: Angular
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist/frontend/browser
   Install Command: npm install
   ```

5. **Add Environment Variables**
   Click "Environment Variables"
   
   Add:
   ```
   Name: NODE_ENV
   Value: production
   ```

6. **Click "Deploy"**
   - Vercel will build and deploy
   - Wait 3-5 minutes
   - You'll get a URL like: `https://your-app.vercel.app`

### Step 3: Update Backend CORS Settings

1. **Go back to Render Dashboard**
2. **Select your backend service**
3. **Go to "Environment"**
4. **Update `CORS_ALLOWED_ORIGINS`**
   ```
   CORS_ALLOWED_ORIGINS=https://your-app.vercel.app
   ```
   Replace with your actual Vercel URL

5. **Update `ALLOWED_HOSTS`**
   ```
   ALLOWED_HOSTS=college-portal-backend.onrender.com,your-app.vercel.app
   ```

6. **Click "Save Changes"**
   - Render will automatically redeploy

### Step 4: Test Your Application

1. **Visit your Vercel URL**: `https://your-app.vercel.app`
2. **Try logging in**:
   - Admin: `admin@college.edu` / `admin123`
   - Student: `john.doe@student.edu` / `student123`
3. **Test all features**:
   - View announcements
   - Browse events
   - Check reels
   - Submit tickets
   - Admin dashboard

---

## 🔧 Part 3: Seed Database (Optional)

If you want to add sample data:

1. **Go to Render Dashboard**
2. **Select your backend service**
3. **Click "Shell" tab**
4. **Run seed command**:
   ```bash
   python manage.py seed_database
   ```

---

## 🎯 Part 4: Custom Domain (Optional)

### For Vercel (Frontend)
1. Go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### For Render (Backend)
1. Go to your service settings
2. Click "Custom Domains"
3. Add your custom domain (e.g., `api.yourdomain.com`)
4. Update CORS and ALLOWED_HOSTS accordingly

---

## 📊 Monitoring & Logs

### Render Logs
- Go to your service → "Logs" tab
- View real-time logs
- Check for errors

### Vercel Logs
- Go to your project → "Deployments"
- Click on a deployment → "View Function Logs"

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Build fails
- Check `build.sh` is executable: `chmod +x backend/build.sh`
- Check all dependencies in `requirements.txt`
- View build logs in Render

**Problem**: Database connection fails
- Verify `DATABASE_URL` is correct
- Check Neon database is active
- Ensure IP whitelist allows Render (Neon allows all by default)

**Problem**: Static files not loading
- Check `whitenoise` is installed
- Verify `STATIC_ROOT` is set correctly
- Run `python manage.py collectstatic` in Shell

**Problem**: CORS errors
- Update `CORS_ALLOWED_ORIGINS` with your Vercel URL
- Ensure no trailing slashes
- Redeploy after changes

### Frontend Issues

**Problem**: Build fails on Vercel
- Check `package.json` build script
- Verify all dependencies are listed
- Check build logs in Vercel

**Problem**: API calls fail
- Verify `environment.prod.ts` has correct backend URL
- Check browser console for CORS errors
- Ensure backend is running

**Problem**: 404 on refresh
- Vercel should handle this automatically with `vercel.json`
- Check `vercel.json` routes configuration

---

## 🔄 Continuous Deployment

Both Vercel and Render support automatic deployments:

### Automatic Deployments
- **Push to `main` branch** → Both services auto-deploy
- **Push to other branches** → Vercel creates preview deployments

### Manual Deployments
- **Render**: Click "Manual Deploy" → "Deploy latest commit"
- **Vercel**: Click "Redeploy" on any deployment

---

## 💰 Cost Breakdown

### Free Tier Limits

**Render Free Tier**:
- ✅ 750 hours/month
- ✅ Sleeps after 15 min inactivity (wakes on request)
- ✅ 512 MB RAM
- ⚠️ First request after sleep takes ~30 seconds

**Vercel Free Tier**:
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Always active (no sleep)
- ✅ Automatic HTTPS

**Neon Free Tier**:
- ✅ 0.5 GB storage
- ✅ Unlimited queries
- ✅ Always active

### Upgrade Recommendations

For production use, consider:
- **Render**: $7/month (no sleep, better performance)
- **Vercel**: Free tier is usually sufficient
- **Neon**: $19/month for more storage and compute

---

## ✅ Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Database connected and migrations run
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Login works (admin and student)
- [ ] All API endpoints working
- [ ] Dark mode toggle works
- [ ] PWA icons generated and added
- [ ] Custom domain configured (optional)
- [ ] Monitoring set up
- [ ] Backup strategy in place

---

## 🎉 Success!

Your College Activity Portal is now live!

- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend.onrender.com
- **Database**: Neon PostgreSQL (cloud)

### Share Your App
- Send the Vercel URL to users
- Admin can log in and manage content
- Students can register and participate

### Next Steps
1. Generate and add PWA icons
2. Set up custom domain
3. Configure email notifications (optional)
4. Set up monitoring and alerts
5. Create backup strategy

---

## 📞 Support

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Django Docs**: https://docs.djangoproject.com
- **Angular Docs**: https://angular.dev

---

**Deployment Date**: April 21, 2026
**Status**: Ready for Production 🚀
