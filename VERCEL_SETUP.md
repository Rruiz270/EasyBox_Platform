# ▲ Vercel Deployment Guide - EasyBox Platform Frontend

## 📋 Quick Setup Instructions

### 1. **Connect GitHub Repository**
1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import `Rruiz270/EasyBox_Platform`
4. Select **frontend** folder as root directory
5. Framework Preset: **Next.js** (auto-detected)

### 2. **Configure Environment Variables**
Add these environment variables in Vercel dashboard:

```env
# API Configuration (Your Railway URL)
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api

# App Environment
NEXT_PUBLIC_APP_ENV=production

# App Configuration
NEXT_PUBLIC_APP_NAME=EasyBox Platform
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_COMPANY_NAME=Sua Empresa

# Authentication (if using NextAuth)
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret-key

# Feature Flags
NEXT_PUBLIC_ENABLE_3D_PREVIEW=true
NEXT_PUBLIC_ENABLE_WHATSAPP=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false

# WhatsApp Integration
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999

# File Upload Limits
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NEXT_PUBLIC_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/svg+xml,application/pdf

# Google Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Sentry Error Tracking (optional)
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

### 3. **Build Configuration**
Vercel automatically detects:
- `next.config.js` for Next.js configuration
- `vercel.json` for deployment settings
- `package.json` for dependencies

### 4. **Domain Setup**
1. **Production**: your-app.vercel.app (automatic)
2. **Custom Domain**: Configure in project settings
3. **SSL**: Automatic HTTPS

## 🔧 Advanced Configuration

### Preview Deployments
- Every PR creates preview deployment
- Preview URLs: `https://easybox-platform-git-branch.vercel.app`
- Environment variables for previews

### Build Commands
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm ci"
}
```

### Output Configuration
- Framework: Next.js
- Output Directory: `.next` (automatic)
- Public Directory: `public` (automatic)

## 🌍 Regional Configuration

### Deployment Region
- **Primary**: São Paulo, Brazil (`gru1`)
- **Secondary**: Global Edge Network
- **Serverless Functions**: Regional deployment

### Performance Optimizations
- ✅ Edge caching
- ✅ Image optimization
- ✅ Code splitting
- ✅ Static generation
- ✅ CDN distribution

## 🔒 Security Configuration

### Headers (via vercel.json)
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

### Environment Variables Security
- ✅ `NEXT_PUBLIC_` prefix for client-side variables
- ✅ Server-side variables stay secure
- ✅ No secrets in client bundle

## 📊 Analytics & Monitoring

### Vercel Analytics
- Real User Monitoring (RUM)
- Core Web Vitals tracking
- Performance insights
- User experience metrics

### Error Tracking
- Built-in error reporting
- Source maps for debugging
- Performance alerts

## 🚀 Post-Deployment Steps

1. **Test Frontend**: Visit your Vercel URL
2. **API Connection**: Verify backend connectivity
3. **Features Test**: Check all modules work
4. **Performance**: Run Lighthouse audit
5. **Mobile**: Test responsive design

## 🔄 Continuous Deployment

### Automatic Deployment
- **Production**: Push to `main` branch
- **Preview**: Every pull request
- **Development**: Push to feature branches

### Deployment Hooks
- Pre-build scripts
- Post-build validation
- Custom notifications

## 💡 Optimization Tips

### Performance
1. **Image Optimization**: Use `next/image`
2. **Code Splitting**: Dynamic imports
3. **Static Generation**: Use `getStaticProps`
4. **Edge Functions**: Regional deployment

### SEO
1. **Meta Tags**: Configured in layout
2. **Sitemap**: Auto-generated
3. **Robots.txt**: SEO-friendly
4. **Open Graph**: Social sharing

## 🆘 Troubleshooting

### Common Issues:

**1. Build Failures**
- Check TypeScript errors
- Verify dependencies
- Review build logs

**2. API Connection Issues**
- Verify `NEXT_PUBLIC_API_URL`
- Check CORS configuration
- Test Railway backend health

**3. Environment Variables**
- Ensure `NEXT_PUBLIC_` prefix for client-side
- Redeploy after variable changes
- Check variable names match code

**4. Performance Issues**
- Run Lighthouse audit
- Optimize images
- Review bundle analyzer

## 🔧 Vercel CLI (Optional)

Install Vercel CLI for advanced management:
```bash
npm install -g vercel
vercel login
vercel link
vercel logs
```

### Useful CLI Commands:
```bash
# Deploy preview
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs

# Environment variables
vercel env ls
vercel env add
```

## 📱 Preview URLs

Vercel generates URLs for:
- **Production**: `https://easybox-platform.vercel.app`
- **Git branches**: `https://easybox-platform-git-feature.vercel.app`
- **Pull requests**: `https://easybox-platform-pr-123.vercel.app`

## 💰 Pricing

Vercel offers:
- **Hobby**: Free (perfect for MVP)
- **Pro**: $20/month (team features)
- **Enterprise**: Custom pricing

## 📞 Support

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Discord](https://discord.gg/vercel)

## 🎯 Final Checklist

Before going live:
- ✅ Railway backend deployed and healthy
- ✅ Database migrations completed
- ✅ Environment variables configured
- ✅ Custom domain configured (optional)
- ✅ Analytics tracking setup
- ✅ Error monitoring active
- ✅ Performance optimized
- ✅ Mobile responsive tested

---

**🎉 Your frontend will be live at:**
`https://easybox-platform.vercel.app`

**Don't forget to update the `FRONTEND_URL` in Railway!**