# 🚂 Railway Environment Setup - EasyBox Platform

## 🎯 Quick Configuration for Your Active Deployment

### 1. **Set Railway Environment Variables**

In your Railway project dashboard, go to **Variables** tab and add:

```env
# Database Connection (Neon)
DATABASE_URL=postgresql://username:password@hostname:port/database

# JWT Authentication
JWT_SECRET=EasyBoxPlatform2024SuperSecretKeyMinimum32Characters!
JWT_EXPIRES_IN=7d

# Environment
NODE_ENV=production
PORT=5000

# Frontend URL (will be your Vercel URL)
FRONTEND_URL=https://your-vercel-app.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 2. **Get Your Neon Database Connection String**

1. Go to your Neon dashboard: https://console.neon.tech/
2. Select your database project
3. Click **"Connect"** 
4. Copy the **PostgreSQL** connection string
5. It should look like: `postgresql://username:password@hostname.neon.tech/dbname?sslmode=require`

### 3. **Test Database Connection**

After adding the DATABASE_URL, your Railway app should automatically redeploy. Check the logs to ensure:
- ✅ Database connection successful
- ✅ Server starting on port 5000
- ✅ Health check endpoint working

### 4. **Verify Deployment**

Visit your Railway URL + `/health`:
```
https://your-railway-app.railway.app/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2024-10-29T...",
  "version": "1.0.0"
}
```

### 5. **Next Steps**

Once Railway is working:
1. ✅ Note your Railway URL (like: `easybox-platform-production-abc123.railway.app`)
2. ✅ Use this URL for Vercel frontend configuration
3. ✅ Test API endpoints

## 🔧 Common Issues & Solutions

### Database Connection Fails
- Check DATABASE_URL format
- Ensure Neon database is active
- Verify connection string includes `?sslmode=require`

### Build Fails
- Check Railway logs
- Verify package.json dependencies
- Ensure nixpacks.toml is correct

### CORS Errors
- Set correct FRONTEND_URL in Railway
- Verify Vercel deployment URL

## 📞 Test Your API

Once configured, test these endpoints:

```bash
# Health check
curl https://your-railway-app.railway.app/health

# Auth endpoint (should return 401 without token)
curl https://your-railway-app.railway.app/api/auth/me
```

---

**🎯 Your Railway deployment will be fully functional once you add the DATABASE_URL!**