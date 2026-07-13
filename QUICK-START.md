# ⚡ Quick Start Guide

Get up and running with the Broker Property Management System in 5 minutes.

## 🎯 Option 1: Docker (Fastest - 3 minutes)

### Prerequisites
- Docker installed
- Docker Compose installed

### Steps

```bash
# 1. Clone the project
git clone <your-repo-url>
cd broker-property-management

# 2. Start all services
docker-compose up --build

# 3. Create superuser (in another terminal)
docker-compose exec backend python manage.py createsuperuser

# 4. Access the app
# Frontend: http://localhost:3000 or http://localhost:5173
# Backend: http://localhost:8000
# Admin: http://localhost:8000/admin
```

**That's it! 🎉**

---

## 🎯 Option 2: Local Development (5 minutes)

### Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Setup environment
cp .env.example .env
# Edit .env if needed, default is fine for local dev

# 5. Run migrations
python manage.py migrate

# 6. Create superuser
python manage.py createsuperuser

# 7. Start server
python manage.py runserver
```

**Backend running at:** `http://localhost:8000`

### Frontend Setup (New Terminal)

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# .env defaults to http://localhost:8000 - that's correct!

# 4. Start dev server
npm run dev
```

**Frontend running at:** `http://localhost:5173`

---

## 📚 Default Credentials

**Admin User:**
- Username: `admin`
- Password: `admin123` (or whatever you set)

**Database:**
- Type: SQLite (default)
- Location: `backend/db.sqlite3`

---

## ✅ Verification Checklist

After startup, verify everything works:

```bash
# Terminal 1: Check backend
curl http://localhost:8000/api/auth/check/
# Should return: {"authenticated": false} (OK if not logged in)

# Terminal 2: Check frontend loads
curl http://localhost:5173/
# Should return HTML

# Browser: Access frontend
# http://localhost:5173
# Should show login page

# Browser: Login
# Username: admin (or your username)
# Password: your-password
# Should redirect to dashboard
```

---

## 🗂️ Project Structure (5-Second Overview)

```
broker-property-management/
├── backend/              ← Django REST API
│   ├── properties/       ← Property CRUD
│   ├── accounts/         ← Authentication
│   └── manage.py         ← Run migrations here
│
├── frontend/             ← React app
│   ├── src/pages/        ← Page components
│   ├── src/components/   ← Reusable components
│   └── src/api/          ← API calls
│
├── docker-compose.yml    ← For Docker
├── README.md             ← Full documentation
├── DEPLOYMENT.md         ← Production guide
└── API-TESTING.md        ← API examples
```

---

## 🔄 Common Commands

### Backend

```bash
cd backend

# Create migration
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run tests
python manage.py test

# Access Django shell
python manage.py shell

# Reset database (WARNING: deletes data)
python manage.py flush
```

### Frontend

```bash
cd frontend

# Install new package
npm install <package-name>

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 🐛 Troubleshooting

### "Port 8000 already in use"
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9  # Mac/Linux
# Or specify different port:
python manage.py runserver 8001
```

### "Port 5173 already in use"
```bash
# Specify different port
npm run dev -- --port 3001
```

### "Module not found" (Python)
```bash
# Make sure virtual environment is activated
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### "npm: command not found"
```bash
# Install Node.js from https://nodejs.org
# Verify installation
node --version
npm --version
```

### "Database locked" error
```bash
# Remove and recreate database
rm backend/db.sqlite3
python manage.py migrate
```

### "CORS error" in browser
```bash
# This usually means backend isn't running
# Make sure both terminals have services running

