# ⚡ Quick Deploy Guide - EasyBox Platform

## 🎯 Current Status: Railway + Vercel Ready

### 🚂 Railway Backend Configuration

**Step 1: Add Environment Variables**
Go to your Railway project → Variables tab → Add these:

```env
DATABASE_URL=postgresql://username:password@ep-hostname.us-east-1.neon.tech/neondb?sslmode=require
JWT_SECRET=EasyBoxPlatform2024SuperSecretKeyForProductionUse!
NODE_ENV=production
FRONTEND_URL=https://your-vercel-app.vercel.app
```

**Step 2: Get Neon Database URL**
1. Go to [Neon Console](https://console.neon.tech/)
2. Select your project
3. Click "Connect" → Copy PostgreSQL URL
4. Paste as `DATABASE_URL` in Railway

**Step 3: Test Deployment**
Visit these URLs to verify:
- `https://your-railway-app.railway.app/health` - Should return `{"status":"ok"}`
- `https://your-railway-app.railway.app/api/test/ping` - API test
- `https://your-railway-app.railway.app/api/test/env-check` - Environment check

### ▲ Vercel Frontend Configuration

**Step 1: Add Environment Variables**
Go to your Vercel project → Settings → Environment Variables:

```env
NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app/api
NEXT_PUBLIC_APP_ENV=production
NEXTAUTH_URL=https://your-vercel-app.vercel.app
```

**Step 2: Deploy**
- Vercel will auto-deploy from GitHub
- Visit your Vercel URL to see the landing page
- Visit `/dashboard` for the admin interface

## 🔄 After Configuration

1. **Railway redeploys automatically** when you add environment variables
2. **Vercel redeploys automatically** when you push to GitHub
3. **Test the connection** between frontend and backend

## 🚀 Your URLs

- **Backend API**: `https://your-railway-app.railway.app`
- **Frontend App**: `https://your-vercel-app.vercel.app`
- **Health Check**: `https://your-railway-app.railway.app/health`

## 🆘 If Something Goes Wrong

**Railway Issues:**
- Check logs in Railway dashboard
- Verify DATABASE_URL format
- Ensure all environment variables are set

**Vercel Issues:**
- Check build logs in Vercel dashboard
- Verify API URL is correct
- Test API endpoints manually

**Database Issues:**
- Check Neon dashboard for connection limits
- Verify database is active
- Test connection string format

---

**🎉 Once configured, your EasyBox Platform will be live and ready for thousands of businesses!**