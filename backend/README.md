# Broker Property Management - Backend API

A powerful Django REST API for managing residential properties with advanced filtering, image uploads, and analytics.

## Features

✅ **Authentication**
- Session-based login/logout
- Secure password handling
- User profile management

✅ **Property Management**
- Complete CRUD operations
- Up to 10 images per property
- Advanced filtering and search
- Full-text search across properties
- Property status tracking (Available/Rented/Sold)

✅ **Media Handling**
- Cloudinary integration for image storage
- Automatic image optimization
- Support for up to 10 images per property

✅ **Analytics**
- Property statistics dashboard
- Property distribution by place
- Property distribution by BHK
- Property distribution by status
- Average rent calculations

✅ **Search History**
- Track user searches
- View recent searches
- Clear search history

## Tech Stack

- **Framework**: Django 4.2.7
- **API**: Django REST Framework 3.14.0
- **Database**: SQLite (dev) / PostgreSQL (production)
- **Image Storage**: Cloudinary
- **Authentication**: Django Session
- **API Documentation**: OpenAPI/Swagger ready

## Installation

### Prerequisites

- Python 3.9+
- pip
- Virtual environment support

### Quick Setup (Linux/Mac)

```bash
# Run the setup script
chmod +x setup.sh
./setup.sh
```

### Manual Setup

1. **Create virtual environment**
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies**
```bash
pip install -r requirements.txt
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Run migrations**
```bash
python manage.py migrate
```

5. **Create superuser**
```bash
python manage.py createsuperuser
```

6. **Run development server**
```bash
python manage.py runserver
```

Access the API at `http://localhost:8000/`
Access admin panel at `http://localhost:8000/admin/`

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=sqlite:///db.sqlite3
# For PostgreSQL: postgres://user:password@localhost:5432/broker_db

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## API Endpoints

### Authentication
- `POST /api/auth/login/` - Login
- `POST /api/auth/logout/` - Logout
- `GET /api/auth/me/` - Current user
- `GET /api/auth/check/` - Check authentication
- `POST /api/auth/change-password/` - Change password

### Properties
- `GET /api/properties/` - List properties (paginated)
- `POST /api/properties/` - Create property
- `GET /api/properties/{id}/` - Get property detail
- `PATCH /api/properties/{id}/` - Update property
- `DELETE /api/properties/{id}/` - Delete property
- `GET /api/properties/statistics/` - Get statistics
- `GET /api/properties/recent_properties/` - Get recent properties
- `POST /api/properties/bulk_delete/` - Bulk delete properties
- `POST /api/properties/{id}/export_pdf/` - Export as PDF
- `POST /api/properties/{id}/export_excel/` - Export as Excel

### Query Parameters

**List Properties:**
```
?search=kakkanad&place=kakkanad&bhk=2&status=available
?rent_min=10000&rent_max=50000&house_type=apartment
?furnishing=furnished&parking=true
?ordering=-rent  # Sort by rent (descending)
?page=1  # Pagination
```

**Search Fields:**
- owner_name
- place
- complete_address
- primary_phone
- area

**Filter Options:**
- place (case-insensitive)
- bhk (exact match)
- rent_min / rent_max (range)
- house_type (apartment, villa, house, land, commercial)
- status (available, rented, sold)
- furnishing_status (unfurnished, semi-furnished, furnished)
- owner_name (case-insensitive)
- primary_phone
- parking (true/false)
- power_backup (true/false)

## Database Models

### Property
```python
owner_name: CharField(100)
primary_phone: CharField(15)
secondary_phone: CharField(15, optional)
whatsapp_number: CharField(15, optional)
place: CharField(100, indexed)
area: CharField(100)
complete_address: TextField
google_maps_link: URLField(optional)
olx_link: URLField(optional)
latitude: FloatField(optional)
longitude: FloatField(optional)
bhk: IntegerField
floor: IntegerField(optional)
house_type: Choice(apartment, villa, house, land, commercial)
rent: IntegerField
advance: IntegerField(optional)
square_feet: IntegerField(optional)
parking: BooleanField
water_availability: CharField(50)
power_backup: BooleanField
furnishing_status: Choice(unfurnished, semi-furnished, furnished)
facilities: TextField
description: TextField
broker_notes: TextField
status: Choice(available, rented, sold, indexed)
created_at: DateTimeField(auto_now_add, indexed)
updated_at: DateTimeField(auto_now)
created_by: ForeignKey(User)
```

### PropertyImage
```python
property: ForeignKey(Property)
image: CloudinaryField
uploaded_at: DateTimeField(auto_now_add)
order: IntegerField (for ordering)
```

### SearchHistory
```python
user: ForeignKey(User)
query: CharField(255)
searched_at: DateTimeField(auto_now_add)
```

## Deployment

### Deploy to Render

1. **Create Render account** at https://render.com

2. **Connect GitHub repository**

3. **Create PostgreSQL database**
   - Name: broker_db
   - User: your_user
   - Password: strong_password
   - Region: Choose closest to your location

4. **Create Web Service**
   - Connect your GitHub repo
   - Build command: `pip install -r requirements.txt && python manage.py migrate`
   - Start command: `gunicorn config.wsgi:application`
   - Set environment variables:
     ```
     SECRET_KEY=<generate-random-key>
     DEBUG=False
     DATABASE_URL=<postgres-url-from-render>
     ALLOWED_HOSTS=your-domain.onrender.com
     CLOUDINARY_CLOUD_NAME=<your-value>
     CLOUDINARY_API_KEY=<your-value>
     CLOUDINARY_API_SECRET=<your-value>
     CORS_ALLOWED_ORIGINS=https://your-frontend-domain.netlify.app
     ```

5. **Configure Cloudinary**
   - Sign up at https://cloudinary.com
   - Get your Cloud Name, API Key, and API Secret
   - Add to Render environment variables

6. **Deploy**
   - Render auto-deploys on git push
   - Check deployment logs at Render dashboard

### Deploy to Heroku (Alternative)

```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set SECRET_KEY=<generate-random-key>
heroku config:set DEBUG=False
heroku config:set CLOUDINARY_CLOUD_NAME=<your-value>
# ... set other vars

# Deploy
git push heroku main
```

## Admin Panel

Access admin panel at `/admin/` with superuser credentials.

**Features:**
- Manage properties
- Manage users
- Manage search history
- Edit property images
- Bulk actions

## Performance Optimization

- Database indexed on frequently queried fields (place, status, created_at)
- Pagination enabled (12 items per page)
- Image optimization via Cloudinary
- Query optimization with select_related/prefetch_related

## Security Features

- CSRF protection
- Secure session cookies
- CORS configured
- SQL injection prevention via ORM
- Input validation on all endpoints
- Password hashing with Django's default algorithm

## Testing

```bash
# Run tests
python manage.py test

# Run specific test
python manage.py test properties.tests

# With coverage
coverage run --source='.' manage.py test
coverage report
```

## Troubleshooting

### Migrations fail
```bash
# Reset migrations (development only!)
python manage.py migrate properties zero
python manage.py migrate accounts zero
python manage.py migrate
```

### Cloudinary images not showing
- Verify CLOUDINARY credentials in .env
- Check Cloudinary dashboard for upload folder

### Database connection error
- Verify DATABASE_URL is correct
- Check if PostgreSQL service is running
- For development, use SQLite

### CORS errors
- Add frontend URL to CORS_ALLOWED_ORIGINS in .env
- Restart server after changing .env

## License

Proprietary - Built for your father's real estate business

## Support

For issues or questions, contact development team.