# Check backend is responding
curl http://localhost:8000/api/auth/check/
```

---

## 📱 Test the Features

### 1. Add a Property
- Click "Add Property" in sidebar
- Fill the form (asterisks are required)
- Upload at least 1 image
- Submit

### 2. View Properties
- Click "Properties" in sidebar
- See list of all properties
- Click a property to view details

### 3. Search
- Go to Properties
- Type in search box
- Results update instantly

### 4. Filter
- Go to Properties
- Click "Filters"
- Select criteria
- See filtered results

### 5. Edit Property
- Click property card
- Click "Edit" button
- Modify details
- Update

### 6. Dashboard
- Click dashboard link
- See statistics and charts
- View recent properties

---

## 🔐 Authentication Flow

1. **User enters credentials** on login page
2. **Django verifies** username and password
3. **Session created** (stored in browser as cookie)
4. **User redirected** to dashboard
5. **Subsequent requests** include session cookie automatically
6. **API verifies** session is valid
7. **User logout** clears session

---

## 📊 Database Schema

### Properties Table
```
- id (primary key)
- owner_name
- primary_phone
- place (indexed)
- bhk
- rent
- house_type
- status (indexed)
- created_at (indexed)
- ... (and many more fields)
```

### Property Images Table
```
- id
- property_id (foreign key)
- image (Cloudinary URL)
- order
```

### Users Table (Django)
```
- id
- username (unique)
- password (hashed)
- email
- first_name
- last_name
```

---

## 🚀 Next Steps

1. **Read the full README**
   - `backend/README.md` - Backend documentation
   - `frontend/README.md` - Frontend documentation
   - `DEPLOYMENT.md` - Production deployment guide

2. **Explore the API**
   - Read `API-TESTING.md` for examples
   - Test endpoints with cURL or Postman

3. **Deploy to Production**
   - Follow `DEPLOYMENT.md`
   - Uses Render + Netlify

4. **Customize**
   - Update colors in `frontend/tailwind.config.js`
   - Update API settings in `backend/config/settings.py`
   - Add new features

---

## 💡 Tips & Tricks

### Enable Debug Toolbar (Frontend)
```javascript
// Add to Browser Console:
localStorage.setItem('debug', 'true');
location.reload();
```

### View API Responses in Browser
```javascript
// In Browser Console:
console.log(localStorage);  // View cached data
```

### Test API with cURL
```bash
# Get all properties
curl http://localhost:8000/api/properties/

# With authentication
curl -H "Cookie: sessionid=<your-session-id>" \
  http://localhost:8000/api/properties/
```

### Performance Check
```bash
# Frontend build size
cd frontend && npm run build
# Check the dist/ folder size

# Unused dependencies
npm audit
npm outdated
```

---

## 📞 Getting Help

1. **Check documentation**
   - Backend docs: `backend/README.md`
   - Frontend docs: `frontend/README.md`
   - Deployment guide: `DEPLOYMENT.md`

2. **Check API testing guide**
   - `API-TESTING.md` has examples

3. **Common issues**
   - See "Troubleshooting" section above

4. **Code comments**
   - All code is well-commented
   - Check `src/api/endpoints.js` for all API calls

---

## ✨ What's Included

✅ Complete backend with Django REST Framework
✅ Beautiful frontend with React + Tailwind
✅ Property CRUD operations
✅ Image upload support
✅ Search and filtering
✅ Analytics dashboard
✅ Authentication system
✅ Responsive design
✅ Dark mode support
✅ Docker setup
✅ Deployment guides
✅ API documentation
✅ Professional UI/UX

---

## 🎓 Learning Resources

- **Django**: https://docs.djangoproject.com
- **React**: https://react.dev
- **Tailwind**: https://tailwindcss.com
- **Vite**: https://vitejs.dev
- **REST API**: https://restfulapi.net

---

## 📝 Notes

- **Local storage**: Uses SQLite, safe for local development
- **Images**: Upload locally or set up Cloudinary for production
- **Email**: Not required for basic operation
- **Backups**: Add periodic database backups in production
- **Security**: Change SECRET_KEY in production

---

**Happy coding! 🚀**

For more details, see the full documentation:
- `README.md` - Project overview
- `backend/README.md` - Backend guide
- `frontend/README.md` - Frontend guide
- `DEPLOYMENT.md` - Production deployment

---

Last Updated: 2024
