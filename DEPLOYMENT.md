# 🚀 Production Deployment Guide

This guide covers deploying the Broker Property Management System to production using Render and Netlify.

## 📋 Pre-Deployment Checklist

- [ ] Cloudinary account created and credentials available
- [ ] Custom domain purchased (optional)
- [ ] Database backups configured
- [ ] Environment variables documented
- [ ] SSL certificates ready
- [ ] All tests passing
- [ ] Code reviewed and merged to main branch
- [ ] Build process tested locally

## 🗄️ Step 1: Set Up PostgreSQL Database

### Option A: Render PostgreSQL (Recommended)

1. Go to [render.com](https://render.com)
2. Dashboard → PostgreSQL → Create
3. Fill in details:
   - Name: `broker-property-db`
   - Database: `broker_property_db`
   - User: `broker_admin`
   - Region: Choose closest to users
   - Plan: Paid (hobby-dev if testing)
4. Copy the connection string
5. Save securely - you'll need this for backend

### Option B: AWS RDS

1. Go to AWS RDS Console
2. Create DB instance (PostgreSQL 14+)
3. Configure:
   - DB instance identifier: `broker-property-db`
   - Master username: `broker_admin`
   - Set strong password
   - Multi-AZ for production
4. Create security group allowing port 5432
5. Copy endpoint

## 🔑 Step 2: Set Up Cloudinary

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Dashboard → Account Details
3. Copy:
   - Cloud Name
   - API Key
   - Generate API Secret
4. Create upload folder: `broker_properties`
5. Save credentials securely

## 📤 Step 3: Deploy Backend to Render

### Create Web Service

1. Go to [render.com](https://render.com)
2. Dashboard → New → Web Service
3. Connect GitHub:
   - Select your repository
   - Select main branch
   - Root directory: `backend`

### Configure Service

1. **Basic Settings**
   - Name: `broker-property-api`
   - Region: Same as database
   - Branch: `main`
   - Runtime: Python 3.11
   - Build command: `pip install -r requirements.txt && python manage.py migrate`
   - Start command: `gunicorn config.wsgi:application`

2. **Environment Variables**
   ```
   SECRET_KEY=<generate-with: python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'>
   DEBUG=False
   DATABASE_URL=<your-postgres-connection-url>
   ALLOWED_HOSTS=broker-property-api.onrender.com
   CLOUDINARY_CLOUD_NAME=<your-cloud-name>
   CLOUDINARY_API_KEY=<your-api-key>
   CLOUDINARY_API_SECRET=<your-api-secret>
   CORS_ALLOWED_ORIGINS=https://broker-property.netlify.app
   SESSION_COOKIE_SECURE=True
   CSRF_COOKIE_SECURE=True
   ```

3. **Advanced Settings**
   - Plan: Starter ($7/month minimum)
   - Auto-deploy: ON (enabled)
   - Health check path: `/api/auth/check/`

4. Deploy
   - Click "Create Web Service"
   - Render will auto-deploy from main branch

### Create Superuser

1. Once deployed, go to Render dashboard
2. Select your web service
3. Click "Shell" tab
4. Run:
   ```bash
   python manage.py createsuperuser
   ```
5. Enter credentials

## 🎨 Step 4: Deploy Frontend to Netlify

### Create Site

1. Go to [netlify.com](https://netlify.com)
2. Dashboard → Add new site → Import an existing project
3. Select GitHub provider
4. Select your repository
5. Select `frontend` directory (if needed)

### Configure Deployment

1. **Build Settings**
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`

2. **Environment Variables**
   ```
   VITE_API_URL=https://broker-property-api.onrender.com
   VITE_API_BASE_URL=/api
   ```

3. **Deploy**
   - Click "Deploy site"
   - Netlify auto-deploys on main branch push

### Configure Routing

Create `frontend/netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[context.production]
  environment = { VITE_API_URL = "https://broker-property-api.onrender.com" }
```

## 🔗 Step 5: Configure Custom Domain

### For Render Backend

1. Web Service → Settings → Custom Domain
2. Add your domain (e.g., `api.yourdomain.com`)
3. Copy CNAME record provided
4. Add to your DNS provider:
   ```
   Name: api
   Type: CNAME
   Value: <render-provided-cname>
   ```
5. Wait 5-10 minutes for DNS propagation
6. SSL certificate auto-generates

### For Netlify Frontend

1. Domain settings → Add domain
2. Enter your domain (e.g., `yourdomain.com`)
3. Update DNS:
   ```
   Name: @
   Type: A
   Value: 75.75.75.75  (Netlify IP)
   ```
   OR
   ```
   Name: @
   Type: CNAME
   Value: <netlify-provided-domain>
   ```
4. SSL auto-generates in 24 hours

### Update CORS on Backend

1. Render → Environment → Add variable
   ```
   CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
   ```
2. Redeploy backend

## 🔒 Step 6: Security Configuration

### Enable HTTPS/SSL

Both Render and Netlify auto-configure SSL. Verify:
- Backend: Settings → SSL/TLS (should be enabled)
- Frontend: Domain → SSL (should show "Managed by Netlify")

### Configure Security Headers

Update `backend/config/settings.py`:
```python
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_SECURITY_POLICY = {
        "default-src": ("'self'",),
        "script-src": ("'self'", "'unsafe-inline'"),
        "style-src": ("'self'", "'unsafe-inline'"),
        "img-src": ("'self'", "data:", "https:", "*.cloudinary.com"),
    }
```

### Database Security

1. PostgreSQL user should have minimal permissions
2. Enable SSL connections (Render does this by default)
3. Set up automated backups:
   - Render: Settings → Backups (automatic daily)
   - AWS RDS: Enable automated backups, 30-day retention

### Secrets Management

Never commit `.env` files. Use:
- Render environment variables
- Netlify environment variables
- GitHub Secrets for CI/CD (if using)

## 📊 Step 7: Monitor and Maintain

### Render Monitoring

1. Dashboard → Metrics tab
2. Monitor:
   - CPU usage
   - Memory usage
   - Error rates
   - Response times

### Netlify Monitoring

1. Analytics dashboard
2. Monitor:
   - Build times
   - Deploy history
   - Page load performance
   - Error logs

### Set Up Alerts

**Render:**
1. Settings → Notifications
2. Enable email alerts for:
   - Deploy failures
   - High resource usage

**Netlify:**
1. Site settings → Build & deploy → Deploy notifications
2. Add webhook for Slack/Discord

### Database Maintenance

```bash
# Monthly backup check
pg_dump -U broker_admin -h localhost broker_property_db > backup.sql

# Analyze query performance
ANALYZE;

# Vacuum tables
VACUUM;
```

## 🔄 Step 8: Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Render
        run: |
          curl -X POST https://api.render.com/deploy/srv-${{ secrets.RENDER_SERVICE_ID }}?key=${{ secrets.RENDER_API_KEY }}
      
      - name: Deploy to Netlify
        run: |
          npm ci
          npm run build
          netlify deploy --prod --dir=frontend/dist --auth=${{ secrets.NETLIFY_AUTH_TOKEN }} --site=${{ secrets.NETLIFY_SITE_ID }}
```

## 🚨 Troubleshooting

### Backend not connecting to database

1. Check DATABASE_URL in Render environment
2. Verify PostgreSQL is running
3. Check firewall/security groups allow connection
4. Test locally:
   ```bash
   psql $DATABASE_URL
   ```

### Frontend can't reach API

1. Verify VITE_API_URL in Netlify environment
2. Check CORS_ALLOWED_ORIGINS on backend
3. Verify API endpoint is accessible
4. Check browser console for errors
5. Test with curl:
   ```bash
   curl https://your-api.onrender.com/api/auth/check/
   ```

### Cloudinary images not loading

1. Verify CLOUDINARY credentials
2. Check upload folder exists
3. Verify images uploaded successfully
4. Check image URLs are public
5. Test Cloudinary connection:
   ```bash
   python manage.py shell
   from cloudinary import api
   api.resources()
   ```

### Build failures

**Backend:**
1. Check requirements.txt for conflicts
2. Ensure Python 3.11+ compatibility
3. Run locally: `pip install -r requirements.txt`

**Frontend:**
1. Check Node.js 16+ compatibility
2. Clear cache: `rm -rf node_modules package-lock.json && npm install`
3. Check for TypeScript errors

### Performance issues

1. **Backend:**
   - Check database query performance
   - Enable query logging
   - Use Django Debug Toolbar locally
   - Consider caching with Redis

2. **Frontend:**
   - Check bundle size: `npm run build -- --analyze`
   - Enable code splitting
   - Use image optimization
   - Check for memory leaks in React

## 📝 Maintenance Schedule

- **Daily**: Monitor error logs
- **Weekly**: Check database backups
- **Monthly**: Review performance metrics, update dependencies
- **Quarterly**: Security audit, penetration testing
- **Annually**: Update SSL certificates, major version upgrades

## 🔐 Regular Security Tasks

1. Update dependencies monthly
   ```bash
   # Backend
   pip list --outdated
   pip install --upgrade <package>

   # Frontend
   npm outdated
   npm update
   ```

2. Rotate API keys quarterly
3. Review access logs monthly
4. Test disaster recovery quarterly
5. Update firewall rules as needed

## 📞 Support

- Render support: [render.com/support](https://render.com/support)
- Netlify support: [netlify.com/support](https://netlify.com/support)
- Django docs: [docs.djangoproject.com](https://docs.djangoproject.com)
- React docs: [react.dev](https://react.dev)

---

**Last Updated:** 2024

**For assistance, contact development team.**
