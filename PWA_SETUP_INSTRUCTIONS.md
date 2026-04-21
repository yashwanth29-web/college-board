# PWA & Dark Mode Setup Instructions

## ✅ Features Implemented:

### 1. Dark Mode
- Theme toggle button in navbar (sun/moon icon)
- Persists theme preference in localStorage
- Respects system preference on first visit
- Smooth transitions between themes

### 2. Progressive Web App (PWA)
- Installable on mobile and desktop
- Offline support with service worker
- App manifest configured
- Mobile-optimized

---

## 🎨 Dark Mode Usage:

The dark mode toggle is now in the navbar. Click the sun/moon icon to switch themes.

To add dark mode styles to any component, use Tailwind's `dark:` prefix:

```html
<div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Content here
</div>
```

---

## 📱 PWA Icon Generation:

You need to generate PWA icons. Here's how:

### Option 1: Use an Online Tool (Easiest)
1. Go to https://www.pwabuilder.com/imageGenerator
2. Upload your college logo (512x512px recommended)
3. Download the generated icons
4. Extract and place them in `frontend/public/icons/` folder

### Option 2: Use ImageMagick (Command Line)
```bash
# Install ImageMagick first
# Then run these commands with your logo.png:

convert logo.png -resize 72x72 frontend/public/icons/icon-72x72.png
convert logo.png -resize 96x96 frontend/public/icons/icon-96x96.png
convert logo.png -resize 128x128 frontend/public/icons/icon-128x128.png
convert logo.png -resize 144x144 frontend/public/icons/icon-144x144.png
convert logo.png -resize 152x152 frontend/public/icons/icon-152x152.png
convert logo.png -resize 192x192 frontend/public/icons/icon-192x192.png
convert logo.png -resize 384x384 frontend/public/icons/icon-384x384.png
convert logo.png -resize 512x512 frontend/public/icons/icon-512x512.png
```

### Option 3: Manual Creation
Create PNG images in these sizes and save them in `frontend/public/icons/`:
- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

---

## 🚀 Testing PWA:

### Test Locally:
1. Build the production version:
   ```bash
   cd frontend
   npm run build
   ```

2. Serve the production build:
   ```bash
   npx http-server dist/student-portal -p 4200
   ```

3. Open Chrome DevTools > Application > Manifest
4. Check "Service Workers" tab
5. Try "Add to Home Screen"

### Test on Mobile:
1. Deploy to a server with HTTPS (required for PWA)
2. Open in mobile browser
3. Look for "Add to Home Screen" prompt
4. Install and test offline functionality

---

## 📦 Deployment Checklist:

### Before Deployment:
- [ ] Generate PWA icons and place in `frontend/public/icons/`
- [ ] Test dark mode on all pages
- [ ] Test PWA installation
- [ ] Test offline functionality
- [ ] Update manifest.json with your actual domain
- [ ] Test on mobile devices

### Production Build:
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
python manage.py collectstatic
python manage.py migrate
```

### Environment Variables:
Make sure these are set in production:
- `DEBUG=False` in Django settings
- `ALLOWED_HOSTS` configured
- Database credentials
- Secret keys

---

## 🎯 PWA Features:

1. **Installable**: Users can install the app on their device
2. **Offline Support**: Basic caching for offline access
3. **Fast Loading**: Cached resources load instantly
4. **Mobile Optimized**: Responsive design works great on mobile
5. **App-like Experience**: Runs in standalone mode without browser UI

---

## 🌙 Dark Mode Classes:

Common dark mode patterns:

```html
<!-- Backgrounds -->
<div class="bg-white dark:bg-gray-900">

<!-- Text -->
<p class="text-gray-900 dark:text-white">

<!-- Borders -->
<div class="border-gray-200 dark:border-gray-700">

<!-- Hover states -->
<button class="hover:bg-gray-100 dark:hover:bg-gray-800">

<!-- Gradients -->
<div class="bg-gradient-to-r from-blue-50 dark:from-gray-800 to-purple-50 dark:to-gray-900">
```

---

## 📝 Notes:

- PWA requires HTTPS in production (except localhost)
- Service worker updates automatically on page reload
- Dark mode preference is saved in localStorage
- Icons should be square and have transparent backgrounds
- Test on multiple devices and browsers

---

## 🆘 Troubleshooting:

### PWA not installing:
- Check HTTPS is enabled
- Verify manifest.json is accessible
- Check browser console for errors
- Ensure all icon sizes exist

### Dark mode not working:
- Check Tailwind config has `darkMode: 'class'`
- Verify theme service is imported
- Check browser console for errors

### Service worker not registering:
- Check service-worker.js is in public folder
- Verify HTTPS (or localhost)
- Clear browser cache and try again

---

## ✅ You're Ready to Deploy!

Both Dark Mode and PWA are now implemented. Generate the icons and you're good to go! 🚀
