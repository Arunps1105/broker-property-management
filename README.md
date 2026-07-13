# 🏠 Broker Property Management System

A complete, production-ready property management application built for real estate brokers. Manage properties, track listings, and handle client inquiries all in one beautiful platform.

**Live Demo:** [Coming Soon]

## 📸 Features Overview

### 🏡 Property Management
- ✅ Add, edit, delete properties with ease
- ✅ Upload up to 10 images per property
- ✅ Store complete property information
- ✅ Track property status (Available/Rented/Sold)
- ✅ Owner contact information and notes

### 🔍 Search & Filtering
- ✅ Instant search across all properties
- ✅ Filter by location, BHK, price range, status
- ✅ Sort by price, date added, BHK count
- ✅ Save search history
- ✅ Advanced query parameters

### 📊 Analytics Dashboard
- ✅ Total properties statistics
- ✅ Properties by location chart
- ✅ Status distribution pie chart
- ✅ BHK distribution chart
- ✅ Average rent calculation
- ✅ Recently added properties widget

### 📱 User Experience
- ✅ Beautiful glassmorphism UI design
- ✅ Smooth animations and transitions
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Dark mode support
- ✅ Loading states and skeletons
- ✅ Toast notifications
- ✅ Professional animations

### 🔐 Security
- ✅ Session-based authentication
- ✅ CSRF protection
- ✅ Secure password handling
- ✅ Encrypted cookies
- ✅ CORS configured
- ✅ Environment variables for secrets

### 🚀 Performance
- ✅ Optimized bundle size
- ✅ Image compression via Cloudinary
- ✅ Database indexes for fast queries
- ✅ Pagination support
- ✅ Lazy loading images
- ✅ Efficient API calls

## 🛠️ Tech Stack

### Backend
- **Framework**: Django 4.2.7
- **API**: Django REST Framework 3.14.0
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **Image Storage**: Cloudinary
- **Server**: Gunicorn + Daphne

### Frontend
- **Framework**: React 18.2
- **Build Tool**: Vite 5.0
- **Styling**: Tailwind CSS 3.3
- **State**: Zustand 4.4
- **HTTP**: Axios 1.6
- **Charts**: Recharts 2.10
- **Animations**: Framer Motion 10.16

### Deployment
- **Backend**: Render.com
- **Frontend**: Netlify
- **Database**: PostgreSQL (Render)
- **Media**: Cloudinary
- **DNS**: Your domain

## 📋 Prerequisites

### System Requirements
- Python 3.9+
- Node.js 16+
- npm 8+
- Git
- PostgreSQL 12+ (for production)

### External Services
- Cloudinary account (free tier available)
- Render.com account (free tier available)
- Netlify account (free tier available)

## 🚀 Quick Start (5 minutes)

### Option 1: Docker (Recommended)

```bash
# Clone repository
git clone <repository-url>
cd broker-property-management

# Build and run with Docker
docker-compose up --build

# Access
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# Admin: http://localhost:8000/admin
```

### Option 2: Local Development

#### Backend Setup

```bash
cd backend

# Run setup script
chmod +x setup.sh
./setup.sh

# Or manual setup
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start server
python manage.py runserver
```

Access at: `http://localhost:8000`
Admin panel: `http://localhost:8000/admin`

#### Frontend Setup

```bash
cd frontend

# Run setup script
chmod +x setup.sh
./setup.sh

# Or manual setup
npm install
cp .env.example .env
# Edit .env with backend URL (http://localhost:8000)

# Start dev server
npm run dev
```

Access at: `http://localhost:5173`

## 📚 Project Structure

```
broker-property-management/
├── backend/                    # Django REST API
│   ├── config/                 # Django configuration
│   │   ├── settings.py         # Settings
│   │   ├── urls.py             # URL routing
│   │   └── wsgi.py             # WSGI config
│   ├── properties/             # Properties app
│   │   ├── models.py           # Property models
│   │   ├── serializers.py      # DRF serializers
│   │   ├── views.py            # API views
│   │   ├── filters.py          # Advanced filters
│   │   ├── urls.py             # URLs
│   │   └── admin.py            # Admin config
│   ├── accounts/               # Authentication app
│   │   ├── models.py           # User profile
│   │   ├── views.py            # Auth views
│   │   ├── urls.py             # Auth URLs
│   │   ├── serializers.py      # Auth serializers
│   │   └── signals.py          # User creation signal
│   ├── manage.py               # Django CLI
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example            # Environment template
│   ├── README.md               # Backend docs
│   └── setup.sh                # Setup script
│
├── frontend/                   # React + Vite
│   ├── src/
│   │   ├── pages/             # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Properties.jsx
│   │   │   ├── PropertyDetail.jsx
│   │   │   ├── AddProperty.jsx
│   │   │   └── EditProperty.jsx
│   │   ├── components/         # Reusable components
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   ├── PropertyCard.jsx
│   │   │   └── StatCard.jsx
│   │   ├── api/               # API configuration
│   │   │   ├── client.js      # Axios instance
│   │   │   └── endpoints.js   # API endpoints
│   │   ├── store/             # State management
│   │   │   └── authStore.js   # Auth store
│   │   ├── App.jsx            # Main component
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   ├── .env.example           # Environment template
│   ├── netlify.toml           # Netlify config
│   ├── README.md              # Frontend docs
│   └── setup.sh               # Setup script
│
├── docker-compose.yml         # Docker configuration
├── Dockerfile.backend         # Backend Dockerfile
├── Dockerfile.frontend        # Frontend Dockerfile
├── .gitignore
├── LICENSE
└── README.md                  # This file
```

