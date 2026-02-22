# 🚀 Quick Deployment Guide

## Recommended: Frontend (Vercel) + Backend (Render)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/job-portal.git
git push -u origin main
```

### Step 2: Deploy Backend to Render

1. Go to [render.com](https://render.com) → Sign up/Login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name:** `job-portal-api`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server/index.js`
5. Add Environment Variables:
   - `MONGODB_URI` = Your MongoDB Atlas URI
   - `JWT_SECRET` = Generate with: `openssl rand -base64 32`
   - `PORT` = `10000`
6. Click **"Create Web Service"**
7. Wait for deployment (~5 min)
8. Copy your backend URL (e.g., `https://job-portal-api.onrender.com`)

### Step 3: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → Sign up/Login
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite (auto-detected)
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add Environment Variable:
   - `VITE_API_URL` = Your Render backend URL + `/api` 
     (e.g., `https://job-portal-api.onrender.com/api`)
6. Click **"Deploy"**
7. Wait for deployment (~2 min)
8. Your app is live! 🎉

### Step 4: Update MongoDB Atlas

1. Go to MongoDB Atlas → Network Access
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Save

### Step 5: Test Your Deployment

- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-api.onrender.com/api/health`

---

## Alternative: Everything on Vercel (Advanced)

If you want everything on Vercel, you'll need to convert Express routes to serverless functions. See `DEPLOYMENT.md` for details.

---

## Environment Variables Checklist

### Render (Backend):
- ✅ `MONGODB_URI`
- ✅ `JWT_SECRET`
- ✅ `PORT` = `10000`

### Vercel (Frontend):
- ✅ `VITE_API_URL`

---

## Troubleshooting

**Backend not connecting?**
- Check MongoDB Atlas IP whitelist
- Verify `MONGODB_URI` in Render

**Frontend API calls failing?**
- Check `VITE_API_URL` in Vercel
- Verify CORS settings
- Check browser console

**Need help?** Check `DEPLOYMENT.md` for detailed guide.
