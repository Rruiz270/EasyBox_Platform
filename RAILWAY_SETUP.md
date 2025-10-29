# 🚂 Railway Deployment Guide - EasyBox Platform Backend

## 📋 Quick Setup Instructions

### 1. **Connect GitHub Repository**
1. Go to [Railway](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose `Rruiz270/EasyBox_Platform`
5. Select **backend** folder as root directory

### 2. **Configure Environment Variables**
Add these environment variables in Railway dashboard:

```env
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://username:password@hostname:port/database

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRES_IN=7d

# Environment
NODE_ENV=production
PORT=5000

# Frontend URL (will be your Vercel URL)
FRONTEND_URL=https://your-app.vercel.app

# File Storage (Google Cloud Storage)
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_STORAGE_BUCKET=your-bucket-name
GOOGLE_APPLICATION_CREDENTIALS={"type":"service_account",...}

# WhatsApp Business API (optional)
WHATSAPP_API_TOKEN=your-whatsapp-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id

# Email Service (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. **Neon Database Setup**
1. Create account at [Neon](https://neon.tech)
2. Create new PostgreSQL database
3. Copy connection string
4. Set as `DATABASE_URL` in Railway

### 4. **Deploy Configuration**
Railway will automatically detect:
- `nixpacks.toml` for build configuration
- `railway.json` for deployment settings
- `package.json` for Node.js setup

### 5. **Custom Domain (Optional)**
1. Go to Railway project settings
2. Add custom domain
3. Update DNS records
4. Update `FRONTEND_URL` environment variable

## 🔧 Advanced Configuration

### Database Migrations
Migrations run automatically on first deployment via:
```bash
npm run db:migrate
```

### Health Check
Railway monitors: `https://your-app.railway.app/health`

### Logs
Access logs via Railway dashboard or CLI:
```bash
railway logs
```

## 🚀 Post-Deployment Steps

1. **Test API**: Visit `https://your-app.railway.app/health`
2. **Note Railway URL**: Copy for Vercel frontend setup
3. **Test Database**: Ensure migrations completed successfully
4. **Configure CORS**: Verify frontend URL in CORS settings

## 🔒 Security Checklist

- ✅ `NODE_ENV=production`
- ✅ Strong `JWT_SECRET`
- ✅ Database connection secured
- ✅ CORS properly configured
- ✅ Rate limiting enabled
- ✅ No sensitive data in logs

## 📊 Monitoring

Railway provides:
- ✅ Automatic restarts
- ✅ Health monitoring
- ✅ Resource usage metrics
- ✅ Deployment history
- ✅ Real-time logs

## 🆘 Troubleshooting

### Common Issues:

**1. Database Connection Failed**
- Verify `DATABASE_URL` format
- Check Neon database status
- Ensure IP allowlist includes Railway

**2. Migration Errors**
- Check database permissions
- Verify schema syntax
- Review Railway logs

**3. CORS Errors**
- Update `FRONTEND_URL`
- Check Vercel deployment URL
- Verify middleware configuration

**4. Memory/Performance Issues**
- Monitor Railway metrics
- Optimize database queries
- Review connection pooling

## 📱 Railway CLI (Optional)

Install Railway CLI for advanced management:
```bash
npm install -g @railway/cli
railway login
railway link
railway logs --tail
```

## 🔄 Auto-Deploy

Every push to `main` branch automatically triggers deployment.

## 💰 Pricing

Railway offers:
- **Starter**: Free tier (500 hours/month)
- **Developer**: $5/month (unlimited)
- **Team**: $20/month (team features)

## 📞 Support

- [Railway Docs](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [Railway Help Center](https://help.railway.app)

---

**🎯 Your Railway backend URL will be:**
`https://easybox-platform-backend-production.railway.app`

**Use this URL in your Vercel frontend configuration!**