## 🔧 Configuration

### Backend Configuration

Create `backend/.env`:

```env
# Django
SECRET_KEY=your-secret-key-here-change-in-production
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,yourdomain.com

# Database
DATABASE_URL=sqlite:///db.sqlite3
# For PostgreSQL: postgres://user:password@host:5432/dbname

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://your-frontend.netlify.app

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Session Security
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

### Frontend Configuration

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
VITE_API_BASE_URL=/api

# Production
# VITE_API_URL=https://your-backend.onrender.com
```

## 📖 API Documentation

### Authentication Endpoints
```
POST /api/auth/login/          - Login
POST /api/auth/logout/         - Logout
GET /api/auth/me/              - Current user
GET /api/auth/check/           - Check auth
POST /api/auth/change-password/- Change password
```

### Property Endpoints
```
GET /api/properties/           - List properties
POST /api/properties/          - Create property
GET /api/properties/{id}/      - Get property
PATCH /api/properties/{id}/    - Update property
DELETE /api/properties/{id}/   - Delete property
GET /api/properties/statistics/- Get statistics
GET /api/properties/recent_properties/- Recent
```

### Query Examples
```bash
# Search by place
GET /api/properties/?search=kakkanad

# Filter by price range
GET /api/properties/?rent_min=10000&rent_max=50000

# Filter by BHK
GET /api/properties/?bhk=2&status=available

# Search and filter combined
GET /api/properties/?search=2bhk&place=kakkanad&status=available

# Sort by price (descending)
GET /api/properties/?ordering=-rent

# Pagination
GET /api/properties/?page=1
```

## 🚢 Deployment Guide

### Deploy Backend to Render

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create PostgreSQL Database**
   - Dashboard → PostgreSQL
   - Create new database
   - Copy connection URL

3. **Create Web Service**
   - Dashboard → New → Web Service
   - Connect GitHub repository
   - Select Django project
   - Build command: `pip install -r requirements.txt && python manage.py migrate`
   - Start command: `gunicorn config.wsgi:application`

4. **Set Environment Variables**
   ```
   SECRET_KEY=<generate-new-key>
   DEBUG=False
   DATABASE_URL=<your-postgres-url>
   ALLOWED_HOSTS=your-app.onrender.com
   CLOUDINARY_CLOUD_NAME=<your-value>
   CLOUDINARY_API_KEY=<your-value>
   CLOUDINARY_API_SECRET=<your-value>
   CORS_ALLOWED_ORIGINS=https://your-frontend.netlify.app
   ```

5. **Deploy**
   - Push to main branch
   - Render auto-deploys

### Deploy Frontend to Netlify

1. **Create Netlify Account**
   - Go to https://netlify.com
   - Connect GitHub

2. **Create New Site**
   - Dashboard → Add new site → Import an existing project
   - Select repository
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Set Environment Variables**
   - Site settings → Build & deploy → Environment
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```

4. **Deploy**
   - Push to main branch
   - Netlify auto-deploys

### Configure Custom Domain

**For Netlify:**
1. Domain settings → Custom domains
2. Add your domain
3. Update DNS records

**For Render:**
1. Dashboard → Settings → Custom Domains
2. Add domain
3. Update DNS records

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test
python manage.py test properties
python manage.py test accounts
```

### Frontend Tests
```bash
cd frontend
npm run test
npm run test:coverage
```

## 🔒 Security Checklist

✅ Environment variables for secrets
✅ HTTPS enabled in production
✅ CORS properly configured
✅ CSRF protection enabled
✅ Secure cookies (HttpOnly, Secure, SameSite)
✅ Input validation on all fields
✅ SQL injection prevention via ORM
✅ XSS protection via escaping
✅ Rate limiting enabled
✅ Secrets not in version control

## 📊 Performance Tips

**Backend:**
- Use database indexes (already configured)
- Enable query caching
- Use CDN for static files
- Compress API responses
- Monitor database performance

**Frontend:**
- Use code splitting
- Lazy load images
- Minimize bundle size
- Cache API responses
- Monitor Core Web Vitals

## 🤝 Contributing

1. Clone repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Open pull request

## 📝 License

Proprietary - Built for your father's real estate business

## 👨‍💼 Contact

For support or questions, contact development team.

## 🙏 Acknowledgments

- Built with Django & React
- Styled with Tailwind CSS
- Animations with Framer Motion
- Icons from React Icons
- Charts with Recharts
- Deployed on Render & Netlify

---

**Made with ❤️ for efficient property management**

Last Updated: 2024
